import { useEffect, useState, Suspense, lazy } from "react";
import VaultExplorer from "../../components/knowledge/VaultExplorer";
import { fetchVault, WELCOME_PATH } from "../../lib/vault";
import type { VaultData } from "../../lib/vault";
import { useLang } from "../../lib/i18n";

import "../../styles/knowledge.css";

const GraphCanvas = lazy(() => import("../../components/knowledge/GraphCanvas"));

export default function KnowledgePage() {
    const [vault, setVault] = useState<VaultData | null>(null);
    const [failed, setFailed] = useState(false);
    const [activePath, setActivePath] = useState<string | null>(WELCOME_PATH);
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
            <Suspense fallback={<div className="graph-canvas graph-canvas-loading" />}>
                <GraphCanvas nodes={vault.graph.nodes} links={vault.graph.links} onNodeOpen={openNote} />
            </Suspense>

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
