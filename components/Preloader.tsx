"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "show" | "exit" | "gone";

const COUNT_MS = 1300;
const EXIT_AT = 1500;
const EXIT_MS = 1000;
// matches the .preloader safety-net animation delay in globals.css
const SAFETY_MS = 4000;

export default function Preloader() {
  const [phase, setPhase] = useState<Phase>("show");
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // hydrated late: the CSS safety net (4s) is already opening the iris
    const late = performance.now() > SAFETY_MS - 200;
    if (reduced || late) {
      document.body.classList.add("loaded");
      if (reduced) {
        setPhase("gone");
        return;
      }
      const done = window.setTimeout(() => setPhase("gone"), 1200);
      return () => window.clearTimeout(done);
    }

    // counter and bar run together, easing into 100
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / COUNT_MS, 1);
      const eased = 1 - Math.pow(1 - p, 2.4);
      if (countRef.current) countRef.current.textContent = String(Math.round(eased * 100));
      if (barRef.current) barRef.current.style.transform = `scaleX(${eased})`;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // the site starts animating in as the iris opens
    const exitTimer = window.setTimeout(() => {
      setPhase("exit");
      document.body.classList.add("loaded");
    }, EXIT_AT);
    const goneTimer = window.setTimeout(() => setPhase("gone"), EXIT_AT + EXIT_MS);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(exitTimer);
      window.clearTimeout(goneTimer);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div className={`preloader ${phase === "exit" ? "is-done" : ""}`} aria-hidden="true">
      <div className="preloader-content">
        <svg width="72" height="72" viewBox="0 0 34 34" fill="none" className="preloader-mark drop-shadow-[0_0_26px_rgba(0,208,156,0.55)]">
          <defs>
            <linearGradient id="preloader-g" x1="0" y1="0" x2="34" y2="34">
              <stop offset="0%" stopColor="#4df3c9" />
              <stop offset="100%" stopColor="#00b386" />
            </linearGradient>
          </defs>
          <rect width="34" height="34" rx="9" fill="url(#preloader-g)" />
          <path
            className="preloader-m"
            d="M10.5 22.5v-11l6.5 7 6.5-7v11"
            pathLength={1}
            stroke="#03140e"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <p className="mt-5 flex text-3xl font-bold tracking-[-0.02em] text-ink">
          {"MNHA".split("").map((letter, i) => (
            <span key={i} className="inline-block overflow-hidden pb-1">
              <span className="preloader-letter inline-block" style={{ "--i": i } as React.CSSProperties}>
                {letter}
              </span>
            </span>
          ))}
        </p>
        <p className="preloader-tag text-[10px] font-bold uppercase tracking-[0.34em] text-primary">
          Your Wealth
        </p>

        <div className="mt-7 flex items-center gap-3">
          <div className="preloader-bar">
            <span ref={barRef} />
          </div>
          <span className="w-9 text-right text-xs font-semibold tabular-nums text-muted">
            <span ref={countRef}>0</span>%
          </span>
        </div>
      </div>
    </div>
  );
}
