import { Link } from "react-router-dom";

/** Hand-authored landing content for the Knowledge Base reader — not a fetched file, styled to match one. */
export default function WelcomeNote() {
  return (
    <div className="note-reader">
      <h1># Welcome</h1>
      <p>
        This is a portfolio, but it's built like a desktop, not a webpage. What you're
        looking at right now — a force-directed graph in the background, a real file
        tree on the left — is my actual ZenNotes vault, fetched live from GitHub.
        There's no staged content here; if I add a note tonight, it shows up here
        tomorrow.
      </p>

      <h2>## What's here</h2>
      <p>
        <strong>Knowledge Base</strong> (you are here) — click through the tree on the
        left to read real notes, or hide this panel entirely to just watch the graph.
        Nodes cluster by topic; hover one to see its connections.
      </p>
      <p>
        <strong><Link to="/projects">Projects</Link></strong> — not a grid of cards.
        Each project is its own workspace, switchable like Hyprland workspaces, pulling
        live stats and README content straight from GitHub.
      </p>
      <p>
        <strong><Link to="/about">About</Link></strong> — the actual human behind all
        this. Less résumé, more "why the desktop looks like this."
      </p>

      <h2>## Where to start</h2>
      <p>
        If you're short on time: <Link to="/projects">go see the Projects page</Link>{" "}
        first — that's the main event. If you want the fuller picture of who built it,{" "}
        <Link to="/about">the About page</Link> is next. If you're the kind of person
        who reads the graph before the README, stay right here and start clicking.
      </p>
    </div>
  );
}
