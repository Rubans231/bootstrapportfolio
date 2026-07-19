import { cacheGet, cacheSet } from "./cache";

export const WELCOME_PATH = "__welcome__";

export const VAULT_OWNER = "Rubans231";
export const VAULT_REPO = "Personal-Notes";
export const VAULT_BRANCH = "main";

/** Raw shape of a single entry in ZenNotes' own metadata cache. */
interface RawCacheEntry {
  meta: {
    path: string;
    title: string;
    tags?: string[];
    wikilinks?: string[];
  };
}

export interface VaultNote {
  path: string;
  title: string;
  wikilinks: string[];
}

export interface TreeNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: TreeNode[];
}

export interface GraphNode {
  id: string;
  path: string;
  group: "note" | "tag";
  cluster: string;
  degree: number;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface VaultData {
  tree: TreeNode[];
  notes: VaultNote[];
  titleToPath: Map<string, string>;
  graph: { nodes: GraphNode[]; links: GraphLink[]; meta: { notes: number; tags: number; links: number } };
  defaultPath: string | null;
}

const CLUSTER_MAP: Record<string, string> = {
  japan: "japanese",
  japanese: "japanese",
  algorithm: "dsa",
  complexity: "dsa",
  "universal math": "dsa",
  interview: "dsa",
  "computer science": "dsa",
  coding: "dsa",
  python: "dsa",
  "machine learning": "ml",
  "recommendation system": "ml",
  visionmodel: "ml",
  aitools: "ml",
  imagegenerator: "genai",
  videogeneration: "genai",
  textgeneration: "genai",
  worldgeneration: "genai",
  "3dgeneration": "genai",
  clothswapper: "genai",
  storyboard: "genai",
  "interactive video": "genai",
  panaromicvideogeneration: "genai",
  linux: "systems",
  windows: "systems",
  mobile: "systems",
  hardware: "systems",
  tools: "systems",
  opensource: "systems",
  equalizer: "systems",
};

function buildTree(notes: VaultNote[]): TreeNode[] {
  const root: TreeNode[] = [];

  function insert(parts: string[], fullPath: string, siblings: TreeNode[], prefix: string) {
    const [head, ...rest] = parts;
    const currentPath = prefix ? `${prefix}/${head}` : head;

    if (rest.length === 0) {
      siblings.push({ name: head, path: fullPath, type: "file" });
      return;
    }
    let folder = siblings.find((n) => n.type === "folder" && n.name === head);
    if (!folder) {
      folder = { name: head, path: currentPath, children: [], type: "folder" };
      siblings.push(folder);
    }
    insert(rest, fullPath, folder.children!, currentPath);
  }

  for (const note of notes) {
    insert(note.path.split("/"), note.path, root, "");
  }

  function sortRec(nodes: TreeNode[]) {
    nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    for (const n of nodes) if (n.children) sortRec(n.children);
  }
  sortRec(root);

  return root;
}

function buildGraph(notes: VaultNote[]) {
  const nodes = new Map<string, GraphNode>();

  for (const note of notes) {
    const isTagFile = note.path.startsWith("3 - Tags/");
    nodes.set(note.title.toLowerCase(), {
      id: note.title,
      path: note.path,
      group: isTagFile ? "tag" : "note",
      cluster: isTagFile ? CLUSTER_MAP[note.title.toLowerCase()] ?? "misc" : "misc",
      degree: 0,
    });
  }

  // notes inherit the cluster of whichever tag-nodes they link to (majority vote)
  for (const note of notes) {
    const key = note.title.toLowerCase();
    const node = nodes.get(key);
    if (!node || node.group === "tag") continue;
    const votes: Record<string, number> = {};
    for (const wl of note.wikilinks) {
      const c = CLUSTER_MAP[wl.toLowerCase()];
      if (c) votes[c] = (votes[c] ?? 0) + 1;
    }
    const entries = Object.entries(votes);
    node.cluster = entries.length ? entries.sort((a, b) => b[1] - a[1])[0][0] : "misc";
  }

  const links: GraphLink[] = [];
  const seen = new Set<string>();
  for (const note of notes) {
    for (const wl of note.wikilinks) {
      const key = wl.toLowerCase();
      if (key === note.title.toLowerCase()) continue;
      const target = nodes.get(key);
      if (!target) continue;
      const pair = [note.title, target.id].sort().join("::");
      if (seen.has(pair)) continue;
      seen.add(pair);
      links.push({ source: note.title, target: target.id });
    }
  }

  for (const l of links) {
    const s = nodes.get(l.source.toLowerCase());
    const t = nodes.get(l.target.toLowerCase());
    if (s) s.degree++;
    if (t) t.degree++;
  }

  const nodeList = [...nodes.values()];
  return {
    nodes: nodeList,
    links,
    meta: {
      notes: nodeList.filter((n) => n.group === "note").length,
      tags: nodeList.filter((n) => n.group === "tag").length,
      links: links.length,
    },
  };
}

export async function fetchVault(): Promise<VaultData | null> {
  const key = `gh:vault:${VAULT_OWNER}/${VAULT_REPO}@${VAULT_BRANCH}`;
  const cached = cacheGet<VaultData>(key);
  if (cached) {
    return { ...cached, titleToPath: new Map(cached.titleToPath as unknown as [string, string][]) };
  }

  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/${VAULT_OWNER}/${VAULT_REPO}/${VAULT_BRANCH}/.zennotes/note-meta-cache-v1.json`
    );
    if (!res.ok) return null;
    const raw = (await res.json()) as { entries: RawCacheEntry[] };

    const notes: VaultNote[] = raw.entries
      .map((e) => e.meta)
      .filter((m) => !m.path.startsWith("5 - Template"))
      .map((m) => ({ path: m.path, title: m.title, wikilinks: m.wikilinks ?? [] }));

    const tree = buildTree(notes);
    const graph = buildGraph(notes);
    const titleToPath = new Map(notes.map((n) => [n.title.toLowerCase(), n.path]));

    const defaultPath =
      notes.find((n) => n.path.toLowerCase() === "readme.md")?.path ?? notes[0]?.path ?? null;

    const data: VaultData = { tree, notes, titleToPath, graph, defaultPath };

    cacheSet(key, { ...data, titleToPath: [...titleToPath.entries()] });
    return data;
  } catch {
    return null;
  }
}

export async function fetchNoteContent(path: string): Promise<string | null> {
  const key = `gh:note:${VAULT_OWNER}/${VAULT_REPO}@${VAULT_BRANCH}:${path}`;
  const cached = cacheGet<string>(key);
  if (cached !== null) return cached;

  try {
    const encodedPath = path.split("/").map(encodeURIComponent).join("/");
    const res = await fetch(
      `https://raw.githubusercontent.com/${VAULT_OWNER}/${VAULT_REPO}/${VAULT_BRANCH}/${encodedPath}`
    );
    if (!res.ok) return null;
    const text = await res.text();
    cacheSet(key, text);
    return text;
  } catch {
    return null;
  }
}
