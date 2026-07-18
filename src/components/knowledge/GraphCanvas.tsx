import { useEffect, useRef } from "react";
import ForceGraph from "force-graph";
import { useSearchParams } from "react-router-dom";
import type { GraphNode, GraphLink } from "../../lib/vault";

type SimNode = GraphNode & { x?: number; y?: number; vx?: number; vy?: number };

interface Props {
  nodes: GraphNode[];
  links: GraphLink[];
  onNodeOpen?: (path: string) => void;
}

const CLUSTER_COLOR: Record<string, string> = {
  japanese: "#e0a35c",
  dsa: "#7dbfff",
  ml: "#b79ee6",
  genai: "#e0a3d0",
  systems: "#9ece6a",
  misc: "#8b8578",
};

const REPEL_RADIUS = 140;
const REPEL_STRENGTH = 9;

export default function GraphCanvas({ nodes, links, onNodeOpen }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [params] = useSearchParams();
  const focusParam = params.get("focus")?.toLowerCase() ?? null;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || nodes.length === 0) return;

    const nodeCopies = nodes.map((n) => ({ ...n }));
    const linkCopies = links.map((l) => ({ ...l }));

    const neighborMap = new Map<string, Set<string>>();
    for (const l of linkCopies) {
      if (!neighborMap.has(l.source)) neighborMap.set(l.source, new Set());
      if (!neighborMap.has(l.target)) neighborMap.set(l.target, new Set());
      neighborMap.get(l.source)!.add(l.target);
      neighborMap.get(l.target)!.add(l.source);
    }

    const stickyNode = focusParam
      ? nodeCopies.find((n) => n.id.toLowerCase() === focusParam) ?? null
      : null;
    const stickyId = stickyNode?.id ?? null;

    let hoveredId: string | null = null;
    const activeId = () => hoveredId ?? stickyId;

    // reactive "particles" — mouse position in graph space, null when the
    // cursor isn't over the canvas
    let mouse: { x: number; y: number } | null = null;
    let lastReheat = 0;

    const graph = new ForceGraph(el)
      .graphData({ nodes: nodeCopies, links: linkCopies })
      .width(el.clientWidth)
      .height(el.clientHeight)
      .backgroundColor("rgba(0,0,0,0)")
      .nodeId("id")
      .nodeVal((n: object) => {
        const node = n as GraphNode;
        return node.group === "tag" ? 3 + node.degree * 0.15 : 1.3;
      })
      .nodeColor((n: object) => {
        const node = n as GraphNode;
        const base = CLUSTER_COLOR[node.cluster] ?? CLUSTER_COLOR.misc;
        const active = activeId();
        if (!active) return base;
        if (node.id === active) return base;
        const isNeighbor = neighborMap.get(active)?.has(node.id);
        return isNeighbor ? base : "rgba(120,115,105,0.12)";
      })
      .nodeLabel((n: object) => (n as GraphNode).id)
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
      .cooldownTicks(180)
      .warmupTicks(90)
      .onNodeHover((n: object | null) => {
        hoveredId = n ? (n as GraphNode).id : null;
        el.style.cursor = n ? "pointer" : "default";
      })
      .onNodeClick((n: object) => {
        const node = n as GraphNode;
        if (onNodeOpen && node.group === "note") onNodeOpen(node.path);
      })
      .onEngineStop(() => {
        if (!stickyId) return;
        const target = graph.graphData().nodes.find((n) => (n as GraphNode).id === stickyId) as
          | SimNode
          | undefined;
        if (target?.x !== undefined && target.y !== undefined) {
          graph.centerAt(target.x, target.y, 700);
          graph.zoom(2.4, 700);
        }
      })
      .enableNodeDrag(true);

    // Custom force: nodes near the cursor get pushed away, like a particle
    // field reacting to a hand passing over it. Settles back once the mouse
    // moves on and the simulation cools.
    graph.d3Force("mouseRepel", (alpha: number) => {
      if (!mouse) return;
      for (const n of graph.graphData().nodes as SimNode[]) {
        if (n.x === undefined || n.y === undefined) continue;
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist >= REPEL_RADIUS) continue;
        const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH * alpha;
        n.vx = (n.vx ?? 0) + (dx / dist) * force;
        n.vy = (n.vy ?? 0) + (dy / dist) * force;
      }
    });

    function handleMouseMove(ev: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      mouse = graph.screen2GraphCoords(ev.clientX - rect.left, ev.clientY - rect.top);
      const now = performance.now();
      if (now - lastReheat > 120) {
        lastReheat = now;
        graph.d3ReheatSimulation();
      }
    }
    function handleMouseLeave() {
      mouse = null;
    }

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    const onResize = () => graph.width(el.clientWidth).height(el.clientHeight);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      graph._destructor();
      el.innerHTML = "";
    };
  }, [nodes, links, focusParam, onNodeOpen]);

  return <div className="graph-canvas" ref={containerRef} />;
}
