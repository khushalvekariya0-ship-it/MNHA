"use client";

import { useEffect, useRef, useState } from "react";
import { LogoMark } from "./Logo";
import CarouselControls, {
  useHoverPause,
  useInView,
  useSwipe,
} from "./CarouselControls";

const steps = [
  { title: "Portfolio", sub: "Track everything you own" },
  { title: "Mutual Funds", sub: "Pick from 1,000+ funds" },
  { title: "Invest", sub: "Start a SIP in one tap" },
];

const tabs = ["Home", "Portfolio", "Explore", "More"];
const tabForScreen = [0, 1, 2];

function Icon({ children, size = 13 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// rows of the active screen slide up one after another
function rowClass(on: boolean) {
  return `transition-all duration-500 ease-out ${
    on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
  }`;
}

function rowDelay(on: boolean, index: number) {
  return { transitionDelay: on ? `${120 + index * 70}ms` : "0ms" };
}

function TopBar({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-full bg-raised text-body">
          <Icon size={12}>
            <path d="M15 18l-6-6 6-6" />
          </Icon>
        </span>
        <span className="text-sm font-bold tracking-tight text-ink">{title}</span>
      </span>
      <span className="flex size-6 items-center justify-center rounded-full bg-raised text-body">
        <Icon size={12}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="M20 20l-4.2-4.2" />
        </Icon>
      </span>
    </div>
  );
}

/* ---------- screen 1: portfolio ---------- */

const holdings = [
  { name: "Mutual Funds", sub: "Build long-term wealth", value: "₹1,86,540", change: "+9.8%" },
  { name: "Stocks", sub: "Trade & grow", value: "₹42,310", change: "+12.4%" },
  { name: "IPOs", sub: "Get in early", value: "₹12,000", change: "+4.1%" },
  { name: "ETFs", sub: "Diversify with ease", value: "₹7,470", change: "+8.4%" },
];

const chart =
  "M0 58 L18 52 L34 55 L52 44 L70 47 L88 36 L106 40 L124 28 L142 31 L160 20 L178 24 L196 12 L210 8";

function PortfolioScreen({ on }: { on: boolean }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <LogoMark size={22} />
          <span className="text-sm font-bold tracking-tight text-ink">MNHA</span>
        </span>
        <span className="flex size-7 items-center justify-center rounded-full bg-raised text-body">
          <Icon>
            <path d="M12 4a6 6 0 016 6c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6a6 6 0 016-6zm-2 15a2 2 0 004 0" />
          </Icon>
        </span>
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-gradient-to-b from-primary/15 to-transparent p-3.5">
        <p className="text-[10px] font-medium text-body">Total Portfolio Value</p>
        <p className="mt-0.5 text-xl font-bold tracking-tight text-ink">₹2,48,320</p>
        <p className="text-[10px] font-semibold text-primary">▲ +12.5% (1M)</p>
        <svg viewBox="0 0 210 64" className="mt-2 w-full" aria-hidden="true">
          <defs>
            <linearGradient id="mission-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00d09c" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00d09c" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${chart} L210 64 L0 64 Z`} fill="url(#mission-fill)" />
          <path
            d={chart}
            fill="none"
            stroke="#4df3c9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="draw-line"
          />
        </svg>
      </div>

      <div className="mt-3 space-y-1.5">
        {holdings.map((h, i) => (
          <div
            key={h.name}
            className={`flex items-center gap-2.5 rounded-xl bg-raised px-2.5 py-2 ${rowClass(on)}`}
            style={rowDelay(on, i)}
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Icon>
                <path d="M3 17l5-5 4 4 8-8m0 0h-5m5 0v5" />
              </Icon>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-semibold text-ink">{h.name}</span>
              <span className="block text-[9px] text-muted">{h.sub}</span>
            </span>
            <span className="text-right">
              <span className="block text-[10px] font-semibold text-ink">{h.value}</span>
              <span className="block text-[9px] font-bold text-primary">{h.change}</span>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------- screen 2: mutual funds ---------- */

const funds = [
  { initials: "BG", name: "Bluechip Growth", meta: "Large cap · ★4.5", ret: "+16.2%", color: "bg-primary/20 text-primary" },
  { initials: "NI", name: "Nifty 50 Index", meta: "Index · ★4.0", ret: "+14.1%", color: "bg-accent/20 text-accent" },
  { initials: "MO", name: "Midcap Opps", meta: "Mid cap · ★4.5", ret: "+22.8%", color: "bg-amber-500/20 text-amber-400" },
  { initials: "FC", name: "Flexi Cap", meta: "Flexi cap · ★4.0", ret: "+18.6%", color: "bg-violet-500/20 text-violet-300" },
];

function FundsScreen({ on }: { on: boolean }) {
  return (
    <>
      <TopBar title="Mutual Funds" />

      <div className="mt-4 rounded-2xl border border-line bg-gradient-to-b from-accent/15 to-transparent p-3.5">
        <p className="text-[10px] font-medium text-body">Current value</p>
        <p className="mt-0.5 text-xl font-bold tracking-tight text-ink">₹1,86,540</p>
        <div className="mt-2.5 grid grid-cols-3 gap-1.5">
          {[
            { k: "Invested", v: "₹1.52L", tone: "text-ink" },
            { k: "Returns", v: "+₹34.5K", tone: "text-primary" },
            { k: "XIRR", v: "18.4%", tone: "text-primary" },
          ].map((s) => (
            <div key={s.k} className="rounded-lg bg-raised px-1.5 py-1.5">
              <p className="text-[8px] text-muted">{s.k}</p>
              <p className={`whitespace-nowrap text-[10px] font-bold tracking-tight ${s.tone}`}>
                {s.v}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex gap-1.5">
        {["All", "Equity", "Debt", "Hybrid"].map((chip, i) => (
          <span
            key={chip}
            className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${
              i === 0 ? "bg-primary text-[#03140e]" : "bg-raised text-body"
            }`}
          >
            {chip}
          </span>
        ))}
      </div>

      <div className="mt-3 space-y-1.5">
        {funds.map((fund, i) => (
          <div
            key={fund.name}
            className={`flex items-center gap-2.5 rounded-xl bg-raised px-2.5 py-2 ${rowClass(on)}`}
            style={rowDelay(on, i)}
          >
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-[9px] font-black ${fund.color}`}
            >
              {fund.initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[11px] font-semibold text-ink">{fund.name}</span>
              <span className="block text-[9px] text-muted">{fund.meta}</span>
            </span>
            <span className="text-right">
              <span className="block text-[10px] font-bold text-primary">{fund.ret}</span>
              <span className="block text-[8px] text-muted">3Y</span>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------- screen 3: invest ---------- */

function InvestScreen({ on }: { on: boolean }) {
  return (
    <>
      <TopBar title="Invest" />

      <div
        className={`mt-4 flex items-center gap-2.5 ${rowClass(on)}`}
        style={rowDelay(on, 0)}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-[10px] font-black text-primary">
          BG
        </span>
        <span>
          <span className="block text-xs font-bold text-ink">Bluechip Growth Fund</span>
          <span className="block text-[9px] text-muted">Direct · Growth · ★4.5</span>
        </span>
      </div>

      <div
        className={`mt-3 grid grid-cols-2 gap-1 rounded-full bg-raised p-1 text-center text-[10px] font-semibold ${rowClass(on)}`}
        style={rowDelay(on, 1)}
      >
        <span className="rounded-full bg-primary py-1.5 text-[#03140e]">Monthly SIP</span>
        <span className="py-1.5 text-body">One-time</span>
      </div>

      <div
        className={`mt-4 text-center ${rowClass(on)}`}
        style={rowDelay(on, 2)}
      >
        <p className="text-[10px] font-medium text-body">Monthly amount</p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-ink">
          ₹5,000
          <span className="ml-0.5 inline-block h-6 w-0.5 translate-y-0.5 animate-pulse bg-primary" />
        </p>
        <div className="mx-auto mt-2 h-px w-32 bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>

      <div
        className={`mt-3 flex justify-center gap-1.5 ${rowClass(on)}`}
        style={rowDelay(on, 3)}
      >
        {["+₹500", "+₹1,000", "+₹5,000"].map((chip) => (
          <span
            key={chip}
            className="rounded-full border border-line-strong px-2.5 py-1 text-[9px] font-semibold text-ink"
          >
            {chip}
          </span>
        ))}
      </div>

      <div
        className={`mt-3 space-y-1.5 ${rowClass(on)}`}
        style={rowDelay(on, 4)}
      >
        <div className="flex items-center justify-between rounded-xl bg-raised px-3 py-2">
          <span className="text-[10px] text-body">SIP date</span>
          <span className="text-[10px] font-semibold text-ink">5th of every month</span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-raised px-3 py-2">
          <span className="text-[10px] text-body">Est. value in 10Y</span>
          <span className="text-[10px] font-bold text-primary">₹11.6L</span>
        </div>
      </div>

      <div className={rowClass(on)} style={rowDelay(on, 5)}>
        <span className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-bold text-[#03140e] shadow-[0_0_20px_-4px_rgba(0,208,156,0.8)]">
          Start SIP
          <Icon size={12}>
            <path d="M5 12h14m-6-6l6 6-6 6" />
          </Icon>
        </span>
        <p className="mt-1.5 text-center text-[8px] text-muted">
          0% commission · Cancel anytime
        </p>
      </div>
    </>
  );
}

const screens = [PortfolioScreen, FundsScreen, InvestScreen];

/* ---------- card ---------- */

export default function MissionCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const lastZone = useRef(-1);
  const [active, setActive] = useState(0);
  const hoverPause = useHoverPause();
  const inView = useInView(phoneRef);

  const go = (i: number) => setActive((i + steps.length) % steps.length);
  const swipe = useSwipe(
    () => go(active - 1),
    () => go(active + 1)
  );

  // desktop: the phone also follows the scroll while the card crosses the
  // viewport (mobile relies on autoplay, arrows and swipe instead)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = cardRef.current;
      if (!el || !mq.matches) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(
        Math.max((vh * 0.8 - rect.top) / (rect.height + vh * 0.6), 0),
        0.999
      );
      const zone = Math.floor(progress * steps.length);
      if (zone !== lastZone.current) {
        lastZone.current = zone;
        setActive(zone);
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

  const paused = !inView || hoverPause.paused || swipe.touching;

  return (
    <div
      ref={cardRef}
      {...hoverPause.handlers}
      className="card group relative overflow-hidden rounded-3xl p-7 sm:p-8 md:col-span-2 lg:row-span-2"
    >
      <div className="grid grid-cols-1 items-center gap-8 sm:grid-cols-[1fr_auto]">
        <div>
          <p className="eyebrow">Our Mission</p>
          <h3 className="mt-5 text-2xl font-bold leading-snug tracking-tight text-ink sm:text-3xl lg:text-2xl xl:text-[1.7rem]">
            Investing should feel <span className="shimmer-text">simple</span>,
            clear &amp; confident.
          </h3>
          <p className="mt-3 text-sm leading-6">
            One simple platform to understand, start and manage your
            investments.
          </p>

          <ol className="mt-7 space-y-2">
            {steps.map((step, i) => {
              const isActive = i === active;
              return (
                <li key={step.title}>
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-current={isActive ? "step" : undefined}
                    className={`relative flex w-full items-center gap-3 overflow-hidden rounded-xl border px-3.5 py-2.5 text-left transition-all duration-300 ${
                      isActive
                        ? "border-primary/50 bg-primary/10 shadow-[0_0_24px_-8px_rgba(0,208,156,0.6)]"
                        : "border-line hover:border-line-strong hover:bg-ink/[0.03]"
                    }`}
                  >
                    <span
                      className={`text-xs font-black tabular-nums transition-colors duration-300 ${
                        isActive ? "text-primary" : "text-muted"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={`block text-sm font-semibold transition-colors duration-300 ${
                          isActive ? "text-ink" : "text-body"
                        }`}
                      >
                        {step.title}
                      </span>
                      <span className="block text-[11px] text-muted">{step.sub}</span>
                    </span>
                    {isActive && (
                      <span
                        className="ml-auto size-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_8px_#00d09c]"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {/* phone + controls */}
        <div className="mx-auto shrink-0">
        <div
          ref={phoneRef}
          {...swipe.handlers}
          className="w-[250px] touch-pan-y rounded-[2.4rem] border border-white/15 bg-[#06080c] p-2 shadow-[0_40px_80px_-24px_var(--shadow-deep),0_0_90px_-30px_rgba(0,208,156,0.55)] transition-transform duration-700 group-hover:-translate-y-1.5"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-line bg-surface">
            <div className="flex items-center justify-between px-5 pt-3 text-[10px] font-semibold text-ink">
              <span>9:41</span>
              <span className="h-4 w-16 rounded-full bg-black ring-1 ring-ink/5" />
              <span className="flex gap-0.5" aria-hidden="true">
                <span className="h-2 w-0.5 rounded bg-ink/70" />
                <span className="h-2.5 w-0.5 rounded bg-ink/80" />
                <span className="h-3 w-0.5 rounded bg-ink" />
              </span>
            </div>

            <div className="relative h-[410px]">
              {screens.map((Screen, i) => {
                const on = i === active;
                return (
                  <div
                    key={i}
                    aria-hidden={!on}
                    className={`absolute inset-0 px-4 pb-3 pt-4 transition-all duration-500 ease-out motion-reduce:transition-none ${
                      on
                        ? "translate-x-0 opacity-100"
                        : i < active
                          ? "pointer-events-none -translate-x-8 opacity-0"
                          : "pointer-events-none translate-x-8 opacity-0"
                    }`}
                  >
                    <Screen on={on} />
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-around border-t border-line px-2 py-2.5 text-[9px] font-semibold">
              {tabs.map((tab, i) => {
                const tabActive = i === tabForScreen[active];
                return (
                  <span
                    key={tab}
                    className={`flex flex-col items-center gap-1 transition-colors duration-300 ${
                      tabActive ? "text-primary" : "text-muted"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full transition-all duration-300 ${
                        tabActive ? "bg-primary shadow-[0_0_6px_#00d09c]" : "bg-line-strong"
                      }`}
                    />
                    {tab}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <CarouselControls
            count={steps.length}
            index={active}
            onChange={go}
            paused={paused}
            labels={steps.map((s) => s.title)}
          />
        </div>
        </div>
      </div>
    </div>
  );
}
