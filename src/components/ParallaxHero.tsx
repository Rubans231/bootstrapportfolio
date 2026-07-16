import { useRef, useState } from "react";
import leftFace from "../assets/left-faceplate.png";
import rightFace from "../assets/right-faceplate.png";
import leftInsides from "../assets/left-insides.png";
import rightInsides from "../assets/right-insides.png";
import QuoteRotator from "./QuoteRotator";

export default function ParallaxHero() {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [flipped, setFlipped] = useState(false);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setOffset({ x: px, y: py });
  }

  function reset() {
    setOffset({ x: 0, y: 0 });
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={() => setFlipped((f) => !f)}
      className="hero"
      role="button"
      tabIndex={0}
      aria-label="ZERO:RED in-ear monitors — click to flip"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setFlipped((f) => !f);
      }}
    >
      <div
        className="hero-layer hero-layer-back"
        style={{
          transform: `translate(${offset.x * -18}px, ${offset.y * -12}px)`,
        }}
      >
        <img
          src={flipped ? rightInsides : rightFace}
          alt=""
          aria-hidden="true"
          className="hero-iem hero-iem-right"
        />
      </div>

      <div
        className="hero-layer hero-layer-front"
        style={{
          transform: `translate(${offset.x * 26}px, ${offset.y * 18}px)`,
        }}
      >
        <img
          src={flipped ? leftInsides : leftFace}
          alt="ZERO:RED in-ear monitor"
          className="hero-iem hero-iem-left"
        />
      </div>

      <div className="hero-copy">
        <h1>
          narander rubans<span className="accent-char">_</span>
        </h1>
        <p className="hero-role">
          ML / LLM engineer · terminal native ·{" "}
          <span className="accent-text jp">→ 日本</span>
        </p>
        <QuoteRotator />
        <p className="hero-hint">click the IEMs</p>
      </div>

      <div className="hero-vignette" />
    </div>
  );
}
