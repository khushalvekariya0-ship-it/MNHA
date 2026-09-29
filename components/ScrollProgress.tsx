"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    // page height is cached (refreshed on resize) and the scroll position is read
    // in the scroll event, while layout is clean; the frame callback only writes
    let max = 1;
    let y = window.scrollY;
    const measure = () => {
      max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    };
    const paint = () => {
      raf = 0;
      const p = Math.min(Math.max(y / max, 0), 1);
      if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
    };
    const onScroll = () => {
      y = window.scrollY;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const ro = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    ro.observe(document.body);
    measure();
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]" aria-hidden="true">
      <div
        ref={barRef}
        className="h-full origin-left rounded-r-full bg-gradient-to-r from-primary to-primary-dark shadow-[0_0_8px_rgba(0,208,156,0.6)] will-change-transform"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
