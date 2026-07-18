import { useEffect, useMemo, useRef, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { fetchNoteContent, WELCOME_PATH } from "../../lib/vault";
import WelcomeNote from "./WelcomeNote";

interface Props {
  path: string | null;
  titleToPath: Map<string, string>;
  onNavigate: (path: string) => void;
}

const WIKILINK_RE = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

function preprocessWikilinks(markdown: string): string {
  return markdown.replace(WIKILINK_RE, (_match, target: string, alias?: string) => {
    const label = (alias ?? target).trim();
    const encoded = encodeURIComponent(target.trim());
    return `[${label}](#/wikilink/${encoded})`;
  });
}

export default function NoteReader({ path, titleToPath, onNavigate }: Props) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!path || path === WELCOME_PATH) {
      setContent(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchNoteContent(path).then((text) => {
      if (cancelled) return;
      setContent(text);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [path]);

  const html = useMemo(() => {
    if (!content) return "";
    const withLinks = preprocessWikilinks(content);
    const raw = marked.parse(withLinks, { async: false, gfm: true, breaks: false }) as string;
    return DOMPurify.sanitize(raw);
  }, [content]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (!href.startsWith("#/wikilink/")) return;
      e.preventDefault();
      const target = decodeURIComponent(href.replace("#/wikilink/", "")).toLowerCase();
      const targetPath = titleToPath.get(target);
      if (targetPath) onNavigate(targetPath);
    }

    el.addEventListener("click", handleClick);
    return () => el.removeEventListener("click", handleClick);
  }, [titleToPath, onNavigate]);

  if (path === WELCOME_PATH) {
    return <WelcomeNote />;
  }

  if (!path) {
    return <div className="note-reader note-reader-empty">select a note from the tree</div>;
  }

  if (loading) {
    return (
      <div className="note-reader note-reader-loading">
        <span className="skeleton-line" style={{ width: "60%" }} />
        <span className="skeleton-line" style={{ width: "85%" }} />
        <span className="skeleton-line" style={{ width: "40%" }} />
      </div>
    );
  }

  if (!content) {
    return <div className="note-reader note-reader-empty">couldn't reach GitHub for this note.</div>;
  }

  return (
    <div className="note-reader" ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
