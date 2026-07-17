import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, ChevronDown, FileText, Folder } from "lucide-react";
import type { TreeNode } from "../../lib/vault";

interface Row {
  node: TreeNode;
  depth: number;
}

interface Props {
  tree: TreeNode[];
  activePath: string | null;
  onOpen: (path: string) => void;
}

function flatten(nodes: TreeNode[], expanded: Set<string>, depth: number, out: Row[]) {
  for (const node of nodes) {
    out.push({ node, depth });
    if (node.type === "folder" && expanded.has(node.path) && node.children) {
      flatten(node.children, expanded, depth + 1, out);
    }
  }
}

function ancestorsOf(tree: TreeNode[], targetPath: string): string[] {
  const trail: string[] = [];
  function walk(nodes: TreeNode[], stack: string[]): boolean {
    for (const node of nodes) {
      if (node.path === targetPath) {
        trail.push(...stack);
        return true;
      }
      if (node.children && walk(node.children, [...stack, node.path])) return true;
    }
    return false;
  }
  walk(tree, []);
  return trail;
}

/** LazyVim/nvim-tree-style file tree: j/k move, l/Enter open or expand, h collapses/goes to parent, gg/G jump. */
export default function VaultTree({ tree, activePath, onOpen }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    // auto-expand the folders that lead to the initially active file
    return activePath ? new Set(ancestorsOf(tree, activePath)) : new Set();
  });
  const [cursor, setCursor] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const pendingG = useRef(false);

  const rows = useMemo(() => {
    const out: Row[] = [];
    flatten(tree, expanded, 0, out);
    return out;
  }, [tree, expanded]);

  useEffect(() => {
    if (!activePath) return;
    const i = rows.findIndex((r) => r.node.path === activePath);
    if (i >= 0) setCursor(i);
  }, [activePath, rows]);

  function toggle(path: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }

  function openRow(row: Row) {
    if (row.node.type === "folder") {
      toggle(row.node.path);
    } else {
      onOpen(row.node.path);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    const row = rows[cursor];

    if (e.key === "g") {
      if (pendingG.current) {
        setCursor(0);
        pendingG.current = false;
      } else {
        pendingG.current = true;
      }
      return;
    }
    pendingG.current = false;

    switch (e.key) {
      case "j":
      case "ArrowDown":
        e.preventDefault();
        setCursor((c) => Math.min(c + 1, rows.length - 1));
        break;
      case "k":
      case "ArrowUp":
        e.preventDefault();
        setCursor((c) => Math.max(c - 1, 0));
        break;
      case "G":
        e.preventDefault();
        setCursor(rows.length - 1);
        break;
      case "l":
      case "ArrowRight":
      case "Enter":
        e.preventDefault();
        if (row) openRow(row);
        break;
      case "h":
      case "ArrowLeft":
        e.preventDefault();
        if (row?.node.type === "folder" && expanded.has(row.node.path)) {
          toggle(row.node.path);
        } else if (row && row.depth > 0) {
          const parentIndex = [...rows]
            .slice(0, cursor)
            .reverse()
            .findIndex((r) => r.depth === row.depth - 1);
          if (parentIndex >= 0) setCursor(cursor - 1 - parentIndex);
        }
        break;
    }
  }

  return (
    <div
      className="vault-tree"
      ref={containerRef}
      tabIndex={0}
      role="tree"
      onKeyDown={handleKey}
    >
      {rows.map((row, i) => (
        <div
          key={row.node.path}
          role="treeitem"
          aria-selected={i === cursor}
          className={`tree-row ${i === cursor ? "cursor" : ""} ${
            row.node.path === activePath ? "active-file" : ""
          }`}
          style={{ paddingLeft: `${row.depth * 16 + 10}px` }}
          onClick={() => {
            setCursor(i);
            openRow(row);
          }}
        >
          {row.node.type === "folder" ? (
            <>
              {expanded.has(row.node.path) ? (
                <ChevronDown size={13} className="tree-chevron" />
              ) : (
                <ChevronRight size={13} className="tree-chevron" />
              )}
              <Folder size={13} className="tree-icon" />
            </>
          ) : (
            <FileText size={13} className="tree-icon tree-icon-file" />
          )}
          <span className="tree-label">{row.node.name.replace(/\.md$/, "")}</span>
        </div>
      ))}
    </div>
  );
}
