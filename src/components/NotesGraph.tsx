import { useEffect, useRef, useState } from "react";
import ForceGraph from "force-graph";
import { useSearchParams } from "react-router-dom";
import graphData from "../data/vaultGraph.json";

interface GNode {
  id: string;
  group: "note" | "source" | "tag" | "visual";
  cluster: string;
  degree: number;
}

const CLUSTER_COLOR: Record<string, string> = {
  japanese: "#e0a35c",
  dsa: "#7dbfff",
  ml: "#b79ee6",
  genai: "#e0a3d0",
  systems: "#9ece6a",
  misc: "#8b8578",
};

const CLUSTER_LABEL: Record<string, string> = {
  japanese: "Japanese study",
  dsa: "DSA / algorithms",
  ml: "Machine learning",
  genai: "GenAI tooling",
  systems: "Linux / systems",
  misc: "misc / general",
};

export default function NotesGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<GNode | null>(null);
  const [params] = useSearchParams();
  const focus = params.get("focus")?.toLowerCase() ?? null;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const focusNeighbors = (() => {
      if (!focus) return null;
      const ids = new Set<string>();
      for (const l of graphData.links as { source: string; target: string }[]) {
        if (l.source.toLowerCase() === focus) ids.add(l.target);
        if (l.target.toLowerCase() === focus) ids.add(l.source);
      }
      ids.add(focus);
      return ids;
    })();

    const graph = new ForceGraph(el)
      .graphData({
        nodes: (graphData.nodes as GNode[]).map((n) => ({ ...n })),
        links: (graphData.links as { source: string; target: string }[]).map((l) => ({
          ...l,
        })),
      })
      .width(el.clientWidth)
      .height(el.clientHeight)
      .backgroundColor("rgba(0,0,0,0)")
      .nodeId("id")
      .nodeVal((n: object) => {
        const node = n as GNode;
        return node.group === "tag" ? 3 + node.degree * 0.15 : 1.4;
      })
      .nodeColor((n: object) => {
        const node = n as GNode;
        const base = CLUSTER_COLOR[node.cluster] ?? CLUSTER_COLOR.misc;
        if (focusNeighbors && !focusNeighbors.has(node.id.toLowerCase())) {
          return "rgba(120,115,105,0.15)";
        }
        return base;
      })
      .nodeLabel((n: object) => {
        const node = n as GNode;
        return `${node.id} — ${CLUSTER_LABEL[node.cluster] ?? node.cluster}`;
      })
      .linkColor(() => "rgba(191,141,99,0.12)")
      .linkWidth(0.6)
      .cooldownTicks(100)
      .warmupTicks(80)
      .onNodeClick((n: object) => setSelected(n as GNode));

    const onResize = () => {
      graph.width(el.clientWidth).height(el.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      graph._destructor();
      el.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);

  return (
    <div className="notes-graph-wrap">
      <div className="notes-graph-canvas" ref={containerRef} />

      <aside className="notes-side">
        {selected ? (
          <div className="notes-selected">
            <p className="notes-selected-title">{selected.id}</p>
            <p className="notes-selected-meta">
              {CLUSTER_LABEL[selected.cluster] ?? selected.cluster} · {selected.group} ·{" "}
              {selected.degree} connection{selected.degree === 1 ? "" : "s"}
            </p>
          </div>
        ) : (
          <div className="notes-empty">
            <p>click a node to see what it is.</p>
          </div>
        )}

        <div className="notes-legend">
          {Object.entries(CLUSTER_LABEL).map(([k, label]) => (
            <div key={k} className="notes-legend-row">
              <span className="notes-legend-dot" style={{ background: CLUSTER_COLOR[k] }} />
              <span>{label}</span>
            </div>
          ))}
        </div>

        <p className="notes-stats">
          {graphData.meta.notes} notes · {graphData.meta.tags} tags ·{" "}
          {graphData.meta.links} connections
        </p>
      </aside>
    </div>
  );
}
