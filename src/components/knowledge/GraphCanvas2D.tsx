import { useEffect, useRef } from "react";
import ForceGraph from "force-graph";
import { useSearchParams } from "react-router-dom";
import type { GraphNode, GraphLink } from "../../lib/vault";
import type { GraphSettings } from "../../hooks/useGraphSettings";

interface Props {
  nodes: GraphNode[];
  links: GraphLink[];
  onNodeOpen?: (path: string) => void;
  settings: GraphSettings;
}

type SimNode = GraphNode & {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
};

type AlphaTargetGraph = { d3AlphaTarget: (v: number) => void };

const CLUSTER_COLOR: Record<string, string> = {
  japanese: "#e0a35c",
  dsa: "#7dbfff",
  ml: "#b79ee6",
  genai: "#e0a3d0",
  systems: "#9ece6a",
  misc: "#8b8578",
};

// Lightweight 2D fallback — flat canvas instead of WebGL. Always live and
// draggable: no freeze, no hover-repel. Nodes hold a circular constellation
// shape by default; "spread out" loosens that. Dragging a node displaces
// nearby ones like pushing through fluid, and they settle back once you
// let go — nothing flies off or stays displaced.
const CIRCLE_RADIUS_TIGHT = 190;
const CIRCLE_RADIUS_SPREAD = 420;
const CIRCLE_PULL = 0.02;
const LINK_DISTANCE = 30;
const CHARGE_STRENGTH = -18;
const DRAG_DISPLACE_RADIUS = 90;
const DRIFT_ALPHA_TARGET = 0.01;

export default function GraphCanvas2D({ nodes, links, onNodeOpen, settings }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [params] = useSearchParams();
  const focusParam = params.get("focus")?.toLowerCase() ?? null;

  // live-tunable refs the running simulation reads each tick
  const fluidityRef = useRef(settings.fluidity);
  const spreadRef = useRef(settings.spreadOut);
  fluidityRef.current = settings.fluidity;
  spreadRef.current = settings.spreadOut;

  const graphApiRef = useRef<{ setDrift: (on: boolean) => void } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || nodes.length === 0) return;

    const nodeCopies: SimNode[] = nodes.map((n) => ({ ...n }));
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

    // position of the node currently being dragged, in graph space — null
    // when nothing is being dragged
    let draggedPos: { x: number; y: number } | null = null;
    let draggedId: string | null = null;

    const graph = new ForceGraph(el)
      .graphData({ nodes: nodeCopies, links: linkCopies })
      .width(el.clientWidth)
      .height(el.clientHeight)
      .backgroundColor("rgba(0,0,0,0)")
      .nodeId("id")
      .nodeVal((n: object) => {
        const node = n as GraphNode;
        return node.group === "tag" ? 3 + node.degree * 0.15 : 1.4;
      })
      .nodeColor((n: object) => {
        const node = n as GraphNode;
        const base = CLUSTER_COLOR[node.cluster] ?? CLUSTER_COLOR.misc;
        const active = activeId();
        if (!active) return base;
        if (node.id === active) return base;
        return neighborMap.get(active)?.has(node.id) ? base : "rgba(120,115,105,0.15)";
      })
      .nodeLabel((n: object) => (n as GraphNode).id)
      .linkColor((l: object) => {
        const link = l as { source: { id?: string } | string; target: { id?: string } | string };
        const active = activeId();
        const s = typeof link.source === "string" ? link.source : link.source.id;
        const t = typeof link.target === "string" ? link.target : link.target.id;
        if (!active) return "rgba(191,141,99,0.14)";
        return s === active || t === active ? "rgba(224,163,92,0.55)" : "rgba(191,141,99,0.05)";
      })
      .linkWidth((l: object) => {
        const link = l as { source: { id?: string } | string; target: { id?: string } | string };
        const active = activeId();
        const s = typeof link.source === "string" ? link.source : link.source.id;
        const t = typeof link.target === "string" ? link.target : link.target.id;
        return active && (s === active || t === active) ? 1.4 : 0.5;
      })
      .cooldownTime(Infinity)
      .warmupTicks(90)
      .onNodeHover((n: object | null) => {
        hoveredId = n ? (n as GraphNode).id : null;
        el.style.cursor = n ? "pointer" : "default";
      })
      .onNodeClick((n: object) => {
        const node = n as GraphNode;
        if (onNodeOpen && node.group === "note") onNodeOpen(node.path);
      })
      .onNodeDrag((n: object) => {
        const node = n as SimNode;
        draggedId = node.id;
        if (node.x !== undefined && node.y !== undefined) {
          draggedPos = { x: node.x, y: node.y };
        }
      })
      .onNodeDragEnd(() => {
        draggedPos = null;
        draggedId = null;
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

    const charge = graph.d3Force("charge") as { strength?: (v: number) => void } | undefined;
    charge?.strength?.(CHARGE_STRENGTH);
    const link = graph.d3Force("link") as { distance?: (v: number) => void } | undefined;
    link?.distance?.(LINK_DISTANCE);

    // Every node — connected or not — is gently pulled toward a circle
    // radius from center. "Spread out" enlarges that radius rather than
    // removing it, so things stay contained instead of flying apart.
    graph.d3Force("circle", (alpha: number) => {
      const radius = spreadRef.current ? CIRCLE_RADIUS_SPREAD : CIRCLE_RADIUS_TIGHT;
      for (const n of graph.graphData().nodes as SimNode[]) {
        if (n.x === undefined || n.y === undefined) continue;
        const r = Math.sqrt(n.x * n.x + n.y * n.y) || 1;
        const pull = (radius - r) * CIRCLE_PULL * alpha;
        n.vx = (n.vx ?? 0) + (n.x / r) * pull;
        n.vy = (n.vy ?? 0) + (n.y / r) * pull;
      }
    });

    // While a node is being dragged, nearby nodes get pushed out of its way
    // like it's moving through fluid — and drift straight back once the
    // drag passes or ends, via the ordinary forces above. Nothing happens
    // here when nothing is being dragged.
    graph.d3Force("dragDisplace", (alpha: number) => {
      if (!draggedPos || !draggedId) return;
      const strength = 2 + fluidityRef.current * 10;
      for (const n of graph.graphData().nodes as SimNode[]) {
        if (n.id === draggedId) continue;
        if (n.x === undefined || n.y === undefined) continue;
        const dx = n.x - draggedPos.x;
        const dy = n.y - draggedPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist >= DRAG_DISPLACE_RADIUS) continue;
        const f = (1 - dist / DRAG_DISPLACE_RADIUS) * strength * alpha;
        n.vx = (n.vx ?? 0) + (dx / dist) * f;
        n.vy = (n.vy ?? 0) + (dy / dist) * f;
      }
    });

    graphApiRef.current = {
      setDrift: (on: boolean) => {
        const fn = (graph as unknown as Partial<AlphaTargetGraph>).d3AlphaTarget;
        if (typeof fn === "function") fn.call(graph, on ? DRIFT_ALPHA_TARGET : 0);
      },
    };
    graphApiRef.current.setDrift(settings.drift2dEnabled);

    let focusTimeout: number | undefined;
    if (stickyId) {
      focusTimeout = window.setTimeout(() => {
        const target = graph.graphData().nodes.find((n) => (n as GraphNode).id === stickyId) as
          | SimNode
          | undefined;
        if (target?.x !== undefined && target.y !== undefined) {
          graph.centerAt(target.x, target.y, 700);
          graph.zoom(2.4, 700);
        }
      }, 1200);
    }

    const onResize = () => graph.width(el.clientWidth).height(el.clientHeight);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(focusTimeout);
      graphApiRef.current = null;
      graph._destructor();
      el.innerHTML = "";
    };
    // settings changes are synced live by the effect below, not by recreating
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, links, focusParam, onNodeOpen]);

  useEffect(() => {
    graphApiRef.current?.setDrift(settings.drift2dEnabled);
  }, [settings.drift2dEnabled]);

  return <div className="graph-canvas" ref={containerRef} />;
}
