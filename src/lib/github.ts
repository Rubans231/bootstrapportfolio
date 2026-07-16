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

const TTL_MS = 60 * 60 * 1000; // 1 hour

function cacheGet<T>(key: string): T | null {
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return null;
    const { at, data } = JSON.parse(raw);
    if (Date.now() - at > TTL_MS) return null;
    return data as T;
  } catch {
    return null;
  }
}

function cacheSet(key: string, data: unknown) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* sessionStorage full or unavailable — fine, just skip caching */
  }
}

/**
 * NOTE on "pinned repos": GitHub's REST API has no public concept of pinned
 * repos — that's only exposed via the GraphQL API with an auth token, which
 * can't be safely embedded in client-side code. So which repos appear here
 * is a small curated list (see data/projects.ts), while everything *about*
 * each repo (stars, language, README, last push) is fetched live and cached
 * for an hour per session.
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
