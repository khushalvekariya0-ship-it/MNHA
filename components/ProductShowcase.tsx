"use client";

import { useEffect, useRef, useState } from "react";
import CarouselControls, {
  useHoverPause,
  useInView,
  useSwipe,
} from "./CarouselControls";

type Product = {
  name: string;
  tagline: string;
  value: string;
  change: string;
  accent: string;
  chips: { label: string; detail: string }[];
  points: number[];
};

const products: Product[] = [
  {
    name: "Stocks",
    tagline: "Trade 5,000+ listed companies with live prices and fast orders.",
    value: "₹2,48,320",
    change: "+12.5%",
    accent: "#00d09c",
    chips: [
      { label: "RELIANCE", detail: "+1.24%" },
      { label: "TCS", detail: "+0.98%" },
      { label: "INFY", detail: "+1.60%" },
    ],
    points: [22, 30, 26, 38, 34, 46, 42, 56, 52, 66],
  },
  {
    name: "Mutual Funds",
    tagline: "Zero-commission direct plans with SIPs from just ₹100.",
    value: "₹1,86,540",
    change: "+9.8%",
    accent: "#7c8cff",
    chips: [
      { label: "Bluechip Growth", detail: "₹5,000 SIP" },
      { label: "Nifty 50 Index", detail: "₹3,000 SIP" },
      { label: "Midcap Opps", detail: "₹2,000 SIP" },
    ],
    points: [20, 26, 30, 28, 36, 40, 44, 42, 52, 60],
  },
  {
    name: "Gold",
    tagline: "Digital gold from ₹10 — build beyond the markets.",
    value: "₹84,210",
    change: "+6.2%",
    accent: "#f5a524",
    chips: [
      { label: "Digital Gold", detail: "4.2g" },
      { label: "Gold ETF", detail: "12 units" },
      { label: "Auto-buy", detail: "₹500/mo" },
    ],
    points: [30, 32, 30, 36, 34, 40, 38, 44, 46, 50],
  },
  {
    name: "ETFs",
    tagline: "Diversify simply with index and sector ETFs.",
    value: "₹1,12,480",
    change: "+8.4%",
    accent: "#b18cff",
    chips: [
      { label: "Nifty ETF", detail: "+0.86%" },
      { label: "Bank ETF", detail: "+0.54%" },
      { label: "IT ETF", detail: "+1.12%" },
    ],
    points: [24, 28, 34, 30, 40, 38, 46, 50, 48, 58],
  },
];

const CW = 220;
const CH = 90;

function chartPath(points: number[]) {
  const max = 70;
  const step = CW / (points.length - 1);
  return points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)} ${(CH - (p / max) * CH).toFixed(1)}`
    )
    .join(" ");
}

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const lastZone = useRef(-1);
  const [index, setIndex] = useState(0);
  const hoverPause = useHoverPause();
  const inView = useInView(phoneRef);

  const go = (i: number) => setIndex((i + products.length) % products.length);
  const swipe = useSwipe(
    () => go(index - 1),
    () => go(index + 1)
  );

  // desktop: the pinned section also follows the scroll position
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = sectionRef.current;
      if (!el || !mq.matches) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const progress = Math.min(Math.max(-rect.top / total, 0), 0.999);
      const zone = Math.floor(progress * products.length);
      if (zone !== lastZone.current) {
        lastZone.current = zone;
        setIndex(zone);
      }
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

  const current = products[index];
  const paused = !inView || hoverPause.paused || swipe.touching;

  return (
    <section ref={sectionRef} className="relative lg:h-[320vh]">
      <div className="relative overflow-hidden py-24 lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:py-0">
        {/* accent glow follows the active product */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 size-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl transition-colors duration-700"
          style={{ backgroundColor: current.accent }}
          aria-hidden="true"
        />
        <div
          className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]"
          aria-hidden="true"
        />

        <div
          className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-14 lg:px-8"
          {...hoverPause.handlers}
        >
          {/* left: heading + product picker */}
          <div className="min-w-0 text-center lg:text-left">
            <p className="eyebrow">See MNHA in action</p>
            <h2 className="text-gradient mt-4 text-3xl font-bold leading-tight tracking-[-0.03em] sm:text-4xl">
              Scroll — the app keeps up.
            </h2>
            <ul className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:block lg:space-y-1.5 lg:overflow-visible lg:px-0">
              {products.map((product, i) => {
                const active = i === index;
                return (
                  <li key={product.name} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => go(i)}
                      aria-current={active ? "true" : undefined}
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left transition-all duration-300 lg:py-3 ${
                        active
                          ? "border-line-strong bg-white/[0.06]"
                          : "border-line lg:border-transparent lg:opacity-45 lg:hover:opacity-80"
                      }`}
                    >
                      <span
                        className="size-2 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: active ? product.accent : "#2b3546",
                          boxShadow: active ? `0 0 10px ${product.accent}` : undefined,
                        }}
                        aria-hidden="true"
                      />
                      <span
                        className={`whitespace-nowrap text-sm font-semibold lg:text-base ${
                          active ? "text-ink" : "text-body"
                        }`}
                      >
                        {product.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* center: phone + controls */}
          <div className="mx-auto">
            <div
              ref={phoneRef}
              {...swipe.handlers}
              className="relative mx-auto h-[480px] w-[250px] touch-pan-y rounded-[2.4rem] border border-white/15 bg-[#06080c] p-2 transition-shadow duration-700 sm:h-[520px] sm:w-[270px]"
              style={{
                boxShadow: `0 40px 80px -24px rgba(0,0,0,0.9), 0 0 90px -20px ${current.accent}`,
              }}
            >
              <div className="relative h-full overflow-hidden rounded-[2rem] border border-line bg-surface">
                <div
                  className="absolute left-1/2 top-2.5 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-black"
                  aria-hidden="true"
                />

                {products.map((product, i) => {
                  const on = i === index;
                  return (
                    <div
                      key={product.name}
                      className={`absolute inset-0 flex flex-col p-5 pt-10 transition-all duration-500 ease-out motion-reduce:transition-none ${
                        on
                          ? "translate-x-0 opacity-100"
                          : i < index
                            ? "pointer-events-none -translate-x-10 opacity-0"
                            : "pointer-events-none translate-x-10 opacity-0"
                      }`}
                      aria-hidden={!on}
                    >
                      <span
                        className="inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold"
                        style={{ backgroundColor: `${product.accent}22`, color: product.accent }}
                      >
                        {product.name}
                      </span>
                      <p className="mt-4 text-xs font-medium text-muted">Portfolio Value</p>
                      <p className="mt-0.5 text-2xl font-bold tracking-tight text-ink">
                        {product.value}
                      </p>
                      <span
                        className="mt-1 w-fit rounded-full px-2 py-0.5 text-xs font-semibold"
                        style={{ backgroundColor: `${product.accent}22`, color: product.accent }}
                      >
                        ▲ {product.change}
                      </span>

                      <svg viewBox={`0 0 ${CW} ${CH}`} className="mt-4 w-full" aria-hidden="true">
                        <defs>
                          <linearGradient id={`ps-fill-${i}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={product.accent} stopOpacity="0.4" />
                            <stop offset="100%" stopColor={product.accent} stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          d={`${chartPath(product.points)} L${CW} ${CH} L0 ${CH} Z`}
                          fill={`url(#ps-fill-${i})`}
                        />
                        <path
                          d={chartPath(product.points)}
                          fill="none"
                          stroke={product.accent}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <div className="mt-4 space-y-2">
                        {product.chips.map((chip, c) => (
                          <div
                            key={chip.label}
                            className={`flex items-center justify-between rounded-xl bg-raised px-3.5 py-2.5 transition-all duration-500 ease-out ${
                              on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                            }`}
                            style={{ transitionDelay: on ? `${150 + c * 80}ms` : "0ms" }}
                          >
                            <span className="text-xs font-semibold text-ink">{chip.label}</span>
                            <span className="text-xs font-bold" style={{ color: product.accent }}>
                              {chip.detail}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <CarouselControls
                count={products.length}
                index={index}
                onChange={go}
                paused={paused}
                accent={current.accent}
                labels={products.map((p) => p.name)}
              />
            </div>

            <p
              key={`m-${current.name}`}
              className="mx-auto mt-4 max-w-xs animate-[word-in_0.5s_cubic-bezier(0.22,1,0.36,1)_both] text-center text-sm leading-6 lg:hidden"
            >
              {current.tagline}
            </p>
          </div>

          {/* right: changing description (desktop) */}
          <div className="hidden lg:block">
            <div
              key={current.name}
              className="animate-[word-in_0.5s_cubic-bezier(0.22,1,0.36,1)_both]"
            >
              <p
                className="text-7xl font-black tracking-tight opacity-25"
                style={{ color: current.accent }}
              >
                0{index + 1}
              </p>
              <h3 className="mt-2 text-2xl font-bold text-ink">{current.name}</h3>
              <p className="mt-3 max-w-xs text-base leading-7">{current.tagline}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
