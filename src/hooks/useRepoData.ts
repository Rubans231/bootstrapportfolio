import { useEffect, useState } from "react";
import { fetchRepoMeta, fetchReadme } from "../lib/github";
import type { RepoMeta } from "../lib/github";

interface RepoData {
  meta: RepoMeta | null;
  readme: string | null;
  loading: boolean;
  failed: boolean;
}

export function useRepoData(repoSlug: string | undefined): RepoData {
  const [state, setState] = useState<RepoData>({
    meta: null,
    readme: null,
    loading: !!repoSlug,
    failed: false,
  });

  useEffect(() => {
    if (!repoSlug) {
      setState({ meta: null, readme: null, loading: false, failed: false });
      return;
    }

    let cancelled = false;
    const [owner, repo] = repoSlug.split("/");

    setState({ meta: null, readme: null, loading: true, failed: false });

    (async () => {
      const meta = await fetchRepoMeta(owner, repo);
      const readme = await fetchReadme(owner, repo, meta?.default_branch ?? "main");

      if (cancelled) return;
      setState({
        meta,
        readme,
        loading: false,
        failed: !meta && !readme,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [repoSlug]);

  return state;
}
