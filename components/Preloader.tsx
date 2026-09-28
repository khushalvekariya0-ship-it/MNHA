"use client";

import { useEffect, useState } from "react";
import { LogoMark } from "./Logo";

type Phase = "show" | "lift" | "gone";

export default function Preloader() {
  const [phase, setPhase] = useState<Phase>("show");

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      document.body.classList.add("loaded");
      setPhase("gone");
      return;
    }
    const liftTimer = window.setTimeout(() => {
      setPhase("lift");
      document.body.classList.add("loaded");
    }, 1300);
    const goneTimer = window.setTimeout(() => setPhase("gone"), 2150);
    return () => {
      window.clearTimeout(liftTimer);
      window.clearTimeout(goneTimer);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className={`preloader ${phase === "lift" ? "is-done" : ""}`}
      aria-hidden="true"
    >
      <div className="preloader-logo relative">
        <LogoMark size={64} />
      </div>
      <p className="preloader-tag relative mt-4 text-xs font-bold uppercase tracking-[0.3em] text-primary-dark">
        Your Wealth
      </p>
      <div className="preloader-bar">
        <span />
      </div>
    </div>
  );
}
