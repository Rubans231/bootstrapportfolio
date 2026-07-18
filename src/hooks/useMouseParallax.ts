import { useEffect, useRef, useState } from "react";

interface MouseParallax {
  offset: { x: number; y: number };
  /** true for a short window after real mouse movement or a click, then false again */
  active: boolean;
}

const ACTIVE_WINDOW_MS = 900;

/** Shared window-level mouse tracking for background parallax + "only animate while active" effects. */
export function useMouseParallax(): MouseParallax {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    function markActive() {
      setActive(true);
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setActive(false), ACTIVE_WINDOW_MS);
    }

    function handleMove(e: MouseEvent) {
      setOffset({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
      markActive();
    }

    function handleClick() {
      markActive();
    }

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("click", handleClick);
      window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return { offset, active };
}
