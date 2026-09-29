"use client";

import { useEffect, useRef, useState } from "react";
import SplitWords from "@/components/SplitWords";

function Check() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

const steps = [
  {
    n: "01",
    title: "Connect your demat with us",
    text: "Link the demat account you already have, from any broker, in a few taps.",
    visual: (
      <div className="space-y-2.5">
        <div className="flex gap-2.5">
          <div className="flex-1 rounded-lg border border-primary/50 bg-primary/10 px-3.5 py-2.5 text-center text-xs font-bold text-primary">
            CDSL
          </div>
          <div className="flex-1 rounded-lg border border-line bg-raised px-3.5 py-2.5 text-center text-xs font-semibold text-muted">
            NSDL
          </div>
        </div>
        <div className="rounded-lg border border-line bg-raised px-3.5 py-2.5 text-xs text-muted">
          Demat ID · 1208 XXXX XXXX XXXX
        </div>
        <div className="rounded-lg bg-primary px-3.5 py-2.5 text-center text-xs font-bold text-[#03140e]">
          Connect demat
        </div>
      </div>
    ),
  },
  {
    n: "02",
    title: "Complete paperless KYC",
    text: "Verify with PAN and Aadhaar — fully online, no branch visits.",
    visual: (
      <div className="space-y-2.5">
        {["PAN verified", "Aadhaar verified", "Bank account linked"].map(
          (row) => (
            <div
              key={row}
              className="flex items-center justify-between rounded-lg border border-line bg-raised px-3.5 py-2.5"
            >
              <span className="text-xs font-medium text-body">{row}</span>
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[#03140e] shadow-[0_0_10px_rgba(0,208,156,0.6)]">
                <Check />
              </span>
            </div>
          )
        )}
      </div>
    ),
  },
  {
    n: "03",
    title: "Sign our consent",
    text: "Review the terms and e-sign our consent online. No printouts, no paperwork.",
    visual: (
      <div className="space-y-2.5">
        <div className="rounded-lg border border-line bg-raised px-3.5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            Consent form
          </p>
          <div className="mt-2.5 space-y-1.5" aria-hidden="true">
            <div className="h-1.5 w-full rounded-full bg-line" />
            <div className="h-1.5 w-4/5 rounded-full bg-line" />
          </div>
        </div>
        <div className="flex items-center gap-2 px-1">
          <span className="flex size-5 items-center justify-center rounded-md bg-primary text-[#03140e] shadow-[0_0_10px_rgba(0,208,156,0.6)]">
            <Check />
          </span>
          <span className="text-xs font-medium text-body">I agree to the terms</span>
        </div>
        <div className="rounded-lg bg-primary px-3.5 py-2.5 text-center text-xs font-bold text-[#03140e]">
          e-Sign consent
        </div>
      </div>
    ),
  },
  {
    n: "04",
    title: "Start your trading journey",
    text: "Buy your first stock or start a SIP with just ₹100.",
    visual: (
      <div className="rounded-xl border border-line bg-raised p-4">
        <div className="flex items-baseline justify-between">
          <p className="text-lg font-bold text-ink">₹2,48,320</p>
          <span className="text-xs font-bold text-primary">▲ 12.5%</span>
        </div>
        <svg viewBox="0 0 220 70" className="mt-2 w-full" aria-hidden="true">
          <defs>
            <linearGradient id="step-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00d09c" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#00d09c" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 60 L25 52 L50 56 L75 40 L100 44 L125 28 L150 32 L175 16 L200 20 L220 6 L220 70 L0 70 Z"
            fill="url(#step-fill)"
          />
          <path
            d="M0 60 L25 52 L50 56 L75 40 L100 44 L125 28 L150 32 L175 16 L200 20 L220 6"
            fill="none"
            stroke="#4df3c9"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
  },
];

export default function Steps() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  // -1 while stacked (below lg); React only re-renders when the step changes
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    let raf = 0;
    const update = () => {
      raf = 0;
      const section = sectionRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!section || !viewport || !track) return;
      if (!mq.matches) {
        track.style.transform = "";
        setActive(-1);
        return;
      }
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      const shift = Math.max(track.scrollWidth - viewport.clientWidth, 0);
      track.style.transform = `translate3d(${(-p * shift).toFixed(1)}px, 0, 0)`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.max(p, 0.02).toFixed(4)})`;
      setActive(Math.min(Math.round(p * (steps.length - 1)), steps.length - 1));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    mq.addEventListener("change", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mq.removeEventListener("change", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative lg:h-[300vh]">
      <div className="relative overflow-hidden py-24 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0">
        <div
          className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-32 top-1/4 size-96 rounded-full bg-primary/15 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-32 bottom-0 size-96 rounded-full bg-accent/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            data-animate=""
            className="flex flex-wrap items-end justify-between gap-6"
          >
            <div>
              <p className="eyebrow">How it works</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
                <SplitWords text="Start investing in 4 simple steps" accent={["4"]} />
              </h2>
            </div>
            <div className="hidden w-64 lg:block">
              <div className="flex justify-between text-xs font-bold tracking-wider text-muted">
                <span className="text-ink">0{Math.max(active, 0) + 1}</span>
                <span>0{steps.length}</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-line">
                <div
                  ref={barRef}
                  className="h-full origin-left rounded-full bg-primary shadow-[0_0_12px_rgba(0,208,156,0.8)]"
                  style={{ transform: "scaleX(0.02)" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div ref={viewportRef} className="relative mt-12 lg:mt-14">
          <div
            ref={trackRef}
            className="spot-group flex flex-col gap-5 px-4 will-change-transform sm:px-6 lg:w-max lg:flex-row lg:gap-6 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-[14vw]"
          >
            {steps.map((step, i) => {
              const lit = active === -1 || i === active;
              return (
                <article
                  key={step.n}
                  className={`card group flex w-full shrink-0 flex-col rounded-3xl p-7 transition-opacity duration-500 lg:w-[420px] lg:p-8 ${
                    lit
                      ? "border-primary/40 shadow-[0_0_60px_-18px_rgba(0,208,156,0.45)]"
                      : "lg:opacity-45"
                  }`}
                >
                  <span
                    className={`text-6xl font-black tracking-tight transition-colors duration-500 ${
                      lit ? "text-primary" : "text-line-strong"
                    }`}
                  >
                    {step.n}
                  </span>
                  <div className="mt-6 h-40 transition-transform duration-500 group-hover:scale-[1.03]">
                    {step.visual}
                  </div>
                  <h3 className="mt-7 text-2xl font-bold tracking-tight text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-base leading-7">{step.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
