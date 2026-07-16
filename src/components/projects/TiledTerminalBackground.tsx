import { useMemo } from "react";
import TerminalTile from "./TerminalTile";
import { renderAsciiBanner } from "../../lib/asciiFont";
import type { Project } from "../../data/projects";

const SHORT_CODES: Record<string, string> = {
  "visual-context-agent": "AGENT",
  "vton-fashion": "VTON",
  "audio-video-sync-daemon": "SYNC",
  "rofi-youtube": "ROFI",
  "genai-video-pipelines": "GENAI",
  "ml-systems": "RAG",
  "this-site": "NOS",
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

  const gitLog = useMemo(() => fakeGitLog(project), [project]);
  const buildLog = useMemo(() => fakeBuildLog(project), [project]);

  return (
    <div className="tiled-terminals" aria-hidden="true">
      <TerminalTile lines={fastfetch} className="tile-hero" speed={10} />
      <TerminalTile lines={gitLog} className="tile-log" speed={16} />
      <TerminalTile lines={buildLog} className="tile-build" speed={14} />
    </div>
  );
}
