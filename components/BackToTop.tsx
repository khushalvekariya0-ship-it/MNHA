"use client";

import { useEffect, useRef, useState } from "react";
import { scrollToTop } from "./SmoothScroll";

const R = 21;
const CIRCUMFERENCE = 2 * Math.PI * R;

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      setVisible(window.scrollY > 500);
      ringRef.current?.setAttribute("stroke-dashoffset", String(CIRCUMFERENCE * (1 - progress)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      tabIndex={visible ? 0 : -1}
      className={`group fixed bottom-5 right-4 z-40 flex size-12 items-center justify-center rounded-full border border-line-strong bg-surface/80 text-ink shadow-[0_12px_30px_-12px_var(--shadow-deep)] backdrop-blur-md transition-[opacity,translate,scale,box-shadow,border-color] duration-300 ease-out hover:border-primary hover:shadow-[0_0_24px_-4px_rgba(0,208,156,0.6)] active:scale-90 sm:bottom-7 sm:right-7 ${
        visible ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-90 opacity-0"
      }`}
    >
      {/* ring fills with how far down the page you are */}
      <svg
        className="absolute inset-0 -rotate-90"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <circle
          ref={ringRef}
          cx="24"
          cy="24"
          r={R}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
        />
      </svg>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform duration-300 group-hover:-translate-y-0.5"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
