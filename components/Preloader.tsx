"use client";

import { useEffect, useRef, useState } from "react";

// the whole sequence is CSS-timed from first paint (see .preloader in
// globals.css): intro, fold, line, split. It fades itself out when done; this
// component only takes it out of the DOM once that final animation finishes.
export default function Preloader() {
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finish = () => {
      document.body.classList.add("loaded");
      setGone(true);
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      finish();
      return;
    }
    const hide = rootRef.current
      ?.getAnimations()
      .find((a) => (a as CSSAnimation).animationName === "pl-hide");
    let cancelled = false;
    // resolves straight away if the sequence already ended before hydration
    hide?.finished.then(() => !cancelled && finish()).catch(() => {});
    const fallback = window.setTimeout(finish, 8000);
    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={rootRef} className="preloader" aria-hidden="true">
      <div className="preloader-half is-top" />
      <div className="preloader-half is-bottom" />
      <div className="preloader-glow" />
      <div className="preloader-line" />

      <div className="preloader-content">
        <div className="preloader-mark-wrap">
          <svg
            width="72"
            height="72"
            viewBox="0 0 34 34"
            fill="none"
            className="preloader-mark drop-shadow-[0_0_26px_rgba(0,208,156,0.55)]"
          >
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
        </div>

        <div className="preloader-text">
          <p className="mt-5 flex text-3xl font-bold tracking-[-0.02em] text-ink">
            {"MNHA".split("").map((letter, i) => (
              <span key={i} className="inline-block overflow-hidden pb-1">
                <span className="preloader-letter inline-block" style={{ "--i": i } as React.CSSProperties}>
                  {letter}
                </span>
              </span>
            ))}
          </p>
          <p className="preloader-tag whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.34em] text-primary">
            Your Wealth
          </p>

          <div className="mt-7 flex items-center gap-3">
            <div className="preloader-bar">
              <span />
            </div>
            <span className="preloader-count w-9 text-right text-xs font-semibold tabular-nums text-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
