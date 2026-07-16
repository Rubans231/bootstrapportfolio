import { useEffect, useState } from "react";

interface Props {
  lines: string[];
  speed?: number;
  className?: string;
}

/** A single tiled terminal pane that loops through scripted lines, machine-typed. */
export default function TerminalTile({ lines, speed = 18, className = "" }: Props) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    let cancelled = false;
    let shown: string[] = [];

    const tick = () => {
      if (cancelled) return;
      const line = lines[lineIndex % lines.length];

      setTyped(line.slice(0, charIndex));

      if (charIndex < line.length) {
        charIndex++;
        setTimeout(tick, speed);
        return;
      }

      setTimeout(() => {
        if (cancelled) return;
        shown = [...shown, line].slice(-6);
        setVisibleLines(shown);
        setTyped("");
        charIndex = 0;
        lineIndex++;
        setTimeout(tick, 260);
      }, 900);
    };

    tick();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`terminal-tile ${className}`}>
      {visibleLines.map((l, i) => (
        <p key={i}>{l}</p>
      ))}
      <p>
        {typed}
        <span className="terminal-cursor">▌</span>
      </p>
    </div>
  );
}
