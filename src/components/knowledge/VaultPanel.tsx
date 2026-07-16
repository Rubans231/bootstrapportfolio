import { Link } from "react-router-dom";
import { useLang } from "../../lib/i18n";
import graphData from "../../data/vaultGraph.json";

interface Props {
  visible: boolean;
  onToggle: () => void;
}

export default function VaultPanel({ visible, onToggle }: Props) {
  const { t } = useLang();

  return (
    <>
      <button className="vault-toggle" onClick={onToggle}>
        {visible ? t("vault.hide") : t("vault.show")}
      </button>

      {visible && (
        <article className="vault-panel">
          <h1>{t("vault.heading")}</h1>

          <p>{t("vault.intro1")}</p>
          <p>{t("vault.intro2")}</p>

          <div className="vault-stats">
            <span>
              <strong>{graphData.meta.notes}</strong> {t("vault.stats.notes")}
            </span>
            <span>
              <strong>{graphData.meta.tags}</strong> {t("vault.stats.tags")}
            </span>
            <span>
              <strong>{graphData.meta.links}</strong> {t("vault.stats.links")}
            </span>
          </div>

          <Link to="/projects" className="projects-button">
            {t("vault.cta")}
          </Link>
        </article>
      )}
    </>
  );
}
