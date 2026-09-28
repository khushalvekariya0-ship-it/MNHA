import type { Metadata } from "next";
import Link from "next/link";
import CTA from "@/components/home/CTA";
import Timeline from "@/components/Timeline";
import ProductShowcase from "@/components/ProductShowcase";
import ProductCards from "@/components/ProductCards";
import InvestorReviews from "@/components/InvestorReviews";
import SplitWords from "@/components/SplitWords";
import MissionCard from "@/components/MissionCard";
import ParticleOrbLazy from "@/components/three/ParticleOrbLazy";

export const metadata: Metadata = {
  title: "Info",
  description:
    "Learn about MNHA — investing made simple. One app for stocks, mutual funds, ETFs, gold and IPOs, built for every investor.",
};

const orbitLabels = [
  { label: "Stocks", pos: "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2" },
  { label: "Mutual Funds", pos: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2" },
  { label: "Gold", pos: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2" },
  { label: "ETFs", pos: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2" },
];

const bentoChart = [18, 24, 22, 30, 28, 38, 36, 46, 52, 62];
const BW = 220;
const BH = 80;
const bentoLine = bentoChart
  .map(
    (p, i) =>
      `${i === 0 ? "M" : "L"}${((i * BW) / (bentoChart.length - 1)).toFixed(1)} ${(BH - (p / 70) * BH).toFixed(1)}`
  )
  .join(" ");

const values = [
  {
    number: "01",
    title: "Transparency",
    line: "Nothing hidden.",
    icon: (
      <>
        <circle cx="12" cy="12" r="3.5" />
        <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      </>
    ),
  },
  {
    number: "02",
    title: "Simplicity",
    line: "Investing without complexity.",
    icon: <path d="M13 3L4 14h6l-1 7 9-11h-6l1-7z" />,
  },
  {
    number: "03",
    title: "Customer first",
    line: "Built around investors.",
    icon: (
      <path d="M12 20s-7-4.5-9-9c-1.5-3.5 1-7 4.5-7 2 0 3.5 1 4.5 2.5C13 5 14.5 4 16.5 4 20 4 22.5 7.5 21 11c-2 4.5-9 9-9 9z" />
    ),
  },
  {
    number: "04",
    title: "Long-term",
    line: "Made to grow with you.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 3.5" />
      </>
    ),
  },
];

const timeline = [
  {
    period: "2024",
    title: "MNHA launched",
    icon: (
      <>
        <path d="M15 4.5c2.4-.5 4.5-.5 4.5-.5s0 2.1-.5 4.5c-.4 2-1.6 4.3-3.5 6.2-1.4 1.4-3.1 2.4-4.8 3l-3.9-3.9c.6-1.7 1.6-3.4 3-4.8 1.9-1.9 4.2-3.1 5.2-3.5z" />
        <circle cx="14.5" cy="9.5" r="1.6" />
        <path d="M7 14.5c-1.5.5-2.5 2-3 4.5 2.5-.5 4-1.5 4.5-3" />
      </>
    ),
  },
  {
    period: "2025",
    title: "Stocks + IPOs introduced",
    icon: <path d="M3 17l5-5 4 4 8-8m0 0h-5m5 0v5" />,
  },
  {
    period: "2025",
    title: "₹250 Cr+ invested",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M9.5 8.5h5M9.5 11h2.8M9.5 8.5c2.8 0 2.8 4.2 0 4.2l4 3.8" />
      </>
    ),
  },
  {
    period: "2026",
    title: "10L+ investors",
    icon: (
      <>
        <circle cx="9" cy="8.5" r="3" />
        <path d="M3.5 19c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5" />
        <path d="M15.5 5.5a3 3 0 010 6M17.5 14.8c1.9.7 3 2.1 3.4 4.2" />
      </>
    ),
  },
];

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

export default function InfoPage() {
  return (
    <>
      {/* 1. Hero — centered copy, live 3D globe center stage */}
      <section className="relative isolate overflow-hidden">
        <div
          className="bg-grid pointer-events-none absolute inset-0 -z-20 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-1/2 top-[-10%] -z-20 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 pt-36 sm:px-6 lg:px-8 lg:pt-44">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mt-7 text-5xl font-bold leading-[1.04] tracking-[-0.045em] sm:text-7xl lg:text-8xl">
              <SplitWords
                text="Investing, made simple."
                accent={["simple"]}
                trigger="load"
                baseDelay={120}
              />
            </h1>
            <p
              className="hero-fade mx-auto mt-7 max-w-xl text-lg leading-8"
              style={{ "--d": "0.5s" } as React.CSSProperties}
            >
              Build your wealth with MNHA — stocks, mutual funds, gold and more,
              all in one place.
            </p>
            <div
              className="hero-fade mt-10 flex flex-wrap items-center justify-center gap-3"
              style={{ "--d": "0.65s" } as React.CSSProperties}
            >
              <Link
                href="/signup"
                data-magnetic=""
                className="btn-primary pulse-glow px-8 py-4 text-base"
              >
                Start Investing
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/try"
                data-magnetic=""
                className="btn-ghost px-8 py-4 text-base"
              >
                Explore MNHA
              </Link>
            </div>
          </div>

          {/* globe stage */}
          <div
            className="hero-fade relative mx-auto mt-6 h-[420px] w-full max-w-3xl sm:h-[560px]"
            style={{ "--d": "0.4s" } as React.CSSProperties}
          >
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 size-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl sm:size-[460px]"
              aria-hidden="true"
            />
            <ParticleOrbLazy variant="globe" />

            {/* orbiting product labels */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 hidden size-[520px] -translate-x-1/2 -translate-y-1/2 animate-[spin_50s_linear_infinite] rounded-full border border-dashed border-primary/15 sm:block"
              aria-hidden="true"
            >
              {orbitLabels.map((item) => (
                <span key={item.label} className={`absolute ${item.pos}`}>
                  <span className="glass inline-block animate-[spin_50s_linear_infinite_reverse] rounded-full px-3.5 py-1.5 text-[11px] font-bold text-primary shadow-[0_0_20px_-6px_rgba(0,208,156,0.7)]">
                    {item.label}
                  </span>
                </span>
              ))}
            </div>

            {/* floating data chips */}
            <div className="pointer-events-none absolute left-0 top-16 hidden lg:block">
              <div data-mouse-parallax="16">
                <div className="glass animate-float rounded-2xl px-4 py-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] [animation-duration:6s]">
                  <p className="text-[11px] text-muted">Invested via MNHA</p>
                  <p className="text-lg font-bold text-ink">₹500 Cr+</p>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute bottom-20 right-0 hidden lg:block">
              <div data-mouse-parallax="-16">
                <div className="glass animate-float rounded-2xl px-4 py-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] [animation-delay:1.4s] [animation-duration:7s]">
                  <p className="text-[11px] text-muted">Transactions today</p>
                  <p className="text-lg font-bold text-primary">+48,210</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Bento — mission + reasons */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div data-animate="">
          <p className="eyebrow">Why MNHA</p>
          <h2 className="mt-5 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
            <SplitWords text="Everything you need, in one place" accent={["one", "place"]} />
          </h2>
        </div>

        <div
          data-animate-stagger=""
          className="spot-group mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4"
        >
          {/* mission — phone moves through 3 screens as you scroll */}
          <MissionCard />

          {/* 0% commission — solid green */}
          <div className="card flex flex-col justify-between overflow-hidden rounded-3xl border-transparent bg-gradient-to-br from-primary-bright via-primary to-primary-dark p-7 text-[#03140e] hover:-translate-y-1">
            <span
              className="inline-flex size-11 items-center justify-center rounded-xl bg-[#03140e]/15"
              aria-hidden="true"
            >
              <Icon>
                <path d="M5 19L19 5M7.5 8.5a1 1 0 100-2 1 1 0 000 2zm9 9a1 1 0 100-2 1 1 0 000 2z" />
              </Icon>
            </span>
            <div className="mt-8">
              <p className="text-6xl font-black tracking-tight">0%</p>
              <p className="mt-1.5 text-sm font-semibold text-[#03140e]/75">
                Commission on mutual funds. Ever.
              </p>
            </div>
          </div>

          {/* growth chart card */}
          <div className="card rounded-3xl p-7 hover:-translate-y-1">
            <p data-countup="" className="text-gradient text-3xl font-bold tracking-tight">
              ₹500 Cr+
            </p>
            <p className="mt-1 text-sm font-medium">Invested through MNHA</p>
            <svg viewBox={`0 0 ${BW} ${BH}`} className="mt-5 w-full" aria-hidden="true">
              <defs>
                <linearGradient id="bento-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d09c" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00d09c" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`${bentoLine} L${BW} ${BH} L0 ${BH} Z`} fill="url(#bento-fill)" />
              <path
                d={bentoLine}
                fill="none"
                stroke="#4df3c9"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="draw-line"
              />
            </svg>
          </div>

          {/* security */}
          <div className="card group rounded-3xl p-7 hover:-translate-y-1">
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-bright to-primary-dark text-[#03140e] shadow-[0_0_24px_-6px_rgba(0,208,156,0.7)] transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
              <Icon>
                <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
                <path d="M9 12l2 2 4-4" />
              </Icon>
            </span>
            <h3 className="mt-5 text-lg font-bold text-ink">Bank-grade security</h3>
            <p className="mt-1 text-sm leading-6">
              256-bit encryption &amp; 2FA on every login.
            </p>
          </div>

          {/* support */}
          <div className="card group rounded-3xl p-7 hover:-translate-y-1">
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-bright to-primary-dark text-[#03140e] shadow-[0_0_24px_-6px_rgba(0,208,156,0.7)] transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
              <Icon>
                <path d="M4 13a8 8 0 0116 0" />
                <rect x="2.5" y="13" width="4" height="6" rx="1.5" />
                <rect x="17.5" y="13" width="4" height="6" rx="1.5" />
                <path d="M20 19v.5a2.5 2.5 0 01-2.5 2.5H14" />
              </Icon>
            </span>
            <h3 className="mt-5 text-lg font-bold text-ink">24×7 human support</h3>
            <p className="mt-1 text-sm leading-6">
              Real people on chat and phone, always.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Products */}
      <ProductCards />

      {/* 4. Product showcase — sticky scroll storytelling */}
      <ProductShowcase />

      {/* 5. Testimonials */}
      <InvestorReviews />

      {/* 6. Our Values */}
      <section className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div data-animate="">
          <p className="eyebrow">Our Values</p>
          <h2 className="mt-5 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
            <SplitWords text="What we stand for" accent={["stand"]} />
          </h2>
        </div>

        <div data-animate-stagger="" className="mt-14 border-t border-line">
          {values.map((value) => (
            <div
              key={value.number}
              className="group relative flex items-center gap-6 overflow-hidden border-b border-line px-2 py-8 transition-all duration-500 hover:pl-6"
            >
              <span
                className="absolute inset-y-0 left-0 w-0 bg-gradient-to-r from-primary/15 to-transparent transition-all duration-500 group-hover:w-full"
                aria-hidden="true"
              />
              <span className="relative w-14 shrink-0 text-4xl font-black text-line-strong transition-colors duration-500 group-hover:text-primary">
                {value.number}
              </span>
              <span className="relative inline-flex size-12 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-raised text-primary transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:border-primary group-hover:bg-primary group-hover:text-[#03140e] group-hover:shadow-[0_0_30px_-4px_rgba(0,208,156,0.8)]">
                <Icon>{value.icon}</Icon>
              </span>
              <h3 className="relative flex-1 text-xl font-bold text-ink sm:text-3xl">
                {value.title}
              </h3>
              <p className="relative hidden text-base transition-colors duration-500 group-hover:text-ink sm:block">
                {value.line}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Our Journey */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 size-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div data-animate="" className="text-center">
            <p className="eyebrow">Our Journey</p>
            <h2 className="mt-5 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
              <SplitWords text="The story so far" accent={["story"]} />
            </h2>
          </div>

          <Timeline items={timeline} />
        </div>
      </section>

      {/* 8. Final CTA */}
      <CTA />
    </>
  );
}
