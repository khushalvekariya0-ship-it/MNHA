"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { StarfallBus } from "./three/StarfallCanvas";
import { useTheme } from "./theme";

const StarfallCanvas = dynamic(() => import("./three/StarfallCanvas"), { ssr: false });

const reviews = [
  { quote: "Super easy to use and the interface is beautiful!", name: "Sneha Desai", role: "Teacher", color: "from-primary to-primary-dark" },
  { quote: "No hidden charges, no confusion. Just clarity.", name: "Rohit Kumar", role: "Banker", color: "from-accent to-indigo-600" },
  { quote: "The SIP calculator really helps me plan better.", name: "Amit Verma", role: "Business Owner", color: "from-amber-500 to-amber-700" },
  { quote: "Support actually cares about your goals.", name: "Pooja Singh", role: "Designer", color: "from-rose-500 to-rose-700" },
  { quote: "My first SIP felt completely effortless.", name: "Priya Sharma", role: "Architect", color: "from-violet-500 to-violet-700" },
  { quote: "Stocks, gold and funds, all in one place.", name: "Kavita Iyer", role: "Doctor", color: "from-primary to-primary-dark" },
  { quote: "KYC done in five minutes. Seriously.", name: "Sandeep Rao", role: "Freelancer", color: "from-sky-500 to-sky-700" },
  { quote: "Clear pricing and quick withdrawals.", name: "Rahul Mehta", role: "Software Engineer", color: "from-accent to-indigo-600" },
];

const EVERY = 2800;
const SHOW = 6200;
const LEAVE = 600;

type Slot = { x: number; y: number; align: "left" | "right" | "center"; maxW: number };
type Chip = { id: number; review: number; slot: number; phase: "incoming" | "shown" | "leaving" };

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

// layout offset inside `root`, ignoring transforms
function layoutTop(el: HTMLElement, root: HTMLElement) {
  let top = 0;
  for (
    let node: HTMLElement | null = el;
    node && node !== root;
    node = node.offsetParent as HTMLElement | null
  ) {
    top += node.offsetTop;
  }
  return top;
}

export default function StarfallReviews() {
  const theme = useTheme();
  const rootRef = useRef<HTMLDivElement>(null);
  const busRef = useRef<StarfallBus>({});
  const [slots, setSlots] = useState<Slot[]>([]);
  const [chips, setChips] = useState<Chip[]>([]);
  const chipsRef = useRef<Chip[]>([]);
  useEffect(() => {
    chipsRef.current = chips;
  }, [chips]);

  // landing spots: around the headline on wide screens, stacked below it otherwise
  useEffect(() => {
    const root = rootRef.current;
    const section = root?.closest("section");
    const stage = section?.querySelector<HTMLElement>("[data-scene-anchor]");
    if (!root || !section || !stage) return;
    const measure = () => {
      const w = root.clientWidth;
      const h = root.clientHeight;
      const stageTop = layoutTop(stage, section);
      const stageH = stage.offsetHeight;
      if (w >= 1280) {
        const side = Math.min(400, (w - 680) / 2 - 20);
        setSlots([
          { x: w * 0.04, y: h * 0.2, align: "left", maxW: side },
          { x: w * 0.04, y: h * 0.16, align: "right", maxW: side },
          { x: w * 0.07, y: h * 0.47, align: "left", maxW: side },
          { x: w * 0.07, y: h * 0.43, align: "right", maxW: side },
          { x: w / 2, y: stageTop + stageH / 2 - 34, align: "center", maxW: 440 },
        ]);
      } else {
        const maxW = Math.min(460, w - 32);
        setSlots(
          [0.04, 0.37, 0.7].map((f) => ({ x: w / 2, y: stageTop + stageH * f, align: "center" as const, maxW }))
        );
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(section);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  // one star, one review: drop a star on a free slot every few seconds
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !slots.length) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setChips(slots.slice(0, 3).map((_, i) => ({ id: i, review: i, slot: i, phase: "shown" })));
      return;
    }

    const order = slots.length === 5 ? [0, 3, 4, 1, 2] : [0, 1, 2];
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const later = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };
    const setPhase = (id: number, phase: Chip["phase"]) =>
      setChips((list) => list.map((chip) => (chip.id === id ? { ...chip, phase } : chip)));

    let nextId = 1;
    let nextReview = 0;
    let turn = 0;
    let inView = false;
    let loop: ReturnType<typeof setInterval> | undefined;

    const drop = () => {
      if (!inView || document.hidden) return;
      const taken = new Set(chipsRef.current.map((chip) => chip.slot));
      let slot = -1;
      for (let k = 0; k < order.length; k++) {
        const candidate = order[(turn + k) % order.length];
        if (!taken.has(candidate)) {
          slot = candidate;
          turn = (turn + k + 1) % order.length;
          break;
        }
      }
      if (slot < 0) return;
      const id = nextId++;
      const review = nextReview;
      nextReview = (nextReview + 1) % reviews.length;
      setChips((list) => [...list, { id, review, slot, phase: "incoming" }]);

      const land = () => {
        setPhase(id, "shown");
        later(() => setPhase(id, "leaving"), SHOW);
        later(() => setChips((list) => list.filter((chip) => chip.id !== id)), SHOW + LEAVE);
      };
      // aim at the avatar once the (still hidden) chip has been laid out; give the
      // 3D scene a moment to load, and show the review anyway if it never does
      const aim = (waited: number) => {
        const avatar = root.querySelector<HTMLElement>(`[data-chip="${id}"] [data-avatar]`);
        const launch = busRef.current.launch;
        if (!avatar) return land();
        if (!launch) return waited < 3000 ? later(() => aim(waited + 250), 250) : land();
        const a = avatar.getBoundingClientRect();
        const r = root.getBoundingClientRect();
        launch(a.left + a.width / 2 - r.left, a.top + a.height / 2 - r.top, land);
      };
      requestAnimationFrame(() => requestAnimationFrame(() => aim(0)));
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.intersectionRatio > 0.3;
        if (visible && !inView) {
          inView = true;
          later(drop, 500);
          loop = setInterval(drop, EVERY);
        } else if (!visible && inView) {
          inView = false;
          clearInterval(loop);
        }
      },
      { threshold: [0, 0.3, 0.6] }
    );
    io.observe(root);

    return () => {
      io.disconnect();
      clearInterval(loop);
      timers.forEach(clearTimeout);
      setChips([]);
    };
  }, [slots]);

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0">
      <StarfallCanvas bus={busRef.current} light={theme === "light"} />

      {chips.map((chip) => {
        const slot = slots[chip.slot];
        const review = reviews[chip.review];
        if (!slot) return null;
        const place: React.CSSProperties =
          slot.align === "left"
            ? { left: slot.x, top: slot.y }
            : slot.align === "right"
              ? { right: slot.x, top: slot.y }
              : { left: slot.x, top: slot.y, transform: "translateX(-50%)" };
        return (
          <div
            key={chip.id}
            data-chip={chip.id}
            aria-hidden="true"
            style={{ ...place, maxWidth: slot.maxW }}
            className={`absolute flex w-max items-center gap-3 rounded-2xl border border-ink/10 bg-surface/75 py-2.5 pl-2.5 pr-4 shadow-[0_18px_50px_-20px_var(--shadow-deep),0_0_30px_-16px_rgba(0,208,156,0.55)] backdrop-blur-md transition-[opacity,scale,translate,filter] duration-500 ease-out ${
              chip.phase === "shown"
                ? "scale-100 opacity-100 blur-0"
                : chip.phase === "incoming"
                  ? "scale-95 opacity-0 blur-sm"
                  : "-translate-y-2 opacity-0"
            }`}
          >
            <span
              data-avatar=""
              className={`flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white ring-2 ring-ink/15 ${review.color} ${
                chip.phase === "shown" ? "land-flash" : ""
              }`}
            >
              {initials(review.name)}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium leading-5 text-ink">&ldquo;{review.quote}&rdquo;</span>
              <span className="mt-0.5 flex items-center gap-2 text-xs text-body">
                {review.name} · {review.role}
                <span className="tracking-[0.1em] text-primary" aria-hidden="true">
                  ★★★★★
                </span>
              </span>
            </span>
          </div>
        );
      })}

      <ul className="sr-only">
        {reviews.map((review) => (
          <li key={review.name}>
            &ldquo;{review.quote}&rdquo; {review.name}, {review.role}. Rated 5 out of 5.
          </li>
        ))}
      </ul>
    </div>
  );
}
