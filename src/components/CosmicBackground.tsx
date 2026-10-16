import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  z: number;
  r: number;
  phase: number;
  speed: number;
  hue: "white" | "teal" | "sky" | "warm";
};

type Shooting = {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  thick: number;
};

type Layout = {
  sx: number;
  sy: number;
  scale: number;
  tilt: number;
  sunR: number;
  isMobile: boolean;
  isTablet: boolean;
};

/** Outer planet AU used for fit math */
const MAX_ORBIT = 2.55;

const SOLAR: {
  a: number;
  size: number;
  period: number;
  color: string;
  ring?: boolean;
  moons?: number;
  phase: number;
}[] = [
  { a: 0.38, size: 3.2, period: 0.24, color: "180,180,170", phase: 0.2 },
  { a: 0.55, size: 5.2, period: 0.62, color: "232,200,140", phase: 1.1 },
  { a: 0.75, size: 5.8, period: 1, color: "94,180,220", moons: 1, phase: 2.4 },
  { a: 0.95, size: 4.4, period: 1.88, color: "220,120,90", phase: 0.7 },
  { a: 1.45, size: 13, period: 4.2, color: "210,170,120", moons: 2, phase: 3.2 },
  { a: 1.85, size: 10.5, period: 6.5, color: "220,195,140", ring: true, moons: 1, phase: 4.1 },
  { a: 2.2, size: 7.2, period: 9.5, color: "140,210,220", phase: 5.0 },
  { a: 2.5, size: 6.8, period: 12, color: "80,120,220", phase: 1.8 },
];

const hueRgb = {
  white: "232,240,246",
  teal: "94,234,212",
  sky: "125,211,252",
  warm: "253,224,171",
} as const;

function buildStars(count: number, w: number, h: number): Star[] {
  return Array.from({ length: count }, () => {
    const roll = Math.random();
    const hue: Star["hue"] =
      roll > 0.9 ? "warm" : roll > 0.72 ? "teal" : roll > 0.52 ? "sky" : "white";
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      z: 0.3 + Math.random() * 0.7,
      r: hue === "warm" || hue === "teal" ? 1 + Math.random() * 1.8 : 0.35 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.35 + Math.random() * 1.6,
      hue,
    };
  });
}

/** Fit solar system into viewport without clipping — different anchors per breakpoint */
function computeLayout(w: number, h: number): Layout {
  const isMobile = w < 768;
  const isTablet = w >= 768 && w < 1100;
  const pad = isMobile ? 12 : 24;

  if (isMobile) {
    // Sit in lower half so hero copy (top) stays readable
    const sx = w * 0.5;
    const sy = h * 0.76;
    const maxRx = (w / 2) - pad;
    const maxRy = Math.min(h * 0.26, h - sy - pad);
    const scale = Math.min(maxRx, maxRy / 0.4) / MAX_ORBIT;
    return {
      sx,
      sy,
      scale: Math.max(28, scale),
      tilt: 0.4,
      sunR: Math.max(10, scale * 0.2),
      isMobile,
      isTablet,
    };
  }

  // Desktop / tablet — right side, vertically centered
  const sx = isTablet ? w * 0.74 : w * 0.7;
  const sy = h * 0.5;
  const maxRx = Math.min(w - sx - pad, sx * 0.55);
  const maxRy = (h / 2) - pad;
  const scale = Math.min(maxRx, maxRy / 0.42) / MAX_ORBIT;

  return {
    sx,
    sy,
    scale: Math.max(48, Math.min(scale, isTablet ? 95 : 130)),
    tilt: 0.42,
    sunR: Math.max(12, Math.min(scale * 0.22, 28)),
    isMobile,
    isTablet,
  };
}

const CosmicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const shotsRef = useRef<Shooting[]>([]);
  const asteroidsRef = useRef<{ a: number; phase: number; size: number; speed: number }[]>([]);
  const reducedMotionRef = useRef(false);
  const visibleRef = useRef(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mq.matches;
    const onMq = () => {
      reducedMotionRef.current = mq.matches;
    };
    mq.addEventListener?.("change", onMq);

    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };
    const onMove = (e: PointerEvent) => {
      if (window.innerWidth < 768) return; // no parallax on mobile
      mouseRef.current = { x: e.clientX / innerWidth, y: e.clientY / innerHeight };
    };
    const onVis = () => {
      visibleRef.current = document.visibilityState === "visible";
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);

    return () => {
      mq.removeEventListener?.("change", onMq);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    let layout: Layout = computeLayout(390, 844);
    let lastShot = 0;
    let lastFrame = 0;
    const YEAR = 30;

    const resize = () => {
      w = Math.max(1, innerWidth);
      h = Math.max(1, innerHeight);
      layout = computeLayout(w, h);
      const dpr = Math.min(devicePixelRatio || 1, layout.isMobile ? 1.5 : 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const starCount = layout.isMobile ? 90 : layout.isTablet ? 160 : 220;
      stars = buildStars(starCount, w, h);
      asteroidsRef.current = Array.from({ length: layout.isMobile ? 24 : 55 }, () => ({
        a: 1.12 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
        size: 0.5 + Math.random() * 1.2,
        speed: 0.85 + Math.random() * 0.35,
      }));
      shotsRef.current = [];
    };

    const spawnShot = (time: number) => {
      if (layout.isMobile) return; // skip meteors on mobile for perf/clarity
      if (time - lastShot < 4 + Math.random() * 5) return;
      lastShot = time;
      if (shotsRef.current.length > 1) return;
      shotsRef.current.push({
        active: true,
        x: w * (0.05 + Math.random() * 0.45),
        y: h * Math.random() * 0.28,
        vx: 6 + Math.random() * 7,
        vy: 2 + Math.random() * 3.5,
        life: 0,
        max: 24 + Math.random() * 18,
        thick: 1.4 + Math.random(),
      });
    };

    const drawSolar = (time: number, mx: number, my: number) => {
      const { sx: baseX, sy: baseY, scale, tilt, sunR, isMobile } = layout;
      const sx = baseX + mx;
      const sy = baseY + my;
      const motion = reducedMotionRef.current ? 0 : 1;

      // Ambient glow
      const glowR = scale * MAX_ORBIT * 1.15;
      const sysGlow = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowR);
      sysGlow.addColorStop(0, "rgba(251,191,36,0.1)");
      sysGlow.addColorStop(0.4, "rgba(94,234,212,0.04)");
      sysGlow.addColorStop(1, "transparent");
      ctx.fillStyle = sysGlow;
      ctx.beginPath();
      ctx.arc(sx, sy, glowR, 0, Math.PI * 2);
      ctx.fill();

      // Orbits
      for (const p of SOLAR) {
        ctx.beginPath();
        ctx.strokeStyle = isMobile ? "rgba(148,163,184,0.18)" : "rgba(148,163,184,0.16)";
        ctx.lineWidth = 1;
        ctx.ellipse(sx, sy, p.a * scale, p.a * scale * tilt, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Asteroid belt guides
      ctx.beginPath();
      ctx.strokeStyle = "rgba(148,163,184,0.1)";
      ctx.setLineDash([2, 5]);
      ctx.ellipse(sx, sy, 1.12 * scale, 1.12 * scale * tilt, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.ellipse(sx, sy, 1.32 * scale, 1.32 * scale * tilt, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Sun corona
      const flareCount = isMobile ? 6 : 8;
      for (let i = 3; i >= 1; i--) {
        const pulse = 1 + 0.035 * Math.sin(time * 2 * motion + i) * motion;
        const corona = ctx.createRadialGradient(sx, sy, sunR * 0.2, sx, sy, sunR * (1.6 + i * 0.5) * pulse);
        corona.addColorStop(0, `rgba(251,191,36,${0.2 / i})`);
        corona.addColorStop(0.55, `rgba(249,115,22,${0.07 / i})`);
        corona.addColorStop(1, "transparent");
        ctx.fillStyle = corona;
        ctx.beginPath();
        ctx.arc(sx, sy, sunR * (1.6 + i * 0.5) * pulse, 0, Math.PI * 2);
        ctx.fill();
      }

      if (motion) {
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(time * 0.12);
        for (let i = 0; i < flareCount; i++) {
          const ang = (i / flareCount) * Math.PI * 2;
          const len = sunR * (1.35 + 0.3 * Math.sin(time * 2.5 + i));
          ctx.beginPath();
          ctx.strokeStyle = `rgba(253,224,71,${0.22 + 0.08 * Math.sin(time * 2 + i)})`;
          ctx.lineWidth = isMobile ? 1.2 : 1.8;
          ctx.moveTo(Math.cos(ang) * sunR * 0.85, Math.sin(ang) * sunR * 0.85);
          ctx.lineTo(Math.cos(ang) * len, Math.sin(ang) * len);
          ctx.stroke();
        }
        ctx.restore();
      }

      const core = ctx.createRadialGradient(sx - sunR * 0.25, sy - sunR * 0.25, 0, sx, sy, sunR);
      core.addColorStop(0, "#fff7ed");
      core.addColorStop(0.35, "#fbbf24");
      core.addColorStop(0.75, "#f59e0b");
      core.addColorStop(1, "#ea580c");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(sx, sy, sunR, 0, Math.PI * 2);
      ctx.fill();

      // Asteroids
      for (const a of asteroidsRef.current) {
        const ang =
          a.phase +
          (reducedMotionRef.current
            ? 0
            : (time / YEAR) * Math.PI * 2 * (1 / a.speed) * 0.5);
        const ax = sx + Math.cos(ang) * a.a * scale;
        const ay = sy + Math.sin(ang) * a.a * scale * tilt;
        const depth = 0.45 + 0.55 * ((Math.sin(ang) + 1) / 2);
        ctx.beginPath();
        ctx.fillStyle = `rgba(200,200,190,${0.4 * depth})`;
        ctx.arc(ax, ay, a.size * (isMobile ? 0.85 : 1), 0, Math.PI * 2);
        ctx.fill();
      }

      // Planets (depth sort)
      const sizeMul = isMobile ? 0.78 : 1;
      const positions = SOLAR.map((p) => {
        const ang =
          p.phase +
          (reducedMotionRef.current ? 0 : (time / YEAR) * Math.PI * 2 * (1 / p.period));
        return {
          p,
          ang,
          px: sx + Math.cos(ang) * p.a * scale,
          py: sy + Math.sin(ang) * p.a * scale * tilt,
        };
      }).sort((a, b) => a.py - b.py);

      for (const { p, ang, px, py } of positions) {
        const depth = 0.55 + 0.45 * ((Math.sin(ang) + 1) / 2);
        const pr = p.size * sizeMul * (0.9 + depth * 0.12);

        const glow = ctx.createRadialGradient(px, py, 0, px, py, pr * 2.2);
        glow.addColorStop(0, `rgba(${p.color},${0.3 * depth})`);
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(px, py, pr * 2.2, 0, Math.PI * 2);
        ctx.fill();

        if (p.ring && Math.sin(ang) < 0.2) {
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(-0.35);
          ctx.scale(1, 0.28);
          ctx.strokeStyle = `rgba(${p.color},${0.55 * depth})`;
          ctx.lineWidth = isMobile ? 1.6 : 2.4;
          ctx.beginPath();
          ctx.arc(0, 0, pr * 1.85, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        const body = ctx.createRadialGradient(px - pr * 0.3, py - pr * 0.3, 0, px, py, pr);
        body.addColorStop(0, `rgba(255,255,255,${0.5 * depth})`);
        body.addColorStop(0.4, `rgba(${p.color},${0.95 * depth})`);
        body.addColorStop(1, `rgba(${p.color},${0.35 * depth})`);
        ctx.fillStyle = body;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();

        if (p.ring && Math.sin(ang) >= 0.2) {
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(-0.35);
          ctx.scale(1, 0.28);
          ctx.strokeStyle = `rgba(${p.color},${0.7 * depth})`;
          ctx.lineWidth = isMobile ? 1.6 : 2.4;
          ctx.beginPath();
          ctx.arc(0, 0, pr * 1.85, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        const moonCount = isMobile ? Math.min(p.moons ?? 0, 1) : p.moons ?? 0;
        for (let m = 0; m < moonCount; m++) {
          const mang = time * (1.1 + m * 0.45) * (motion || 0.2) + m * 2 + ang;
          const md = pr * (2.15 + m * 0.65);
          ctx.beginPath();
          ctx.fillStyle = `rgba(226,232,240,${0.75 * depth})`;
          ctx.arc(px + Math.cos(mang) * md, py + Math.sin(mang) * md * 0.55, 1.2 + m * 0.25, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const draw = (t: number) => {
      if (!visibleRef.current) {
        raf = requestAnimationFrame(draw);
        return;
      }

      // Cap ~30fps on mobile
      if (layout.isMobile && t - lastFrame < 32) {
        raf = requestAnimationFrame(draw);
        return;
      }
      lastFrame = t;

      const time = t * 0.001;
      const scroll = scrollRef.current;
      const parallax = layout.isMobile || reducedMotionRef.current ? 0 : 1;
      const mx = (mouseRef.current.x - 0.5) * 16 * parallax;
      const my = (mouseRef.current.y - 0.5) * 10 * parallax;

      const bg = ctx.createRadialGradient(
        layout.sx + mx * 0.2,
        layout.sy,
        0,
        w * 0.5,
        h * 0.5,
        Math.max(w, h)
      );
      bg.addColorStop(0, "#0e1824");
      bg.addColorStop(0.5, "#070d14");
      bg.addColorStop(1, "#020406");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Soft nebulae
      const nebA = layout.isMobile ? 0.05 : 0.07;
      [
        { x: 0.18, y: 0.18, c: "94,234,212" },
        { x: 0.85, y: 0.72, c: "56,189,248" },
      ].forEach((b, i) => {
        const g = ctx.createRadialGradient(
          b.x * w + Math.sin(time * 0.08 + i) * 12,
          b.y * h + scroll * 0.02,
          0,
          b.x * w,
          b.y * h,
          w * 0.35
        );
        g.addColorStop(0, `rgba(${b.c},${nebA})`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      });

      for (const s of stars) {
        const tw = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * s.speed + s.phase));
        const px = s.x + mx * s.z * 0.25;
        const py = ((s.y + scroll * s.z * 0.04) % (h + 16)) - 8;
        const rgb = hueRgb[s.hue];
        ctx.beginPath();
        ctx.fillStyle = `rgba(${rgb},${tw * (0.4 + s.z * 0.4)})`;
        ctx.arc(px, py, s.r * s.z, 0, Math.PI * 2);
        ctx.fill();
      }

      drawSolar(time, mx * 0.35, my * 0.35);

      spawnShot(time);
      shotsRef.current = shotsRef.current.filter((shot) => {
        shot.life += 1;
        shot.x += shot.vx;
        shot.y += shot.vy;
        const fade = 1 - shot.life / shot.max;
        if (fade <= 0) return false;
        const trail = ctx.createLinearGradient(shot.x, shot.y, shot.x - shot.vx * 8, shot.y - shot.vy * 8);
        trail.addColorStop(0, `rgba(255,255,255,${0.85 * fade})`);
        trail.addColorStop(0.45, `rgba(251,191,36,${0.35 * fade})`);
        trail.addColorStop(1, "transparent");
        ctx.strokeStyle = trail;
        ctx.lineWidth = shot.thick;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(shot.x, shot.y);
        ctx.lineTo(shot.x - shot.vx * 8, shot.y - shot.vy * 8);
        ctx.stroke();
        return true;
      });

      // Edge vignette — stronger on left for desktop text
      const vig = ctx.createRadialGradient(w * 0.55, h * 0.5, h * 0.2, w * 0.5, h * 0.5, Math.max(w, h) * 0.8);
      vig.addColorStop(0, "transparent");
      vig.addColorStop(1, "rgba(1,2,5,0.5)");
      ctx.fillStyle = vig;
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
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="alpha-orb alpha-orb-a hidden md:block" />
      <div className="alpha-orb alpha-orb-b hidden md:block" />
    </div>
  );
};

export default CosmicBackground;
