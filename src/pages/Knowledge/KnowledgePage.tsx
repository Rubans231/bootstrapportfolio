import { useEffect, useState } from "react";
import GraphCanvas from "../../components/knowledge/GraphCanvas";
import VaultExplorer from "../../components/knowledge/VaultExplorer";
import { fetchVault } from "../../lib/vault";
import type { VaultData } from "../../lib/vault";
import { useLang } from "../../lib/i18n";

import "../../styles/knowledge.css";

export default function KnowledgePage() {
    const [vault, setVault] = useState<VaultData | null>(null);
    const [failed, setFailed] = useState(false);
    const [activePath, setActivePath] = useState<string | null>(null);
    const [panelVisible, setPanelVisible] = useState(true);
    const { t } = useLang();

    useEffect(() => {
        let cancelled = false;
        fetchVault().then((data) => {
            if (cancelled) return;
            if (!data) {
                setFailed(true);
                return;
            }
            setVault(data);
            setActivePath(data.defaultPath);
        });
        return () => {
            cancelled = true;
        };
    }, []);

    function openNote(path: string) {
        setActivePath(path);
        setPanelVisible(true);
    }

    if (failed) {
        return (
            <section className="knowledge-page knowledge-error">
                <p>{t("vault.error")}</p>
            </section>
        );
    }

    if (!vault) {
        return (
            <section className="knowledge-page knowledge-loading">
                <span className="skeleton-line" style={{ width: "40%" }} />
                <span className="skeleton-line" style={{ width: "55%" }} />
                <span className="skeleton-line" style={{ width: "30%" }} />
            </section>
        );
    }

    return (
        <section className="knowledge-page">
            <GraphCanvas nodes={vault.graph.nodes} links={vault.graph.links} onNodeOpen={openNote} />

            {panelVisible ? (
                <VaultExplorer
                    tree={vault.tree}
                    titleToPath={vault.titleToPath}
                    activePath={activePath}
                    onOpen={openNote}
                    onHide={() => setPanelVisible(false)}
                />
            ) : (
                <button className="vault-reveal-btn" onClick={() => setPanelVisible(true)}>
                    {t("vault.show")}
                </button>
            )}
        </section>
    );
}
