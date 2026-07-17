import { useEffect, useState } from "react";
import leftFace from "../../assets/left-faceplate.png";
import rightFace from "../../assets/right-faceplate.png";

/**
 * About page background: a fastfetch-style text block with the two ZERO:RED
 * shells sitting apart, below it, center-screen — not the earlier
 * overlapping two-layer version. Everything here is decorative and dim;
 * text content always sits on top of it.
 */
export default function AboutParallaxBackground() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      setOffset({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="about-bg" aria-hidden="true">
      <pre
        className="about-bg-fastfetch"
        style={{ transform: `translate(-50%, ${offset.y * -8}px)` }}
      >
{`narander@rubans
────────────────
OS       NaranderOS 3.0
WM       Hyprland (Wayland)
Shell    zsh
Term     kitty
Theme    Tokyonight-Dark
IEM      ZERO:RED`}
      </pre>

      <div className="about-bg-row">
        <img
          src={leftFace}
          alt=""
          className="about-bg-layer about-bg-left"
          style={{ transform: `translate(${offset.x * -18}px, ${offset.y * 14}px)` }}
        />
        <img
          src={rightFace}
          alt=""
          className="about-bg-layer about-bg-right"
          style={{ transform: `translate(${offset.x * 18}px, ${offset.y * 14}px) scaleX(-1)` }}
        />
      </div>
    </div>
  );
}
