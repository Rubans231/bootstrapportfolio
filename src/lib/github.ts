import { cacheGet, cacheSet } from "./cache";

export interface RepoMeta {
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  pushed_at: string;
  default_branch: string;
  html_url: string;
  homepage: string | null;
}

/**
 * NOTE on "pinned repos": GitHub's REST API has no public concept of pinned
 * repos — that's only exposed via the GraphQL API with an auth token, which
 * can't be safely embedded in client-side code. So which repos appear on the
 * Projects page is a small curated list (see data/projects.ts), while
 * everything *about* each repo (stars, language, README, last push) is
 * fetched live and cached for an hour per session.
 */
export async function fetchRepoMeta(owner: string, repo: string): Promise<RepoMeta | null> {
  const key = `gh:meta:${owner}/${repo}`;
  const cached = cacheGet<RepoMeta>(key);
  if (cached) return cached;

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as RepoMeta;
    cacheSet(key, data);
    return data;
  } catch {
    return null;
  }
}

/**
 * Optional per-project flavor text for the tiled terminal background. If a
 * project's own repo has a `.portfolio-log` file at its root (plain text,
 * one line per entry), those real lines are used instead of the generated
 * placeholder git-log lines. Absent file = silently falls back to the
 * generated content, so this is entirely opt-in.
 */
export async function fetchProjectLog(owner: string, repo: string): Promise<string[] | null> {
  const key = `gh:portfolio-log:${owner}/${repo}`;
  const cached = cacheGet<string[]>(key);
  if (cached) return cached;

  for (const branch of ["main", "master"]) {
    try {
      const res = await fetch(
        `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/.portfolio-log`
      );
      if (!res.ok) continue;
      const text = await res.text();
      const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      if (lines.length === 0) continue;
      cacheSet(key, lines);
      return lines;
    } catch {
      /* try next branch */
    }
  }
  return null;
}

export async function fetchReadme(
  owner: string,
  repo: string,
  branch = "main"
): Promise<string | null> {
  const key = `gh:readme:${owner}/${repo}@${branch}`;
  const cached = cacheGet<string>(key);
  if (cached) return cached;

  for (const candidateBranch of [branch, "main", "master"]) {
    for (const filename of ["README.md", "readme.md"]) {
      try {
        const res = await fetch(
          `https://raw.githubusercontent.com/${owner}/${repo}/${candidateBranch}/${filename}`
        );
        if (res.ok) {
          const text = await res.text();
          cacheSet(key, text);
          return text;
        }
      } catch {
        /* try next candidate */
      }
    }
  }
  return null;
}
