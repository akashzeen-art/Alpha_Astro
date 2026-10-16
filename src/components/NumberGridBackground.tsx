import { useEffect, useRef } from "react";

const DIGITS = "0123456789";
const CELL = 56;

/**
 * GrahVeda signature backdrop — drifting number matrix + sacred-geometry grid.
 * Lightweight canvas (no Three.js) for a distinct look vs My Astro Sutra / Bharat Astro.
 */
const NumberGridBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    const cells: { digit: string; phase: number; speed: number }[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(w / CELL) + 1;
      rows = Math.ceil(h / CELL) + 1;
      cells.length = 0;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          cells.push({
            digit: DIGITS[Math.floor(Math.random() * 10)],
            phase: Math.random() * Math.PI * 2,
            speed: 0.4 + Math.random() * 0.8,
          });
        }
      }
    };

    const draw = (t: number) => {
      const time = t * 0.001;

      const grad = ctx.createRadialGradient(w * 0.5, h * 0.35, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
      grad.addColorStop(0, "#1a1040");
      grad.addColorStop(0.45, "#0c0820");
      grad.addColorStop(1, "#050510");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(124, 58, 237, 0.06)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= cols; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL, 0);
        ctx.lineTo(x * CELL, h);
        ctx.stroke();
      }
      for (let y = 0; y <= rows; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL);
        ctx.lineTo(w, y * CELL);
        ctx.stroke();
      }

      ctx.font = "600 22px 'IBM Plex Sans', system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      let i = 0;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const cell = cells[i++];
          const pulse = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * cell.speed + cell.phase));
          const isGold = (x + y) % 7 === 0;
          ctx.fillStyle = isGold
            ? `rgba(251, 191, 36, ${0.12 * pulse})`
            : `rgba(167, 139, 250, ${0.18 * pulse})`;
          ctx.fillText(cell.digit, x * CELL + CELL / 2, y * CELL + CELL / 2);
        }
      }

      const glow = ctx.createRadialGradient(w * 0.7, h * 0.2, 0, w * 0.7, h * 0.2, w * 0.35);
      glow.addColorStop(0, "rgba(124, 58, 237, 0.12)");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-transparent to-[#050510]/80" />
      <div
        className="absolute left-1/2 top-1/3 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[100px]"
        style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }}
      />
    </div>
  );
};

export default NumberGridBackground;
