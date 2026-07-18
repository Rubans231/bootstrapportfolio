import { useEffect, useState } from "react";

interface BootEntry {
  text: string;
  pause?: number;
}

const bootLines: BootEntry[] = [
  { text: "Loading Linux kernel 6.16.0-arch1" },
  { text: "Mounting ~/Projects" },
  { text: "Parsing Personal-Notes vault" },
  { text: "Indexing Markdown graph" },
  { text: "Connecting GitHub repositories" },
  { text: "Loading workspaces", pause: 650 },
  { text: "Syncing configs" },
  { text: "Starting session", pause: 650 },
  { text: "Welcome back, Rubans" },
];

interface Props {
  fading: boolean;
  onSkip: () => void;
}

export default function BootScreen({
  fading,
  onSkip,
}: Props) {
  const [currentLine, setCurrentLine] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [completedLines, setCompletedLines] = useState<string[]>([]);

  /* ---------- Enter to Skip ---------- */

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        onSkip();
      }
    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, [onSkip]);

  /* ==========================================================
     MACHINE TERMINAL TYPING (ACTIVE)
     ========================================================== */

  useEffect(() => {
    if (currentLine >= bootLines.length) {
      const timeout = setTimeout(onSkip, 1000);
      return () => clearTimeout(timeout);
    }

    const line = bootLines[currentLine];
    const text = line.text;

    let index = 0;
    let cancelled = false;

    const CHARACTER_DELAY = 14;
    const LINE_DELAY = 220;

    const typeNext = () => {
      if (cancelled) return;

      setTypedText(text.slice(0, index));

      if (index < text.length) {
        index++;
        setTimeout(typeNext, CHARACTER_DELAY);
        return;
      }

      const pause = line.pause ?? LINE_DELAY;

      setTimeout(() => {
        if (cancelled) return;

        setCompletedLines((prev) => [...prev, text]);
        setTypedText("");
        setCurrentLine((prev) => prev + 1);
      }, pause);
    };

    typeNext();

    return () => {
      cancelled = true;
    };
  }, [currentLine, onSkip]);

  /* ==========================================================
     HUMAN TERMINAL TYPING (DISABLED)
     Uncomment this block and comment the machine typing block
     above if you ever want the terminal to feel like someone
     is physically typing.
     ========================================================== */

  /*
  useEffect(() => {
    if (currentLine >= bootLines.length) {
      const timeout = setTimeout(onSkip, 1200);
      return () => clearTimeout(timeout);
    }

    const line = bootLines[currentLine];
    const text = line.text;

    let index = 0;
    let cancelled = false;

    const LINE_DELAY = 250;

    const typeNext = () => {
      if (cancelled) return;

      setTypedText(text.slice(0, index));

      if (index < text.length) {
        let delay = 16 + Math.random() * 18;

        const previous = text[index - 1];

        if (previous === " ") delay = 5;
        if (previous === "." || previous === "," || previous === ":") delay = 120;
        if (previous === "]") delay = 170;
        if (previous === "/") delay = 50;
        if (previous === "-") delay = 40;

        index++;

        setTimeout(typeNext, delay);
        return;
      }

      const pause = line.pause ?? LINE_DELAY;

      setTimeout(() => {
        if (cancelled) return;

        setCompletedLines((prev) => [...prev, text]);
        setTypedText("");
        setCurrentLine((prev) => prev + 1);
      }, pause);
    };

    typeNext();

    return () => {
      cancelled = true;
    };
  }, [currentLine, onSkip]);
  */

  return (
      <section
        className={`boot-screen ${fading ? "fade" : ""}`}
        onClick={onSkip}
      >
      <h1>Portfolio</h1>

      <small>Linux 6.16.0-arch1</small>

      <div className="boot-log">
        {completedLines.map((line) => (
          <p key={line}>
            <span className="ok">[ OK ]</span>
            {line}
          </p>
        ))}

        {currentLine < bootLines.length && (
          <p>
            <span className="ok">[ OK ]</span>
            {typedText}
            <span className="cursor">█</span>
          </p>
        )}
      </div>

      <div className="boot-hint">
        Press ENTER or Click Anywhere to Skip
      </div>
    </section>
  );
}
