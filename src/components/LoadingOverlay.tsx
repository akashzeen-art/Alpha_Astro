import { useCallback, useEffect, useRef, useState } from "react";
import { BRAND } from "@/lib/brand";
import { notifyPreloaderComplete } from "@/lib/scrollAnimations";
import { cn } from "@/lib/utils";

const TOTAL_MS = 3_600;
const FADE_MS = 850;

const MESSAGES = [
  "Igniting the solar core…",
  "Setting planetary orbits…",
  "Syncing lunar paths…",
  "Calibrating birth charts…",
  "Opening the observatory…",
] as const;

type Phase = "active" | "fade-out" | "hidden";

type PStar = {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
  hue: number;
};

type Planet = {
  a: number;
  size: number;
  period: number;
  color: string;
  phase: number;
  moons?: number;
  ring?: boolean;
};

const PLANETS: Planet[] = [
  { a: 0.42, size: 2.8, period: 0.3, color: "180,180,170", phase: 0.5 },
  { a: 0.65, size: 4.5, period: 0.7, color: "232,200,140", phase: 1.2 },
  { a: 0.88, size: 5, period: 1, color: "94,180,220", phase: 2.5, moons: 1 },
  { a: 1.1, size: 3.8, period: 1.8, color: "220,120,90", phase: 0.8 },
  { a: 1.4, size: 9, period: 3.5, color: "210,170,120", phase: 3.0, moons: 1 },
  { a: 1.72, size: 7.5, period: 5.5, color: "220,195,140", phase: 4.2, ring: true },
];

const PreloaderCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let stars: PStar[] = [];
    let isMobile = false;
    let cx = 0;
    let cy = 0;
    let scale = 80;
    let lastFrame = 0;
    const YEAR = 16;
    const tilt = 0.4;

    const resize = () => {
      w = Math.max(1, innerWidth);
      h = Math.max(1, innerHeight);
      isMobile = w < 640;
      const dpr = Math.min(devicePixelRatio || 1, isMobile ? 1.5 : 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Align with logo block: roughly upper-middle of flex column
      cx = w * 0.5;
      cy = isMobile ? h * 0.32 : h * 0.34;
      // Keep outer orbit clear of logo (~48px) and progress UI
      const maxOrbit = 1.78;
      const maxR = Math.min(w * 0.42, isMobile ? 88 : 115);
      scale = maxR / maxOrbit;

      stars = Array.from({ length: isMobile ? 80 : 160 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.4 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.6,
        hue: Math.random(),
      }));
    };

    const draw = (t: number) => {
      if (isMobile && t - lastFrame < 33) {
        raf = requestAnimationFrame(draw);
        return;
      }
      lastFrame = t;
      const time = t * 0.001;

      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h));
      bg.addColorStop(0, "#152636");
      bg.addColorStop(0.4, "#0b1520");
      bg.addColorStop(1, "#020508");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const neb = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 2.2);
      neb.addColorStop(0, `rgba(251,191,36,${0.1 + 0.03 * Math.sin(time)})`);
      neb.addColorStop(0.5, `rgba(56,189,248,0.06)`);
      neb.addColorStop(1, "transparent");
      ctx.fillStyle = neb;
      ctx.fillRect(0, 0, w, h);

      for (const s of stars) {
        const tw = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * s.speed + s.phase));
        const rgb = s.hue > 0.65 ? "94,234,212" : "232,240,246";
        ctx.beginPath();
        ctx.fillStyle = `rgba(${rgb},${tw})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Orbits
      for (const p of PLANETS) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(148,163,184,0.25)";
        ctx.lineWidth = 1;
        ctx.ellipse(cx, cy, p.a * scale, p.a * scale * tilt, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Sun corona (logo sits on top in DOM)
      for (let i = 3; i >= 1; i--) {
        const pulse = 1 + 0.04 * Math.sin(time * 2 + i);
        const r = (isMobile ? 36 : 46) + i * (isMobile ? 14 : 18);
        const corona = ctx.createRadialGradient(cx, cy, 16, cx, cy, r * pulse);
        corona.addColorStop(0, `rgba(251,191,36,${0.14 / i})`);
        corona.addColorStop(1, "transparent");
        ctx.fillStyle = corona;
        ctx.beginPath();
        ctx.arc(cx, cy, r * pulse, 0, Math.PI * 2);
        ctx.fill();
      }

      const flareN = isMobile ? 6 : 10;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.18);
      for (let i = 0; i < flareN; i++) {
        const ang = (i / flareN) * Math.PI * 2;
        const base = isMobile ? 22 : 28;
        const len = base + 8 + 8 * Math.sin(time * 2.8 + i);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(253,224,71,${0.28})`;
        ctx.lineWidth = 1.4;
        ctx.moveTo(Math.cos(ang) * base, Math.sin(ang) * base);
        ctx.lineTo(Math.cos(ang) * len, Math.sin(ang) * len);
        ctx.stroke();
      }
      ctx.restore();

      const sizeMul = isMobile ? 0.82 : 1;
      const placed = PLANETS.map((p) => {
        const ang = p.phase + (time / YEAR) * Math.PI * 2 * (1 / p.period);
        return {
          p,
          ang,
          px: cx + Math.cos(ang) * p.a * scale,
          py: cy + Math.sin(ang) * p.a * scale * tilt,
        };
      }).sort((a, b) => a.py - b.py);

      for (const { p, ang, px, py } of placed) {
        const depth = 0.55 + 0.45 * ((Math.sin(ang) + 1) / 2);
        const pr = p.size * sizeMul * (0.9 + depth * 0.12);

        if (p.ring && Math.sin(ang) < 0.2) {
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(-0.3);
          ctx.scale(1, 0.28);
          ctx.strokeStyle = `rgba(${p.color},${0.55 * depth})`;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(0, 0, pr * 1.8, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        const body = ctx.createRadialGradient(px - pr * 0.3, py - pr * 0.3, 0, px, py, pr);
        body.addColorStop(0, `rgba(255,255,255,${0.5 * depth})`);
        body.addColorStop(0.4, `rgba(${p.color},${0.95 * depth})`);
        body.addColorStop(1, `rgba(${p.color},${0.4 * depth})`);
        ctx.fillStyle = body;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();

        if (p.ring && Math.sin(ang) >= 0.2) {
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(-0.3);
          ctx.scale(1, 0.28);
          ctx.strokeStyle = `rgba(${p.color},${0.7 * depth})`;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(0, 0, pr * 1.8, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        if (p.moons && !isMobile) {
          const mang = time * 1.5 + ang;
          const md = pr * 2.2;
          ctx.beginPath();
          ctx.fillStyle = `rgba(226,232,240,${0.8 * depth})`;
          ctx.arc(px + Math.cos(mang) * md, py + Math.sin(mang) * md * 0.5, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

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

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />;
};

const LoadingOverlay = () => {
  const [phase, setPhase] = useState<Phase>("active");
  const [progress, setProgress] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);

  const finish = useCallback(() => {
    setPhase("fade-out");
    window.setTimeout(() => {
      setPhase("hidden");
      notifyPreloaderComplete();
    }, FADE_MS);
  }, []);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / TOTAL_MS);
      setProgress(Math.round(p * 100));
      setMsgIdx(Math.min(MESSAGES.length - 1, Math.floor(p * MESSAGES.length)));
      if (p < 1) raf = requestAnimationFrame(tick);
      else finish();
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [finish]);

  if (phase === "hidden") return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 transition-all duration-1000 safe-area-top safe-area-bottom",
        phase === "fade-out" && "pointer-events-none scale-[1.03] opacity-0 blur-md"
      )}
      aria-busy={phase === "active"}
      aria-label="Loading"
    >
      <PreloaderCanvas />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center text-center sm:max-w-md">
        <div
          className="relative mb-6 sm:mb-8"
          style={{ animation: "alpha-logo-float 3.5s ease-in-out infinite" }}
        >
          <span
            className="absolute inset-[-12px] rounded-full border border-teal-400/30 sm:inset-[-14px]"
            style={{ animation: "alpha-pulse-ring 1.8s ease-out infinite" }}
            aria-hidden
          />
          <span
            className="absolute inset-[-24px] rounded-full border border-sky-400/15 sm:inset-[-28px]"
            style={{ animation: "alpha-pulse-ring 1.8s ease-out 0.45s infinite" }}
            aria-hidden
          />
          <img
            src={BRAND.LOGO}
            alt=""
            className="relative h-16 w-16 rounded-2xl border border-teal-400/45 shadow-[0_0_40px_rgba(251,191,36,0.25)] sm:h-20 sm:w-20 md:h-24 md:w-24"
          />
        </div>

        <p className="font-display mb-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl md:text-4xl">
          {BRAND.NAME}
        </p>
        <p className="mb-6 min-h-[1.1rem] px-2 text-[10px] uppercase tracking-[0.28em] text-teal-200/65 sm:mb-8 sm:text-xs sm:tracking-[0.32em]">
          {MESSAGES[msgIdx]}
        </p>

        <div className="relative h-[3px] w-full max-w-[14rem] overflow-hidden rounded-full bg-white/10 sm:max-w-[18rem]">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-400 via-teal-300 to-sky-300 transition-[width] duration-150"
            style={{
              width: `${progress}%`,
              boxShadow: "0 0 18px rgba(251,191,36,0.55)",
            }}
          />
        </div>
        <p className="mt-3 font-mono text-[11px] tabular-nums text-slate-400">{progress}%</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
