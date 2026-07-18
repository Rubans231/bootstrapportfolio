import { useEffect, useMemo, useState } from "react";
import TerminalTile from "./TerminalTile";
import { renderAsciiBanner } from "../../lib/asciiFont";
import { fetchProjectLog } from "../../lib/github";
import type { Project } from "../../data/projects";

const SHORT_CODES: Record<string, string> = {
  "visual-context-agent": "AGENT",
  "vton-fashion": "VTON",
  "audio-video-sync-daemon": "SYNC",
  "rofi-youtube": "ROFI",
  "genai-video-pipelines": "GENAI",
  "ml-systems": "RAG",
  "this-site": "SITE",
};

function fakeGitLog(project: Project): string[] {
  const verbs = ["refactor", "fix", "add", "tune", "wire up", "clean up"];
  return project.tech.map(
    (t, i) => `${(7 + i).toString(16)}a3f1c ${verbs[i % verbs.length]}(${t.toLowerCase()}): ${project.id}`
  );
}

function fakeBuildLog(project: Project): string[] {
  return [
    `$ docker build -t ${project.id} .`,
    "[+] Building 4.2s",
    ` => [internal] load build definition`,
    ` => [internal] load metadata`,
    ...project.tech.map((t) => ` => RUN install ${t.toLowerCase().replace(/\s+/g, "-")}`),
    "[+] Build complete",
  ];
}

export default function TiledTerminalBackground({ project }: { project: Project }) {
  const code = SHORT_CODES[project.id] ?? project.id.slice(0, 5).toUpperCase();
  const banner = useMemo(() => renderAsciiBanner(code), [code]);

  // Optional real per-project log — see .portfolio-log convention in the README.
  const [customLog, setCustomLog] = useState<string[] | null>(null);

  useEffect(() => {
    setCustomLog(null);
    if (!project.repoSlug) return;
    let cancelled = false;
    const [owner, repo] = project.repoSlug.split("/");
    fetchProjectLog(owner, repo).then((lines) => {
      if (!cancelled) setCustomLog(lines);
    });
    return () => {
      cancelled = true;
    };
  }, [project]);

  const fastfetch = useMemo(
    () => [
      "$ fastfetch",
      `project ~> ${project.title}`,
      `stack   ~> ${project.tech.slice(0, 3).join(", ")}`,
      "",
      ...banner.split("\n"),
    ],
    [banner, project]
  );

  const gitLog = useMemo(
    () => customLog ?? fakeGitLog(project),
    [customLog, project]
  );
  const buildLog = useMemo(() => fakeBuildLog(project), [project]);

  return (
    <div className="tiled-terminals" aria-hidden="true">
      <TerminalTile lines={fastfetch} className="tile-hero" speed={10} key={`hero-${project.id}`} />
      <TerminalTile lines={gitLog} className="tile-log" speed={16} key={`log-${project.id}-${customLog ? "custom" : "default"}`} />
      <TerminalTile lines={buildLog} className="tile-build" speed={14} key={`build-${project.id}`} />
    </div>
  );
}
