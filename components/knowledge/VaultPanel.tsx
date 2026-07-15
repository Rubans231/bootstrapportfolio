import { Link } from "react-router-dom";

export default function VaultPanel() {
    return (
        <article className="vault-panel">

            <h1>Knowledge Base</h1>

            <p>
                Welcome to my second brain.
            </p>

            <p>
                This graph is generated from my real markdown vault.
            </p>

            <ul>
                <li>Linux</li>
                <li>Docker</li>
                <li>Artificial Intelligence</li>
                <li>Japanese</li>
                <li>Computer Science</li>
            </ul>

            <div className="vault-stats">

                <span>1800+ Notes</span>

                <span>4000+ Links</span>

            </div>

            <Link
                to="/projects"
                className="projects-button"
            >
                View Projects →
            </Link>

        </article>
    );
}
