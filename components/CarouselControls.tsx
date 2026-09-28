"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  threshold = 0.45
) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return inView;
}

// Pause autoplay while a real mouse hovers or a keyboard user focuses inside.
// Touch taps are ignored on purpose: mobile browsers leave a sticky
// emulated hover (and focus) behind, which would stop autoplay for good.
export function useHoverPause() {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  return {
    paused: hover || focus,
    handlers: {
      onPointerEnter: (e: React.PointerEvent) => {
        if (e.pointerType === "mouse") setHover(true);
      },
      onPointerLeave: (e: React.PointerEvent) => {
        if (e.pointerType === "mouse") setHover(false);
      },
      onFocus: (e: React.FocusEvent) => {
        if (e.target instanceof Element && e.target.matches(":focus-visible")) {
          setFocus(true);
        }
      },
      onBlur: () => setFocus(false),
    },
  };
}

// horizontal swipe on touch screens; also reports when a finger is down
export function useSwipe(onPrev: () => void, onNext: () => void) {
  const startX = useRef<number | null>(null);
  const [touching, setTouching] = useState(false);
  return {
    touching,
    handlers: {
      onTouchStart: (e: React.TouchEvent) => {
        startX.current = e.touches[0].clientX;
        setTouching(true);
      },
      onTouchEnd: (e: React.TouchEvent) => {
        setTouching(false);
        if (startX.current === null) return;
        const dx = e.changedTouches[0].clientX - startX.current;
        startX.current = null;
        if (Math.abs(dx) < 40) return;
        if (dx < 0) onNext();
        else onPrev();
      },
    },
  };
}

function Arrow({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous screen" : "Next screen"}
      className="flex size-10 items-center justify-center rounded-full border border-line-strong bg-ink/[0.03] text-ink transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-[0_0_20px_-4px_rgba(0,208,156,0.7)] active:scale-90"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={dir === "prev" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
      </svg>
    </button>
  );
}

// Arrows + dots. The active dot fills up over `interval`; when the fill's
// animation ends the carousel advances, so pausing the animation pauses
// autoplay too (and reduced-motion, which disables it, turns autoplay off).
export default function CarouselControls({
  count,
  index,
  onChange,
  paused,
  interval = 3800,
  accent = "#00d09c",
  labels,
}: {
  count: number;
  index: number;
  onChange: (index: number) => void;
  paused: boolean;
  interval?: number;
  accent?: string;
  labels?: string[];
}) {
  const next = () => onChange((index + 1) % count);
  const prev = () => onChange((index - 1 + count) % count);

  return (
    <div className="flex items-center justify-center gap-4">
      <Arrow dir="prev" onClick={prev} />
      <div className="flex items-center gap-1.5">
        {Array.from({ length: count }).map((_, i) => {
          const active = i === index;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange(i)}
              aria-label={labels?.[i] ?? `Screen ${i + 1}`}
              aria-current={active ? "true" : undefined}
              className={`relative h-1.5 overflow-hidden rounded-full transition-all duration-300 ${
                active ? "w-9 bg-ink/15" : "w-1.5 bg-line-strong hover:bg-muted"
              }`}
            >
              {active && (
                <span
                  key={index}
                  className="autoplay-fill absolute inset-0 rounded-full"
                  style={{
                    backgroundColor: accent,
                    animationDuration: `${interval}ms`,
                    animationPlayState: paused ? "paused" : "running",
                  }}
                  onAnimationEnd={next}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
      <Arrow dir="next" onClick={next} />
    </div>
  );
}
