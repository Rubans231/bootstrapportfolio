import { useEffect, useRef } from "react";

interface Props {
  active: boolean;
  onEnergyChange: (energy: number) => void;
}

/** Cava-style bars — only animate while `active` (recent mouse movement/click); otherwise hold their last shape, like a paused visualizer. */
export default function Cava({ active, onEnergyChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let raf: number;
    const bars = 48;

    function draw() {
      if (activeRef.current) frame++;

      const width = canvas!.width;
      const height = canvas!.height;
      ctx!.clearRect(0, 0, width, height);

      let total = 0;
      for (let i = 0; i < bars; i++) {
        const value = 20 + Math.sin(frame * 0.08 + i * 0.5) * 12 + Math.random() * (activeRef.current ? 10 : 1.5);
        total += value;
        ctx!.fillStyle = "#d19a66";
        ctx!.fillRect(i * (width / bars), height - value, width / bars - 2, value);
      }

      onEnergyChange(total / bars);
      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} width={800} height={80} />;
}
