import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen, EyeOff } from "lucide-react";
import VaultTree from "./VaultTree";
import NoteReader from "./NoteReader";
import type { TreeNode } from "../../lib/vault";
import { useLang } from "../../lib/i18n";

interface Props {
  tree: TreeNode[];
  titleToPath: Map<string, string>;
  activePath: string | null;
  onOpen: (path: string) => void;
  onHide: () => void;
}

export default function VaultExplorer({ tree, titleToPath, activePath, onOpen, onHide }: Props) {
  const [treeCollapsed, setTreeCollapsed] = useState(false);
  const { t } = useLang();

  return (
    <div className={`vault-explorer ${treeCollapsed ? "tree-collapsed" : ""}`}>
      <div className="vault-explorer-toolbar">
        <button
          className="vault-icon-btn"
          onClick={() => setTreeCollapsed((v) => !v)}
          title={treeCollapsed ? "expand tree" : "collapse tree"}
        >
          {treeCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
        </button>
        <button className="vault-icon-btn" onClick={onHide} title={t("vault.hide")}>
          <EyeOff size={14} />
        </button>
      </div>

      <div className="vault-explorer-body">
        {!treeCollapsed && (
          <VaultTree tree={tree} activePath={activePath} onOpen={onOpen} />
        )}
        <NoteReader path={activePath} titleToPath={titleToPath} onNavigate={onOpen} />
      </div>
    </div>
  );
}
