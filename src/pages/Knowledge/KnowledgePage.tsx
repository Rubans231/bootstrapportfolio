import { useState } from "react";
import VaultPanel from "../../components/knowledge/VaultPanel";
import GraphCanvas from "../../components/knowledge/GraphCanvas";

import "../../styles/knowledge.css";

export default function KnowledgePage() {
    const [panelVisible, setPanelVisible] = useState(true);

    return (
        <section className="knowledge-page">

            <GraphCanvas />

            <VaultPanel
                visible={panelVisible}
                onToggle={() => setPanelVisible((v) => !v)}
            />

        </section>
    );
}
