"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

let activeLenis: Lenis | null = null;

// scrolls with Lenis when it runs, so the glide matches normal wheel scrolling
export function scrollToTop() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (activeLenis) activeLenis.scrollTo(0, { duration: 1.4, immediate: reduced });
  else window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
}

export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: true,
    });
    lenisRef.current = lenis;
    activeLenis = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
      activeLenis = null;
    };
  }, []);

  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
