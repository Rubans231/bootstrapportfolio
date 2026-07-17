import { useEffect, useRef } from "react";

interface Props {
  mouse: { x: number; y: number };
  onEnergyChange: (energy: number) => void;
}

export default function Cava({ mouse, onEnergyChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let frame = 0;

    function animate() {
      frame++;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const bars = 48;

      let total = 0;

      for (let i = 0; i < bars; i++) {
        const value =
          20 +
          Math.sin(frame * 0.08 + i * 0.5) * 12 +
          Math.random() * 10 +
          mouse.y * 20;

        total += value;

        ctx.fillStyle = "#d19a66";

        ctx.fillRect(
          i * (width / bars),
          height - value,
          width / bars - 2,
          value
        );
      }

      onEnergyChange(total / bars);

      requestAnimationFrame(animate);
    }

    animate();
  }, [mouse]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={80}
    />
  );
}
