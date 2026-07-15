import { NavLink } from "react-router-dom";
import WaybarModule from "../ui/WaybarModule";
import usePageTitle from "../../hooks/usePageTitle";

export default function TopBar() {
  const title = usePageTitle();

  return (
    <header className="topbar">

      <WaybarModule variant="left">

        <span className="page-title">{title}</span>

      </WaybarModule>

      <WaybarModule variant="center">

        <nav className="nav">
          <NavLink to="/">Knowledge</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>

      </WaybarModule>

      <WaybarModule variant="right">

        <button className="lang active">EN</button>

        <button className="lang">日本語</button>

      </WaybarModule>

    </header>
  );
}
