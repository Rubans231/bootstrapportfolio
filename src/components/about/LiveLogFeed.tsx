import { useEffect, useRef, useState } from "react";
import { useMouseParallax } from "../../hooks/useMouseParallax";

const ROUTES = ["/", "/projects", "/about", "/?focus=japanese", "/?focus=ml", "/?focus=genai"];
const REPOS = [
  "rofi-youtube-client",
  "Virtual-Try-On",
  "Auto-ImageProcessing-Dockerized",
  "Recommender-systems",
  "Personal-Notes",
  "bootstrapportfolio",
];
const NOTE_TITLES = [
  "Japanese Basics",
  "N3 Japanese kanji",
  "2 stage recommender system",
  "LLMs(Large language models)",
  "machine learning",
];

function pad(n: number, w = 2) {
  return n.toString().padStart(w, "0");
}

function timestamp() {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function randOf<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const GENERATORS: (() => string)[] = [
  () => `GET ${randOf(ROUTES)} 200 ${(8 + Math.random() * 60).toFixed(0)}ms`,
  () => `gh:cache hit → ${randOf(REPOS)}`,
  () => `gh:fetch readme ${randOf(REPOS)} 200`,
  () => `vault:sync Personal-Notes — 121 notes, 46 tags`,
  () => `note:open "${randOf(NOTE_TITLES)}"`,
  () => `graph:tick nodes=169 alpha→0.0${Math.floor(Math.random() * 9)}`,
  () => `lang:set ${Math.random() > 0.5 ? "en" : "ja"}`,
  () => `boot:ok session started`,
  () => `cache:write ttl=3600s`,
];

let counter = 0;

function nextLine(): { id: number; text: string } {
  counter += 1;
  return { id: counter, text: `${timestamp()}  ${GENERATORS[counter % GENERATORS.length]()}` };
}

const MAX_LINES = 14;

/** Decorative, continuously-flowing fake activity log — top-right of the About background. */
export default function LiveLogFeed() {
  const [lines, setLines] = useState<{ id: number; text: string }[]>(() =>
    Array.from({ length: 6 }, nextLine)
  );
  const { offset } = useMouseParallax();
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    function tick() {
      setLines((prev) => [...prev.slice(-(MAX_LINES - 1)), nextLine()]);
      timeoutRef.current = window.setTimeout(tick, 500 + Math.random() * 700);
    }
    timeoutRef.current = window.setTimeout(tick, 600);
    return () => window.clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div
      className="live-log-feed"
      aria-hidden="true"
      style={{ transform: `translate(${offset.x * -10}px, ${offset.y * -6}px)` }}
    >
      {lines.map((l) => (
        <p key={l.id}>{l.text}</p>
      ))}
    </div>
  );
}
