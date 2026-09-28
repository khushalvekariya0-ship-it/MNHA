"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type TimelineItem = {
  period: string;
  title: string;
  description?: string;
  icon: ReactNode;
};

export default function Timeline({ items }: { items: TimelineItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [fill, setFill] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const trigger = window.innerHeight * 0.72;
      const max = Math.max(rect.height - 32, 0);
      const px = Math.min(Math.max(trigger - rect.top, 0), max);
      setFill(px);

      let count = 0;
      itemRefs.current.forEach((li) => {
        if (li && li.offsetTop + 40 <= px) count += 1;
      });
      setActive(count);
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
    <div ref={containerRef} className="relative mt-16">
      {/* base track */}
      <div
        className="absolute bottom-4 left-[19px] top-4 w-px bg-line-strong lg:left-1/2 lg:-translate-x-1/2"
        aria-hidden="true"
      />

      {/* glowing progress fill */}
      <div
        className="absolute left-[19px] top-4 w-0.5 rounded-full bg-gradient-to-b from-primary-bright to-primary shadow-[0_0_16px_rgba(0,208,156,0.9)] transition-[height] duration-200 ease-out lg:left-1/2 lg:-translate-x-1/2"
        style={{ height: `${fill}px` }}
        aria-hidden="true"
      />

      <ol className="spot-group space-y-10 lg:space-y-14">
        {items.map((item, index) => {
          const isActive = index < active;
          const isLeft = index % 2 === 0;
          return (
            <li
              key={item.title}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className="relative lg:grid lg:grid-cols-2 lg:gap-16"
            >
              {/* dot pops in when the line reaches it */}
              <span
                className={`absolute left-[19px] top-10 z-10 flex size-4 -translate-x-1/2 items-center justify-center rounded-full transition-all duration-500 lg:left-1/2 ${
                  isActive
                    ? "scale-100 bg-primary opacity-100 shadow-[0_0_20px_rgba(0,208,156,1)]"
                    : "scale-0 opacity-0"
                }`}
                aria-hidden="true"
              >
                {isActive && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary/60 [animation-duration:1.8s]" />
                )}
              </span>

              <div
                className={`ml-12 lg:ml-0 ${
                  isLeft ? "lg:pr-2" : "lg:col-start-2 lg:pl-2"
                }`}
              >
                <div
                  className={`card group rounded-3xl p-6 transition-all duration-500 sm:p-7 ${
                    isActive
                      ? "border-primary/50 shadow-[0_0_50px_-18px_rgba(0,208,156,0.55)]"
                      : `translate-y-3 opacity-50 blur-[2px] lg:translate-y-0 ${
                          isLeft ? "lg:-translate-x-8" : "lg:translate-x-8"
                        }`
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`relative inline-flex size-11 shrink-0 items-center justify-center rounded-xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 ${
                        isActive
                          ? "bg-gradient-to-br from-primary-bright to-primary-dark text-[#03140e] shadow-[0_0_24px_-4px_rgba(0,208,156,0.7)]"
                          : "scale-75 bg-raised text-muted"
                      }`}
                      aria-hidden="true"
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {item.icon}
                      </svg>
                    </span>

                    <span
                      className={`text-3xl font-extrabold tracking-tight transition-all duration-500 sm:text-4xl ${
                        isActive
                          ? "text-primary drop-shadow-[0_0_14px_rgba(0,208,156,0.6)]"
                          : "text-line-strong"
                      }`}
                    >
                      {item.period}
                    </span>
                  </div>

                  <h3
                    className={`mt-4 text-lg font-semibold transition-colors duration-500 ${
                      isActive ? "text-ink" : "text-muted"
                    }`}
                  >
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-1.5 text-sm leading-6">{item.description}</p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
