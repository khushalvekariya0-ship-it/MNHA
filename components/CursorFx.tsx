"use client";

import { useEffect, useRef } from "react";

export default function CursorFx() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    const glow = glowRef.current;
    if (!fine || reduced || !dot || !ring || !label || !glow) return;

    let mx = -500;
    let my = -500;
    let rx = -500;
    let ry = -500;
    let gx = -500;
    let gy = -500;
    let raf = 0;
    // transforms only (no left/top), so moving the cursor never triggers layout
    const place = (el: HTMLElement, x: number, y: number) => {
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
    };

    const loop = () => {
      rx += (mx - rx) * 0.2;
      ry += (my - ry) * 0.2;
      gx += (mx - gx) * 0.08;
      gy += (my - gy) * 0.08;
      place(ring, rx, ry);
      glow.style.transform = `translate3d(${gx.toFixed(1)}px, ${gy.toFixed(1)}px, 0)`;
      // rest once everything has caught up with the pointer
      const settled = Math.abs(mx - rx) < 0.1 && Math.abs(my - ry) < 0.1 && Math.abs(mx - gx) < 0.1 && Math.abs(my - gy) < 0.1;
      raf = settled ? 0 : requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      place(dot, mx, my);
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onOver = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return;
      const labelled = e.target.closest<HTMLElement>("[data-cursor]");
      if (labelled) {
        label.textContent = labelled.dataset.cursor ?? "";
        ring.classList.add("has-label");
        ring.classList.remove("is-hover");
        dot.classList.add("is-hidden");
        return;
      }
      ring.classList.remove("has-label");
      dot.classList.remove("is-hidden");
      const interactive = e.target.closest(
        "a, button, input, select, textarea, label, [role='button'], .card"
      );
      ring.classList.toggle("is-hover", !!interactive);
    };

    const onDown = () => ring.classList.add("is-down");
    const onUp = () => ring.classList.remove("is-down");

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{ transform: "translate3d(-500px, -500px, 0)" }}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{ transform: "translate3d(-500px, -500px, 0)" }}
        aria-hidden="true"
      >
        <span ref={labelRef} className="cursor-label" />
      </div>
    </>
  );
}
