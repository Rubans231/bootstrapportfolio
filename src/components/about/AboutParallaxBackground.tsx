import { useEffect, useState } from "react";
import leftFace from "../../assets/left-faceplate.png";
import rightFace from "../../assets/right-faceplate.png";

/**
 * Subtle whole-viewport mouse-parallax background for the About page, built
 * from real photos of my own IEMs rather than a stock image. Deliberately
 * dim and out of focus — atmosphere, not a product shot. Listens on
 * `window` (rather than its own pointer-events) so it stays purely
 * decorative and never intercepts clicks/selection on the real content.
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
      <img
        src={rightFace}
        alt=""
        className="about-bg-layer about-bg-back"
        style={{ transform: `translate(${offset.x * -16}px, ${offset.y * -12}px)` }}
      />
      <img
        src={leftFace}
        alt=""
        className="about-bg-layer about-bg-front"
        style={{ transform: `translate(${offset.x * 26}px, ${offset.y * 18}px)` }}
      />
    </div>
  );
}
