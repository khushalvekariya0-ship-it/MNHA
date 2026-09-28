"use client";

import { useEffect, useRef, useState } from "react";

// Silk waves falling from the upper left, dipping low in the middle and
// rising to the right, with growth bars, travelling light dots and a glossy
// floor. All geometry is in section pixels: u = 0..1 across, v = 0..1 down.

const SAMPLES = 90;

const ribbons = [
  { dv: -0.1, th: 0.05, speed: 0.35, phase: 0.0, fill: 0.1, edge: 0.35 },
  { dv: -0.05, th: 0.075, speed: 0.42, phase: 1.3, fill: 0.14, edge: 0.55 },
  { dv: 0.0, th: 0.095, speed: 0.3, phase: 2.1, fill: 0.2, edge: 0.9 },
  { dv: 0.045, th: 0.06, speed: 0.5, phase: 3.4, fill: 0.15, edge: 0.6 },
  { dv: 0.09, th: 0.085, speed: 0.38, phase: 4.2, fill: 0.22, edge: 0.95 },
  { dv: 0.135, th: 0.05, speed: 0.46, phase: 5.0, fill: 0.12, edge: 0.45 },
];

const threads = [
  { dv: -0.17, speed: 0.28, phase: 0.7 },
  { dv: 0.03, speed: 0.33, phase: 2.6 },
  { dv: 0.2, speed: 0.4, phase: 4.4 },
];

const dots = [
  { thread: 0, u0: 0.08, speed: 0.016 },
  { thread: 1, u0: 0.55, speed: 0.013 },
  { thread: 2, u0: 0.8, speed: 0.019 },
  { thread: 0, u0: 0.72, speed: 0.015 },
  { thread: 2, u0: 0.3, speed: 0.011 },
];

const bokeh = [
  { u: 0.09, v: 0.62, r: 7 },
  { u: 0.17, v: 0.36, r: 4 },
  { u: 0.24, v: 0.9, r: 10 },
  { u: 0.58, v: 0.84, r: 5 },
  { u: 0.8, v: 0.5, r: 5 },
  { u: 0.92, v: 0.76, r: 14 },
  { u: 0.34, v: 0.3, r: 3 },
];

const bars = [
  { u: 0.846, hv: 0.13 },
  { u: 0.886, hv: 0.21 },
  { u: 0.926, hv: 0.3 },
];
const BAR_BASE = 0.6;

function base(u: number) {
  return 0.555 + 0.28 * Math.cos(2 * Math.PI * (u - 0.45)) + 0.07 * u;
}

function spread(u: number) {
  return 0.3 + 0.7 * Math.min(1, Math.abs(u - 0.45) / 0.5);
}

type Motion = { t: number; pull: number; pu: number };

function waveV(u: number, dv: number, speed: number, phase: number, m: Motion) {
  let v = base(u) + spread(u) * dv + 0.022 * Math.sin(2 * Math.PI * u * 1.3 + m.t * speed + phase);
  // the pointer lifts the waves beneath it
  v -= m.pull * 0.05 * Math.exp(-((u - m.pu) ** 2) / 0.012);
  return v;
}

// narrow screens draw the waves on a wider virtual stage (showing its middle)
// and lower down, so they stay gentle and clear of the copy
type Frame = { x: (u: number) => number; y: (v: number) => number; narrow: boolean };

function frameFor(w: number, h: number): Frame {
  const narrow = w < 768;
  const stage = narrow ? Math.max(w, h * 1.5) : w;
  const offset = (w - stage) / 2;
  return {
    narrow,
    x: (u) => offset + u * stage,
    y: (v) => (narrow ? 0.48 + v * 0.52 : v) * h,
  };
}

function linePath(f: Frame, v: (u: number) => number) {
  let d = "";
  for (let i = 0; i <= SAMPLES; i++) {
    const u = i / SAMPLES;
    d += `${i ? "L" : "M"}${f.x(u).toFixed(1)} ${f.y(v(u)).toFixed(1)}`;
  }
  return d;
}

function ribbonPaths(r: (typeof ribbons)[number], f: Frame, m: Motion) {
  const thick = (u: number) =>
    r.th * (0.35 + 0.65 * Math.sin(Math.PI * u)) * (1 + 0.25 * Math.sin(m.t * 0.6 + r.phase + u * 3));
  const top = (u: number) => waveV(u, r.dv, r.speed, r.phase, m) - thick(u) / 2;
  const bottom = (u: number) => waveV(u, r.dv, r.speed, r.phase, m) + thick(u) / 2;
  const edge = linePath(f, top);
  let back = "";
  for (let i = SAMPLES; i >= 0; i--) {
    const u = i / SAMPLES;
    back += `L${f.x(u).toFixed(1)} ${f.y(bottom(u)).toFixed(1)}`;
  }
  return { band: `${edge}${back}Z`, edge, under: linePath(f, bottom) };
}

export default function WaveBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 1536, h: 820 });
  const sizeRef = useRef(size);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => {
      const next = { w: root.clientWidth || 1536, h: root.clientHeight || 820 };
      sizeRef.current = next;
      setSize(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    if (!root || !svg) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const q = <T extends Element>(sel: string) => Array.from(svg.querySelectorAll<T>(sel));
    const bands = q<SVGPathElement>("[data-band]");
    const edges = q<SVGPathElement>("[data-edge]");
    const glows = q<SVGPathElement>("[data-glow]");
    const unders = q<SVGPathElement>("[data-under]");
    const threadEls = q<SVGPathElement>("[data-thread]");
    const dotEls = q<SVGGElement>("[data-dot]");
    const barEls = q<SVGGElement>("[data-bar]");
    const bokehEls = q<SVGCircleElement>("[data-bokeh]");
    const scene = svg.querySelector<SVGGElement>("[data-scene]");

    const m: Motion = { t: 0, pull: 0, pu: 0.5 };
    let pullTarget = 0;
    let revealAt = reduced ? -10 : -1;
    const start = performance.now();

    const draw = () => {
      const { w, h } = sizeRef.current;
      const f = frameFor(w, h);
      const t = m.t;
      const since = revealAt < 0 ? 0 : t - revealAt;
      const ease = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);
      const shown = revealAt === -10 ? 1 : ease(since / 1.6);

      ribbons.forEach((r, i) => {
        const p = ribbonPaths(r, f, m);
        bands[i]?.setAttribute("d", p.band);
        edges[i]?.setAttribute("d", p.edge);
        glows[i]?.setAttribute("d", p.edge);
        unders[i]?.setAttribute("d", p.under);
      });
      threads.forEach((th, i) => {
        threadEls[i]?.setAttribute("d", linePath(f, (u) => waveV(u, th.dv, th.speed, th.phase, m)));
      });
      dots.forEach((dot, i) => {
        const th = threads[dot.thread];
        const u = (dot.u0 + t * dot.speed) % 1;
        const v = waveV(u, th.dv, th.speed, th.phase, m);
        const el = dotEls[i];
        if (!el) return;
        el.setAttribute("transform", `translate(${f.x(u).toFixed(1)} ${f.y(v).toFixed(1)})`);
        const edgeFade = Math.min(1, u / 0.08, (1 - u) / 0.08);
        el.style.opacity = String((revealAt === -10 ? 1 : ease((since - 1.2) / 0.6)) * edgeFade);
      });
      bars.forEach((bar, i) => {
        const grow = revealAt === -10 ? 1 : ease((since - 0.5) / 1.3);
        const breathe = 1 + 0.035 * Math.sin(t * 0.9 + i * 1.7);
        const barH = bar.hv * h * grow * breathe;
        const el = barEls[i];
        if (!el) return;
        el.setAttribute("transform", `translate(${(bar.u * w - 14).toFixed(1)} ${(BAR_BASE * h - barH).toFixed(1)})`);
        el.querySelector("[data-bar-body]")?.setAttribute("height", Math.max(barH, 0).toFixed(1));
      });
      bokehEls.forEach((el, i) => {
        el.style.opacity = String(0.35 + 0.3 * Math.sin(t * 0.5 + i * 1.9));
      });
      if (scene) {
        scene.style.opacity = String(shown);
        scene.style.transform = `translateY(${((1 - shown) * 40).toFixed(1)}px)`;
      }
    };

    if (reduced) {
      draw();
      return;
    }

    let raf = 0;
    let running = false;
    const frame = (now: number) => {
      m.t = (now - start) / 1000;
      m.pull += (pullTarget - m.pull) * 0.05;
      draw();
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.25 && revealAt < 0) {
          revealAt = (performance.now() - start) / 1000;
        }
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(frame);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: [0, 0.25, 0.5] }
    );
    io.observe(root);

    const onPointer = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      pullTarget = inside ? 1 : 0;
      if (inside) m.pu += ((e.clientX - r.left) / r.width - m.pu) * 0.5;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    draw();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  const { w, h } = size;
  const frame = frameFor(w, h);
  const still: Motion = { t: 0, pull: 0, pu: 0.5 };

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_18%,rgba(34,211,238,0.22),transparent_32%),radial-gradient(ellipse_70%_45%_at_50%_75%,rgba(14,116,188,0.18),transparent_70%),linear-gradient(180deg,#05070b_0%,#04101f_22%,#051a2e_68%,#041424_88%,#05070b_100%)]" />

      <div data-mouse-parallax="10" className="absolute inset-0">
        <svg ref={svgRef} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="size-full">
          <defs>
            <linearGradient id="wave-fill" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#1e4bd8" />
              <stop offset="0.45" stopColor="#16b8ff" />
              <stop offset="1" stopColor="#19e6d2" />
            </linearGradient>
            <linearGradient id="wave-edge" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#3b82ff" />
              <stop offset="0.45" stopColor="#6ff3ff" />
              <stop offset="1" stopColor="#2ee6d6" />
            </linearGradient>
            <linearGradient id="bar-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#5ef0ff" stopOpacity="0.5" />
              <stop offset="1" stopColor="#5ef0ff" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="bokeh-fill">
              <stop offset="0" stopColor="#6ff3ff" stopOpacity="0.9" />
              <stop offset="1" stopColor="#6ff3ff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="floor-glow">
              <stop offset="0" stopColor="#22d3ee" stopOpacity="0.28" />
              <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="floor-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#3ad8ff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#3ad8ff" stopOpacity="0.7" />
              <stop offset="1" stopColor="#3ad8ff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* glossy floor */}
          <ellipse cx={w * 0.32} cy={h * 0.93} rx={w * 0.16} ry={h * 0.035} fill="url(#floor-glow)" />
          <ellipse cx={w * 0.64} cy={h * 0.95} rx={w * 0.2} ry={h * 0.03} fill="url(#floor-glow)" />
          <line x1="0" x2={w} y1={h * 0.9} y2={h * 0.9} stroke="url(#floor-line)" strokeWidth="1" />

          <g data-scene="">
            {/* growth bars, behind the waves */}
            {!frame.narrow && bars.map((bar, i) => (
              <g key={i} data-bar="" transform={`translate(${bar.u * w - 14} ${BAR_BASE * h - bar.hv * h})`}>
                <rect data-bar-body="" width="28" height={bar.hv * h} fill="url(#bar-fill)" />
                <rect width="28" height="2" fill="#9ff8ff" />
                <rect x="-6" y="-6" width="40" height="12" rx="6" fill="#5ef0ff" opacity="0.18" />
              </g>
            ))}

            {ribbons.map((r, i) => {
              const p = ribbonPaths(r, frame, still);
              return (
                <g key={i}>
                  <path data-band="" d={p.band} fill="url(#wave-fill)" fillOpacity={r.fill} />
                  <path data-glow="" d={p.edge} fill="none" stroke="url(#wave-edge)" strokeOpacity={r.edge * 0.22} strokeWidth="6" />
                  <path data-edge="" d={p.edge} fill="none" stroke="url(#wave-edge)" strokeOpacity={r.edge} strokeWidth="1.4" />
                  <path data-under="" d={p.under} fill="none" stroke="url(#wave-edge)" strokeOpacity={r.edge * 0.35} strokeWidth="0.8" />
                </g>
              );
            })}

            {threads.map((th, i) => (
              <path
                key={i}
                data-thread=""
                d={linePath(frame, (u) => waveV(u, th.dv, th.speed, th.phase, still))}
                fill="none"
                stroke="#7ff6ff"
                strokeOpacity="0.55"
                strokeWidth="1"
              />
            ))}

            {dots.map((_, i) => (
              <g key={i} data-dot="" style={{ opacity: 0 }}>
                <circle r="9" fill="#5ef0ff" opacity="0.22" />
                <circle r="3" fill="#c8fbff" />
              </g>
            ))}

            {bokeh.map((b, i) => (
              <circle key={i} data-bokeh="" cx={b.u * w} cy={b.v * h} r={b.r} fill="url(#bokeh-fill)" />
            ))}
          </g>
        </svg>
      </div>

      {/* keeps the copy crisp over the waves */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_34%_36%_at_50%_36%,rgba(4,12,26,0.65),transparent_78%)]" />
    </div>
  );
}
