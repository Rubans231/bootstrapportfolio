import { NavLink } from "react-router-dom";
import WaybarModule from "../ui/WaybarModule";
import usePageTitle from "../../hooks/usePageTitle";
import { useLang } from "../../lib/i18n";

export default function TopBar() {
  const title = usePageTitle();
  const { lang, setLang, t } = useLang();

  return (
    <header className="topbar">

      <WaybarModule variant="left">

        <span className="page-title">{title}</span>

      </WaybarModule>

      <WaybarModule variant="center">

        <nav className="nav">
          <NavLink to="/" end>{t("nav.knowledge")}</NavLink>
          <NavLink to="/projects">{t("nav.projects")}</NavLink>
          <NavLink to="/about">{t("nav.about")}</NavLink>
        </nav>

      </WaybarModule>

      <WaybarModule variant="right">

        <button
          className={`lang ${lang === "en" ? "active" : ""}`}
          onClick={() => setLang("en")}
          aria-pressed={lang === "en"}
        >
          EN
        </button>

        <button
          className={`lang ${lang === "ja" ? "active" : ""}`}
          onClick={() => setLang("ja")}
          aria-pressed={lang === "ja"}
        >
          日本語
        </button>

      </WaybarModule>

    </header>
  );
}
