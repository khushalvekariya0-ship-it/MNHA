"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollText({
  text,
  highlight = [],
  className = "",
}: {
  text: string;
  highlight?: string[];
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const total = text.split(" ").length;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLit(total);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (vh * 0.82 - rect.top) / (rect.height + vh * 0.3);
      setLit(Math.round(Math.min(Math.max(progress, 0), 1) * total));
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
  }, [text]);

  const accents = highlight.map((word) => word.toLowerCase());

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const on = i < lit;
        const accent = accents.includes(
          word.toLowerCase().replace(/[^a-z0-9]/g, "")
        );
        return (
          <span
            key={i}
            className={`transition-colors duration-300 ${
              on ? (accent ? "text-primary" : "text-ink") : "text-line-strong"
            }`}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </p>
  );
}
