import { NavLink } from "react-router-dom";

export default function StatusBar() {
  return (
    <footer className="statusbar">

      <NavLink to="/">Knowledge</NavLink>

      <NavLink to="/projects">Projects</NavLink>

      <NavLink to="/about">About</NavLink>

    </footer>
  );
}
