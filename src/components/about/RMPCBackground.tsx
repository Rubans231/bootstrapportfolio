import { useEffect, useState } from "react";
import { playlist } from "./playlist";
import { formatTime } from "./utils";
import Cava from "./Cava";
import { useMouseParallax } from "../../hooks/useMouseParallax";

export default function RMPCBackground() {
  const [song, setSong] = useState(0);
  const [progress, setProgress] = useState(0);
  const [energy, setEnergy] = useState(0);
  const { offset, active } = useMouseParallax();

  // progress only advances while the mouse is actively moving/clicking —
  // otherwise it holds in place, like a paused player.
  useEffect(() => {
    let frame: number;
    let last = performance.now();

    function loop(now: number) {
      const dt = (now - last) / 1000;
      last = now;

      if (active) {
        setProgress((p) => {
          const speed = (0.75 + energy / 50) / playlist[song].duration;
          const next = p + dt * speed;
          if (next >= 1) {
            setSong((s) => (s + 1) % playlist.length);
            return 0;
          }
          return next;
        });
      }

      frame = requestAnimationFrame(loop);
    }

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [song, energy, active]);

  const current = playlist[song];

  return (
    <div
      className="rmpc"
      style={{ transform: `translate(${offset.x * 20}px, ${offset.y * 14}px)` }}
    >
      <div className="header">
        <span>[{active ? "Playing" : "Paused"}]</span>
        <span>{current.title}</span>
        <span>Volume: 30%</span>
      </div>

      <div className="timer">
        {formatTime(progress * current.duration)}/{formatTime(current.duration)}
      </div>

      <div className="body">
        <img src={current.cover} className="cover" alt="" />

        <div className="playlist">
          {playlist.map((s, i) => (
            <div key={s.title} className={i === song ? "active" : ""}>
              {i === song ? "▶ " : "  "}
              {s.artist}
              {" — "}
              {s.title}
            </div>
          ))}
        </div>
      </div>

      <div className="progress">
        <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
      </div>

      <Cava active={active} onEnergyChange={setEnergy} />
    </div>
  );
}
