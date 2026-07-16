import { NavLink } from "react-router-dom";
import { useLang } from "../../lib/i18n";

const WORKSPACES = [
  { n: "1", to: "/", key: "nav.knowledge" },
  { n: "2", to: "/projects", key: "nav.projects" },
  { n: "3", to: "/about", key: "nav.about" },
];

export default function StatusBar() {
  const { t } = useLang();

  return (
    <footer className="statusbar">
      {WORKSPACES.map((w) => (
        <NavLink key={w.to} to={w.to} end={w.to === "/"} className="workspace-tab">
          <span className="workspace-n">{w.n}</span>
          {t(w.key)}
        </NavLink>
      ))}
    </footer>
  );
}
