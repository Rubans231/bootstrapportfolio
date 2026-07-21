import { useEffect, useRef } from "react";

interface Props {
  active: boolean;
  onEnergyChange: (energy: number) => void;
}

/**
 * Fake CAVA visualizer.
 * - No travelling sine wave.
 * - Neighboring bars influence each other.
 * - Smooth interpolation.
 * - Freezes when inactive.
 */
export default function Cava({ active, onEnergyChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);

  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const BAR_COUNT = 48;

    const values = Array(BAR_COUNT).fill(8);

    const BIN_COUNT = 12;

    const bins = Array(BIN_COUNT)
      .fill(0)
      .map(() => ({
        value: 20 + Math.random() * 30,
        target: 20 + Math.random() * 30,
        speed: 0.04 + Math.random() * 0.08,
        decay: 0.92 + Math.random() * 0.05,
      }));

    let raf = 0;
    let frame = 0;

    function draw() {
      const beat = Math.max(0, Math.sin(frame * 0.11));

      if (activeRef.current) {
        frame++;

        // Randomly choose a few bins to become active.
        for (let i = 0; i < BIN_COUNT; i++) {

          if (Math.random() < bins[i].speed) {

            let strength;

            if (i < 2) {
              // Bass
              strength = 60 + beat * 25;
            } else if (i < 6) {
              // Midrange
              strength = 25 + Math.random() * 25;
            } else if (i < 9) {
              // Vocals
              strength = 35 + Math.random() * 35;
            } else {
              // Treble
              strength = 12 + Math.random() * 18;
            }

            bins[i].target = strength;
          }
        }

        // Smooth attack / decay.
        for (const bin of bins) {
          bin.value += (bin.target - bin.value) * 0.22;
          bin.target *= bin.decay;
        }
      }

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      let total = 0;

    for (let i = 0; i < BAR_COUNT; i++) {

    // Small random flutter

      const bin = Math.floor(i / (BAR_COUNT / BIN_COUNT));

      const neighbour =
          Math.sin(frame * 0.08 + i * 0.7) * 3 +
          Math.random() * 4;

      const target =
        bins[bin].value + neighbour;

      values[i] += (target - values[i]) * 0.18;

      values[i] = Math.max(4, Math.min(values[i], 78));

      total += values[i];

      const barWidth = width / BAR_COUNT;
      const actualWidth = barWidth * 0.65; // thinner bars

      const xPos = i * barWidth + (barWidth - actualWidth) / 2;

      ctx.fillStyle = "#d19a66";

      ctx.fillRect(
        xPos,
        height - values[i],
        actualWidth,
        values[i]
      );
    }

    onEnergyChange(total / BAR_COUNT);

    raf = requestAnimationFrame(draw);
  }
   function resize() {
      const dpr = window.devicePixelRatio || 1;

      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();

    window.addEventListener("resize", resize);

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "560px",
        maxWidth: "100%",
        height: "80px",
        display: "block",
        margin: "0 auto",
      }}
    />
  );
}
