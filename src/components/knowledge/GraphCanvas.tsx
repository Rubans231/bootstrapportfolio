import { useEffect, useRef } from "react";
import ForceGraph3D from "3d-force-graph";
import SpriteText from "three-spritetext";
import type { Object3D } from "three";
import { useSearchParams } from "react-router-dom";
import type { GraphNode, GraphLink } from "../../lib/vault";

interface Props {
  nodes: GraphNode[];
  links: GraphLink[];
  onNodeOpen?: (path: string) => void;
}

type SimNode = GraphNode & {
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
};

const CLUSTER_COLOR: Record<string, string> = {
  japanese: "#e0a35c",
  dsa: "#7dbfff",
  ml: "#b79ee6",
  genai: "#e0a3d0",
  systems: "#9ece6a",
  misc: "#8b8578",
};

// Tuning knobs for the "planet" feel — all in graph-space units.
const SPHERE_RADIUS = 220; // every node is gently pulled toward this distance from center
const SPHERE_PULL = 0.05; // how strongly nodes are held to the shell (0-1ish)
const LINK_DISTANCE = 26; // shorter = connected nodes hug tighter into visible clusters
const CHARGE_STRENGTH = -6; // weak repulsion — just enough to avoid total overlap
const REPEL_RADIUS = 70; // mouse influence radius
const REPEL_STRENGTH = 3; // gentle push, additive to the ambient flow
const AUTO_ROTATE_SPEED = 0.35; // slow "planet" spin
const REHEAT_INTERVAL_MS = 2600; // keeps the shell gently alive instead of ever fully freezing

export default function GraphCanvas({ nodes, links, onNodeOpen }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [params] = useSearchParams();
  const focusParam = params.get("focus")?.toLowerCase() ?? null;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || nodes.length === 0) return;

    const isSmallScreen = el.clientWidth < 700;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const lite = isSmallScreen || prefersReducedMotion;

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
    let mouse: { x: number; y: number; z: number } | null = null;

    const Graph = new ForceGraph3D(el)
      .graphData({ nodes: nodeCopies, links: linkCopies })
      .width(el.clientWidth)
      .height(el.clientHeight)
      .backgroundColor("rgba(0,0,0,0)")
      .showNavInfo(false)
      .nodeRelSize(2.4)
      .nodeVal((n: object) => {
        const node = n as GraphNode;
        return node.group === "tag" ? 2.4 + node.degree * 0.12 : 1;
      })
      .nodeColor((n: object) => {
        const node = n as GraphNode;
        const base = CLUSTER_COLOR[node.cluster] ?? CLUSTER_COLOR.misc;
        const active = activeId();
        if (!active) return base;
        if (node.id === active) return base;
        return neighborMap.get(active)?.has(node.id) ? base : "rgba(120,115,105,0.18)";
      })
      .nodeLabel((n: object) => (n as GraphNode).id)
      .nodeThreeObjectExtend(true)
      .nodeThreeObject((n: object) => {
        const node = n as GraphNode;
        if (lite && node.group !== "tag") return null as unknown as Object3D;
        const label = new SpriteText(
          node.id,
          node.group === "tag" ? 3.6 : 2.6,
          CLUSTER_COLOR[node.cluster] ?? CLUSTER_COLOR.misc
        );
        label.material.depthWrite = false;
        label.position.set(0, node.group === "tag" ? -6 : -4, 0);
        return label;
      })
      .linkColor((l: object) => {
        const link = l as { source: { id?: string } | string; target: { id?: string } | string };
        const active = activeId();
        const s = typeof link.source === "string" ? link.source : link.source.id;
        const t = typeof link.target === "string" ? link.target : link.target.id;
        if (!active) return "rgba(191,141,99,0.18)";
        return s === active || t === active
          ? "rgba(224,163,92,0.6)"
          : "rgba(191,141,99,0.06)";
      })
      .linkWidth(0.5)
      .linkOpacity(0.6)
      .cooldownTime(Infinity)
      .onNodeHover((n: object | null) => {
        hoveredId = n ? (n as GraphNode).id : null;
        el.style.cursor = n ? "pointer" : "default";
      })
      .onNodeClick((n: object) => {
        const node = n as GraphNode;
        if (onNodeOpen && node.group === "note") onNodeOpen(node.path);
      })
      .enableNodeDrag(true);

    const renderer = Graph.renderer();
    if (renderer) {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, lite ? 1.5 : 2));
    }

    // Weaken the default forces — the sphere-shell force below does most of
    // the shaping work, not raw N-body repulsion.
    const charge = Graph.d3Force("charge") as { strength?: (v: number) => void } | undefined;
    charge?.strength?.(CHARGE_STRENGTH);
    const link = Graph.d3Force("link") as { distance?: (v: number) => void } | undefined;
    link?.distance?.(LINK_DISTANCE);

    // Every node — connected or not — is pulled toward a fixed radius from
    // the center, so the whole thing holds a sphere shape instead of
    // sprawling. Nodes still drift/orbit gently within that shell.
    Graph.d3Force("sphere", (alpha: number) => {
      for (const n of Graph.graphData().nodes as SimNode[]) {
        if (n.x === undefined || n.y === undefined || n.z === undefined) continue;
        const r = Math.sqrt(n.x * n.x + n.y * n.y + n.z * n.z) || 1;
        const pull = (SPHERE_RADIUS - r) * SPHERE_PULL * alpha;
        n.vx = (n.vx ?? 0) + (n.x / r) * pull;
        n.vy = (n.vy ?? 0) + (n.y / r) * pull;
        n.vz = (n.vz ?? 0) + (n.z / r) * pull;
      }
    });

    // Gentle mouse-reactive push — additive to the ambient flow, not a
    // freeze/unfreeze mechanic like a 2D hover effect.
    Graph.d3Force("mouseRepel", (alpha: number) => {
      if (!mouse) return;
      for (const n of Graph.graphData().nodes as SimNode[]) {
        if (n.x === undefined || n.y === undefined || n.z === undefined) continue;
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dz = n.z - mouse.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
        if (dist >= REPEL_RADIUS) continue;
        const f = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH * alpha;
        n.vx = (n.vx ?? 0) + (dx / dist) * f;
        n.vy = (n.vy ?? 0) + (dy / dist) * f;
        n.vz = (n.vz ?? 0) + (dz / dist) * f;
      }
    });

    // Slow constant spin, like a planet — OrbitControls handles the actual
    // per-frame rotation internally. Skipped for prefers-reduced-motion.
    const controls = Graph.controls() as { autoRotate?: boolean; autoRotateSpeed?: number };
    if (controls && !prefersReducedMotion) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = AUTO_ROTATE_SPEED;
    }

    // Keep the shell gently alive — a small periodic reheat rather than a
    // one-time settle-then-freeze, so it always reads as "flowing". Backed
    // off on phones / reduced-motion so it isn't a sustained battery drain.
    const reheatInterval = prefersReducedMotion
      ? undefined
      : window.setInterval(
          () => Graph.d3ReheatSimulation(),
          lite ? REHEAT_INTERVAL_MS * 2.5 : REHEAT_INTERVAL_MS
        );

    function handleMouseMove(ev: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      mouse = Graph.screen2GraphCoords(ev.clientX - rect.left, ev.clientY - rect.top, 0);
    }
    function handleMouseLeave() {
      mouse = null;
    }
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    let focusTimeout: number | undefined;
    if (stickyId) {
      // give the shell a moment to form before snapping the camera to a node
      focusTimeout = window.setTimeout(() => {
        const target = Graph.graphData().nodes.find(
          (n) => (n as GraphNode).id === stickyId
        ) as SimNode | undefined;
        if (target?.x !== undefined && target.y !== undefined && target.z !== undefined) {
          const dist = Math.hypot(target.x, target.y, target.z) || 1;
          const ratio = 1 + 60 / dist;
          Graph.cameraPosition(
            { x: target.x * ratio, y: target.y * ratio, z: target.z * ratio },
            { x: target.x, y: target.y, z: target.z },
            1000
          );
        }
      }, 1600);
    }

    const onResize = () => Graph.width(el.clientWidth).height(el.clientHeight);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.clearInterval(reheatInterval);
      window.clearTimeout(focusTimeout);
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      Graph._destructor();
      el.innerHTML = "";
    };
  }, [nodes, links, focusParam, onNodeOpen]);

  return <div className="graph-canvas" ref={containerRef} />;
}
