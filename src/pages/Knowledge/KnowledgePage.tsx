import VaultPanel from "../../components/knowledge/VaultPanel";
import GraphCanvas from "../../components/knowledge/GraphCanvas";

import "../../styles/knowledge.css";

export default function KnowledgePage() {
    return (
        <section className="knowledge-page">

            <GraphCanvas />

            <VaultPanel />

        </section>
    );
}
