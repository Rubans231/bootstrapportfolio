import { useEffect, useRef } from "react";
import ForceGraph from "force-graph";
import { useSearchParams } from "react-router-dom";
import graphData from "../../data/vaultGraph.json";

interface GNode {
  id: string;
  group: "note" | "source" | "tag" | "visual";
  cluster: string;
  degree: number;
  x?: number;
  y?: number;
}

const CLUSTER_COLOR: Record<string, string> = {
  japanese: "#e0a35c",
  dsa: "#7dbfff",
  ml: "#b79ee6",
  genai: "#e0a3d0",
  systems: "#9ece6a",
  misc: "#8b8578",
};

export default function GraphCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [params] = useSearchParams();
  const focusParam = params.get("focus")?.toLowerCase() ?? null;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const nodes = (graphData.nodes as GNode[]).map((n) => ({ ...n }));
    const links = (graphData.links as { source: string; target: string }[]).map((l) => ({
      ...l,
    }));

    const neighborMap = new Map<string, Set<string>>();
    for (const l of links) {
      if (!neighborMap.has(l.source)) neighborMap.set(l.source, new Set());
      if (!neighborMap.has(l.target)) neighborMap.set(l.target, new Set());
      neighborMap.get(l.source)!.add(l.target);
      neighborMap.get(l.target)!.add(l.source);
    }

    const stickyNode = focusParam
      ? nodes.find((n) => n.id.toLowerCase() === focusParam) ?? null
      : null;
    const stickyId = stickyNode?.id ?? null;

    let hoveredId: string | null = null;
    const activeId = () => hoveredId ?? stickyId;

    const graph = new ForceGraph(el)
      .graphData({ nodes, links })
      .width(el.clientWidth)
      .height(el.clientHeight)
      .backgroundColor("rgba(0,0,0,0)")
      .nodeId("id")
      .nodeVal((n: object) => {
        const node = n as GNode;
        return node.group === "tag" ? 3 + node.degree * 0.15 : 1.3;
      })
      .nodeColor((n: object) => {
        const node = n as GNode;
        const base = CLUSTER_COLOR[node.cluster] ?? CLUSTER_COLOR.misc;
        const active = activeId();
        if (!active) return base;
        if (node.id === active) return base;
        const isNeighbor = neighborMap.get(active)?.has(node.id);
        return isNeighbor ? base : "rgba(120,115,105,0.12)";
      })
      .nodeLabel((n: object) => (n as GNode).id)
      .linkColor((l: object) => {
        const link = l as { source: { id?: string } | string; target: { id?: string } | string };
        const active = activeId();
        if (!active) return "rgba(191,141,99,0.14)";
        const s = typeof link.source === "string" ? link.source : link.source.id;
        const t = typeof link.target === "string" ? link.target : link.target.id;
        return s === active || t === active
          ? "rgba(224,163,92,0.55)"
          : "rgba(191,141,99,0.05)";
      })
      .linkWidth((l: object) => {
        const link = l as { source: { id?: string } | string; target: { id?: string } | string };
        const active = activeId();
        const s = typeof link.source === "string" ? link.source : link.source.id;
        const t = typeof link.target === "string" ? link.target : link.target.id;
        return active && (s === active || t === active) ? 1.4 : 0.5;
      })
      .cooldownTicks(120)
      .warmupTicks(90)
      .onNodeHover((n: object | null) => {
        hoveredId = n ? (n as GNode).id : null;
        el.style.cursor = n ? "pointer" : "default";
      })
      .onEngineStop(() => {
        if (!stickyId) return;
        const target = graph.graphData().nodes.find((n) => (n as GNode).id === stickyId) as
          | GNode
          | undefined;
        if (target?.x !== undefined && target.y !== undefined) {
          graph.centerAt(target.x, target.y, 700);
          graph.zoom(2.4, 700);
        }
      })
      .enableNodeDrag(true);

    const onResize = () => graph.width(el.clientWidth).height(el.clientHeight);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      graph._destructor();
      el.innerHTML = "";
    };
  }, [focusParam]);

  return <div className="graph-canvas" ref={containerRef} />;
}
