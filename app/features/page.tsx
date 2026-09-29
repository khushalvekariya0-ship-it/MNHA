import type { Metadata } from "next";
import { ComingSoon, LaunchNote } from "@/components/ComingSoon";
import ProductTabs from "@/components/ProductTabs";
import ProductShowcase from "@/components/ProductShowcase";
import DashboardMockup from "@/components/DashboardMockup";
import SplitWords from "@/components/SplitWords";
import CTA from "@/components/home/CTA";
import ParticleOrbLazy from "@/components/three/ParticleOrbLazy";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Everything you need to invest smarter — one dashboard for all your investments, live product views, smart SIPs and premium tools, all in one place.",
};

/* ---------- demo data ---------- */

const heroPoints = [
  {
    title: "Easy to use",
    detail: "Simple. Fast. Smooth.",
    icon: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />,
  },
  {
    title: "Secure & trusted",
    detail: "Your data, our priority.",
    icon: <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />,
  },
  {
    title: "All in one place",
    detail: "Invest. Track. Grow.",
    icon: (
      <>
        <path d="M12 3l9 5-9 5-9-5 9-5z" />
        <path d="M3 13l9 5 9-5" />
        <path d="M3 17.5l9 5 9-5" />
      </>
    ),
  },
];

const glanceRows = [
  {
    title: "Live portfolio value",
    detail: "Day and overall returns, updated in real time",
    icon: <path d="M3 12h4l3-8 4 16 3-8h4" />,
  },
  {
    title: "Every asset, one view",
    detail: "Stocks, funds, gold, ETFs and FDs together",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
  },
  {
    title: "One-tap import",
    detail: "Bring in the mutual funds you already hold",
    icon: (
      <>
        <path d="M12 3v12m0 0l-4-4m4 4l4-4" />
        <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
      </>
    ),
  },
];

// portfolio area chart (values in lakhs)
const pfValues = [
  12.1, 12.8, 12.5, 13.6, 14.2, 13.9, 15.1, 15.8, 16.6, 16.2, 17.8, 18.9,
  19.6, 21.4, 23.2,
];
const pfMonths = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
const CW = 460;
const CH = 180;
const CP = { l: 4, r: 18, t: 30, b: 24 };
const cPlotW = CW - CP.l - CP.r;
const cPlotH = CH - CP.t - CP.b;
const cMin = 9;
const cMax = 24;
const cx = (i: number) => CP.l + (i / (pfValues.length - 1)) * cPlotW;
const cy = (v: number) => CP.t + (1 - (v - cMin) / (cMax - cMin)) * cPlotH;
const pfLine = pfValues
  .map((v, i) => `${i === 0 ? "M" : "L"}${cx(i).toFixed(1)} ${cy(v).toFixed(1)}`)
  .join(" ");
const pfBase = (CP.t + cPlotH).toFixed(1);
const pfArea = `${pfLine} L${cx(pfValues.length - 1).toFixed(1)} ${pfBase} L${CP.l} ${pfBase} Z`;
const pfEnd = { x: cx(pfValues.length - 1), y: cy(pfValues[pfValues.length - 1]) };

// validated dark-mode categorical palette (legend labels give secondary encoding)
const allocation = [
  { name: "Stocks", pct: 45, value: "₹10,12,000", color: "#00a47a" },
  { name: "Mutual Funds", pct: 30, value: "₹6,72,000", color: "#6b7bff" },
  { name: "Gold", pct: 15, value: "₹3,36,000", color: "#c67c0e" },
  { name: "FDs", pct: 10, value: "₹2,24,000", color: "#9670ea" },
];
const DR = 58;
const DC = 2 * Math.PI * DR;
const DGAP = 3;

const sips = [
  { name: "Bluechip Growth Fund", detail: "₹5,000 · 5th monthly", progress: 72 },
  { name: "Index Fund – Nifty 50", detail: "₹3,000 · 10th monthly", progress: 48 },
  { name: "Midcap Opportunities", detail: "₹2,000 · 15th monthly", progress: 30 },
];

const sipPerks = [
  {
    title: "Auto-invest",
    detail: "On your date",
    icon: (
      <>
        <path d="M17 2l4 4-4 4" />
        <path d="M3 11V9a3 3 0 013-3h15" />
        <path d="M7 22l-4-4 4-4" />
        <path d="M21 13v2a3 3 0 01-3 3H3" />
      </>
    ),
  },
  {
    title: "Step-up",
    detail: "Grow it yearly",
    icon: (
      <>
        <path d="M3 17l6-6 4 4 8-8" />
        <path d="M14 7h7v7" />
      </>
    ),
  },
  {
    title: "Pause",
    detail: "Anytime, free",
    icon: (
      <>
        <rect x="6" y="5" width="4" height="14" rx="1" />
        <rect x="14" y="5" width="4" height="14" rx="1" />
      </>
    ),
  },
];

/* ---------- small building blocks ---------- */

function Icon({ children, size = 22 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/* ---------- page ---------- */

export default function FeaturesPage() {
  let donutAcc = 0;

  return (
    <>
      {/* 1. Hero — copy + 3D ring + live dashboard */}
      <section className="relative isolate overflow-hidden">
        <div
          className="bg-grid pointer-events-none absolute inset-0 -z-20 [mask-image:radial-gradient(ellipse_70%_60%_at_60%_40%,black,transparent)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-24 top-10 -z-20 size-[560px] rounded-full bg-primary/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-24 pt-36 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:pb-32 lg:pt-44">
          <div>
            <p
              className="hero-fade eyebrow gap-4 before:h-0.5 before:w-9 before:rounded-full before:shadow-none"
              style={{ "--d": "0s" } as React.CSSProperties}
            >
              Features
            </p>
            <h1 className="mt-7 text-5xl font-bold leading-[1.08] tracking-[-0.04em] lg:text-[3.25rem]">
              <SplitWords text="Everything you need to" trigger="load" baseDelay={100} />
              <br />
              <SplitWords
                text="invest smarter."
                accent={["invest", "smarter"]}
                accentClassName="text-[#2ee6b5] light:text-primary"
                trigger="load"
                baseDelay={320}
              />
            </h1>
            <p
              className="hero-fade mt-6 max-w-md text-lg leading-8"
              style={{ "--d": "0.55s" } as React.CSSProperties}
            >
              One simple platform to track, invest, automate and grow your
              wealth.
            </p>
            <ul
              className="hero-fade mt-9 grid gap-4 sm:flex sm:flex-wrap sm:gap-x-5 sm:gap-y-5"
              style={{ "--d": "0.7s" } as React.CSSProperties}
            >
              {heroPoints.map((point) => (
                <li key={point.title} className="flex items-center gap-2.5 whitespace-nowrap">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Icon size={18}>{point.icon}</Icon>
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{point.title}</span>
                    <span className="mt-0.5 block text-xs">{point.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div
              className="hero-fade mt-10 flex flex-wrap items-center gap-x-10 gap-y-4"
              style={{ "--d": "0.85s" } as React.CSSProperties}
            >
              <ComingSoon className="px-8 py-4 text-base" />
              <a
                href="#explore"
                className="border-b-2 border-primary pb-1 text-base font-semibold text-ink transition-colors hover:text-primary"
              >
                Explore Features
              </a>
            </div>
            <LaunchNote
              className="hero-fade mt-5"
              style={{ "--d": "1s" } as React.CSSProperties}
            />
          </div>

          <div
            className="hero-fade relative"
            style={{ "--d": "0.3s" } as React.CSSProperties}
          >
            <div className="absolute -inset-16 -z-10 hidden opacity-90 lg:block" aria-hidden="true">
              <ParticleOrbLazy variant="ring" />
            </div>
            <div data-animate="zoom" data-tilt="0.5" className="rounded-3xl">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Product tabs — accent colour follows the product */}
      <div id="explore" className="scroll-mt-20">
        <ProductTabs />
      </div>

      {/* 3. Dashboard — your wealth at a glance */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div
          className="pointer-events-none absolute -right-32 top-1/4 size-[460px] rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <div data-animate="left">
            <p className="eyebrow">All in one place</p>
            <h2 className="mt-5 text-4xl font-bold leading-tight tracking-[-0.03em] sm:text-5xl">
              <SplitWords text="Your wealth, at a glance." accent={["glance"]} />
            </h2>
            <p className="mt-5 max-w-md text-base leading-7">
              Every investment you own, tracked live in one calm view. No more
              juggling five different apps.
            </p>
            <ul
              data-animate-stagger=""
              className="mt-9 max-w-md divide-y divide-line border-y border-line"
            >
              {glanceRows.map((row) => (
                <li key={row.title} className="flex items-center gap-4 py-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/25 text-primary">
                    <Icon size={17}>{row.icon}</Icon>
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{row.title}</span>
                    <span className="mt-0.5 block text-xs text-muted">{row.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div
            data-animate="right"
            className="card rounded-3xl p-7 shadow-[0_40px_100px_-50px_rgba(0,208,156,0.45)] sm:p-9"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Total portfolio value
              </p>
              <div className="hidden rounded-full border border-line p-0.5 sm:flex" aria-hidden="true">
                {["1M", "6M", "1Y", "ALL"].map((range) => (
                  <span
                    key={range}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      range === "1Y" ? "bg-ink/[0.08] text-ink" : "text-muted"
                    }`}
                  >
                    {range}
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-3 flex items-baseline gap-3">
              <span data-countup="" className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
                ₹23,23,391
              </span>
              <span className="text-sm font-semibold text-primary">▲ 21.2%</span>
            </p>

            <dl className="mt-7 grid grid-cols-3 divide-x divide-line border-y border-line">
              {[
                { label: "Invested", value: "₹12.0L", tone: "text-ink" },
                { label: "Returns", value: "+₹11.2L", tone: "text-primary" },
                { label: "Today", value: "+₹12,450", tone: "text-primary" },
              ].map((stat, i) => (
                <div key={stat.label} className={`py-4 ${i === 0 ? "pr-4" : i === 1 ? "px-4" : "pl-4"}`}>
                  <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                    {stat.label}
                  </dt>
                  <dd className={`mt-1.5 text-base font-bold tabular-nums sm:text-lg ${stat.tone}`}>
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="sweep-in mt-4">
              <svg
                viewBox={`0 0 ${CW} ${CH}`}
                className="w-full overflow-visible"
                role="img"
                aria-label="Portfolio value growing from about 12 lakh in April to 23 lakh in November"
              >
                <defs>
                  <linearGradient id="pf-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00d09c" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#00d09c" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0.33, 0.66].map((f) => (
                  <line
                    key={f}
                    x1={CP.l}
                    x2={CW - CP.r}
                    y1={CP.t + cPlotH * f}
                    y2={CP.t + cPlotH * f}
                    stroke="var(--color-line)"
                    strokeDasharray="3 5"
                  />
                ))}
                <line x1={CP.l} x2={CW - CP.r} y1={pfBase} y2={pfBase} stroke="var(--color-line)" />
                {pfMonths.map((month, i) => (
                  <text
                    key={month}
                    x={cx(i * 2)}
                    y={CH - 5}
                    textAnchor={i === 0 ? "start" : "middle"}
                    fontSize="10"
                    fill="var(--color-muted)"
                  >
                    {month}
                  </text>
                ))}
                <path d={pfArea} fill="url(#pf-fill)" />
                <path
                  d={pfLine}
                  fill="none"
                  stroke="#4df3c9"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <g className="fade-late">
                  <line x1={pfEnd.x} x2={pfEnd.x} y1={pfEnd.y} y2={pfBase} stroke="var(--color-line-strong)" strokeDasharray="3 4" />
                  <circle className="ping" cx={pfEnd.x} cy={pfEnd.y} r="6" fill="none" stroke="#4df3c9" strokeWidth="1.5" />
                  <circle cx={pfEnd.x} cy={pfEnd.y} r="4" fill="#d7fff3" stroke="#00d09c" strokeWidth="2" />
                  <g transform={`translate(${(pfEnd.x - 80).toFixed(1)} ${(pfEnd.y - 30).toFixed(1)})`}>
                    <rect width="66" height="24" rx="8" fill="var(--color-raised)" stroke="var(--color-line-strong)" />
                    <text x="33" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--color-ink)">
                      ₹23.2L
                    </text>
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Portfolio analytics — visual left, story right */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div
          className="pointer-events-none absolute -left-32 top-1/3 size-[460px] rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <div
            data-animate="left"
            className="card order-2 rounded-3xl p-7 shadow-[0_40px_100px_-50px_rgba(0,208,156,0.45)] sm:p-9 lg:order-1"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Asset allocation
              </p>
              <span className="rounded-full border border-primary/25 px-3 py-1 text-xs font-semibold text-primary">
                Well diversified
              </span>
            </div>

            <div className="mt-8 grid items-center gap-8 sm:grid-cols-[auto_1fr] sm:gap-10">
              <svg
                width="184"
                height="184"
                viewBox="0 0 160 160"
                role="img"
                aria-label="Portfolio allocation: stocks 45%, mutual funds 30%, gold 15%, FDs 10%"
                className="donut-in mx-auto shrink-0"
              >
                <circle cx="80" cy="80" r={DR} fill="none" stroke="var(--color-line)" strokeWidth="10" />
                <g transform="rotate(-90 80 80)">
                  {allocation.map((seg) => {
                    const dash = (seg.pct / 100) * DC - DGAP;
                    const start = (donutAcc / 100) * DC + DGAP / 2;
                    donutAcc += seg.pct;
                    return (
                      <circle
                        key={seg.name}
                        cx="80"
                        cy="80"
                        r={DR}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth="10"
                        strokeDasharray={`${dash} ${DC - dash}`}
                        strokeDashoffset={-start}
                      />
                    );
                  })}
                </g>
                <text x="80" y="80" textAnchor="middle" fontSize="19" fontWeight="700" fill="var(--color-ink)">
                  ₹22.4L
                </text>
                <text x="80" y="97" textAnchor="middle" fontSize="10" fontWeight="500" fill="var(--color-muted)">
                  Total value
                </text>
              </svg>

              <ul className="divide-y divide-line">
                {allocation.map((seg) => (
                  <li key={seg.name} className="flex items-center justify-between gap-4 py-3.5">
                    <span className="flex items-center gap-3 text-sm font-medium text-ink">
                      <span className="size-2 rounded-full" style={{ backgroundColor: seg.color }} aria-hidden="true" />
                      {seg.name}
                    </span>
                    <span className="flex items-baseline gap-4">
                      <span className="text-sm font-semibold text-ink tabular-nums">{seg.pct}%</span>
                      <span className="w-[5.5rem] text-right text-sm tabular-nums text-muted">{seg.value}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div data-animate="right" className="order-1 lg:order-2">
            <p className="eyebrow">Portfolio Analytics</p>
            <h2 className="mt-5 text-4xl font-bold leading-tight tracking-[-0.03em] sm:text-5xl">
              <SplitWords text="Your money, clearly organized." accent={["clearly"]} />
            </h2>
            <p className="mt-5 max-w-md text-base leading-7">
              See exactly how your wealth is spread across assets, and stay
              balanced as markets move.
            </p>
            <dl className="mt-9 grid max-w-sm grid-cols-2 gap-8 border-t border-line pt-7">
              <div>
                <dt className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Asset classes</dt>
                <dd className="mt-2 text-3xl font-bold tracking-tight text-ink">5+</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Sync</dt>
                <dd className="mt-2 text-3xl font-bold tracking-tight text-ink">Live</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* 5. Smart SIP — story left, visual right */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div
          className="pointer-events-none absolute -right-32 top-1/4 size-[460px] rounded-full bg-accent/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <div data-animate="left">
            <p className="eyebrow">Smart SIP</p>
            <h2 className="mt-5 text-4xl font-bold leading-tight tracking-[-0.03em] sm:text-5xl">
              <SplitWords text="SIPs that run themselves." accent={["themselves"]} />
            </h2>
            <p className="mt-5 max-w-md text-base leading-7">
              Set the amount and date once. MNHA invests on time, every month,
              and you stay in control.
            </p>
            <ul className="mt-9 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-7 sm:gap-6">
              {sipPerks.map((perk) => (
                <li key={perk.title}>
                  <span className="flex size-9 items-center justify-center rounded-lg border border-primary/25 text-primary">
                    <Icon size={17}>{perk.icon}</Icon>
                  </span>
                  <p className="mt-3 text-sm font-semibold text-ink">{perk.title}</p>
                  <p className="mt-0.5 text-xs text-muted">{perk.detail}</p>
                </li>
              ))}
            </ul>
          </div>

          <div
            data-animate="right"
            className="card rounded-3xl p-7 shadow-[0_40px_100px_-50px_rgba(107,123,255,0.45)] sm:p-9"
          >
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Next investment
                </p>
                <p className="mt-2 text-4xl font-bold tracking-tight text-ink">₹5,000</p>
                <p className="mt-1 text-sm">Bluechip Growth Fund · 5 Oct</p>
              </div>
              <svg width="72" height="72" viewBox="0 0 72 72" role="img" aria-label="4 days to go" className="shrink-0">
                <circle cx="36" cy="36" r="30" fill="none" stroke="var(--color-line)" strokeWidth="4" />
                <circle
                  cx="36"
                  cy="36"
                  r="30"
                  fill="none"
                  stroke="#00d09c"
                  strokeWidth="4"
                  strokeLinecap="round"
                  pathLength={1609}
                  transform="rotate(-90 36 36)"
                  className="draw-line"
                />
                <text x="36" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="var(--color-ink)">
                  4
                </text>
                <text x="36" y="49" textAnchor="middle" fontSize="8" fontWeight="500" fill="var(--color-muted)">
                  days
                </text>
              </svg>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Active SIPs</p>
              <p className="text-xs font-semibold text-body">3 running</p>
            </div>
            <ul className="mt-2 divide-y divide-line">
              {sips.map((sip) => (
                <li key={sip.name} className="py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{sip.name}</p>
                      <p className="mt-0.5 text-xs text-muted">{sip.detail}</p>
                    </div>
                    <span
                      className="flex h-5 w-9 shrink-0 items-center rounded-full bg-primary p-0.5"
                      aria-hidden="true"
                    >
                      <span className="ml-auto size-4 rounded-full bg-[#03140e]" />
                    </span>
                  </div>
                  <div className="mt-3 h-0.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
                    <div
                      className="connector-grow h-full rounded-full bg-primary"
                      style={{ width: `${sip.progress}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 6. See MNHA in action — sticky scroll storytelling */}
      <ProductShowcase />

      {/* 7. Final CTA */}
      <CTA
        title="Your wealth. One smarter platform."
        subtitle="Join thousands of investors who grow their money with MNHA — simply, safely and commission-free."
        accent={["smarter", "platform"]}
        backdrop="waves"
      />
    </>
  );
}
