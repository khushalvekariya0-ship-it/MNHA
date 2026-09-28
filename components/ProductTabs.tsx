"use client";

import { useState } from "react";

type TabProduct = {
  name: string;
  accent: string;
  soft: string;
  line: string;
  value: string;
  change: string;
  rows: { label: string; detail: string }[];
  points: number[];
};

const products: TabProduct[] = [
  {
    name: "Stocks",
    accent: "#00d09c",
    soft: "rgba(0, 208, 156, 0.12)",
    line: "Trade 5,000+ listed companies with live prices and fast orders.",
    value: "₹2,48,320",
    change: "+12.5%",
    rows: [
      { label: "RELIANCE", detail: "+1.24%" },
      { label: "TCS", detail: "+0.98%" },
      { label: "INFY", detail: "+1.60%" },
    ],
    points: [20, 30, 26, 38, 34, 48, 44, 58, 54, 68],
  },
  {
    name: "Mutual Funds",
    accent: "#7c8cff",
    soft: "rgba(124, 140, 255, 0.12)",
    line: "Zero-commission direct plans with SIPs starting at ₹100.",
    value: "₹1,86,540",
    change: "+9.8%",
    rows: [
      { label: "Bluechip Growth", detail: "₹5,000 SIP" },
      { label: "Nifty 50 Index", detail: "₹3,000 SIP" },
      { label: "Midcap Opps", detail: "₹2,000 SIP" },
    ],
    points: [22, 28, 32, 30, 38, 42, 46, 44, 54, 62],
  },
  {
    name: "Gold",
    accent: "#f5a524",
    soft: "rgba(245, 165, 36, 0.12)",
    line: "Digital gold from ₹10 — build beyond the markets.",
    value: "₹84,210",
    change: "+6.2%",
    rows: [
      { label: "Digital Gold", detail: "4.2g" },
      { label: "Gold ETF", detail: "12 units" },
      { label: "Auto-buy", detail: "₹500/mo" },
    ],
    points: [30, 32, 30, 36, 34, 40, 38, 44, 46, 52],
  },
  {
    name: "ETFs",
    accent: "#b18cff",
    soft: "rgba(177, 140, 255, 0.12)",
    line: "Diversify simply with index and sector ETFs.",
    value: "₹1,12,480",
    change: "+8.4%",
    rows: [
      { label: "Nifty ETF", detail: "+0.86%" },
      { label: "Bank ETF", detail: "+0.54%" },
      { label: "IT ETF", detail: "+1.12%" },
    ],
    points: [24, 28, 34, 30, 42, 38, 48, 52, 50, 60],
  },
];

const CW = 260;
const CH = 100;

function chartPath(points: number[]) {
  const max = 75;
  const step = CW / (points.length - 1);
  return points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)} ${(CH - (p / max) * CH).toFixed(1)}`
    )
    .join(" ");
}

export default function ProductTabs() {
  const [active, setActive] = useState(0);
  const current = products[active];

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* left: heading + tabs */}
        <div data-animate="left">
          <p className="eyebrow">One app. Every asset.</p>
          <h2 className="text-gradient mt-4 text-3xl font-bold leading-tight tracking-[-0.03em] sm:text-4xl">
            Watch your money work, live.
          </h2>

          <div className="mt-8 space-y-2" role="tablist" aria-label="Products">
            {products.map((product, i) => (
              <button
                key={product.name}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`flex w-full items-center gap-3 rounded-xl border px-5 py-3.5 text-left transition-all duration-300 ${
                  i === active
                    ? ""
                    : "border-line bg-surface opacity-60 hover:border-line-strong hover:opacity-100"
                }`}
                style={
                  i === active
                    ? {
                        borderColor: current.accent,
                        backgroundColor: current.soft,
                        boxShadow: `0 0 30px -10px ${current.accent}`,
                      }
                    : undefined
                }
              >
                <span
                  className="size-2.5 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: i === active ? product.accent : "var(--color-line-strong)",
                    boxShadow:
                      i === active ? `0 0 8px ${product.accent}` : undefined,
                  }}
                  aria-hidden="true"
                />
                <span
                  className="text-base font-semibold transition-colors duration-300"
                  style={{ color: i === active ? product.accent : undefined }}
                >
                  {product.name}
                </span>
              </button>
            ))}
          </div>

          <p
            key={current.name}
            className="mt-6 max-w-sm animate-[word-in_0.5s_cubic-bezier(0.22,1,0.36,1)_both] text-base leading-7 text-body"
          >
            {current.line}
          </p>
        </div>

        {/* right: dashboard card with accent that follows the tab */}
        <div data-animate="right" className="relative mx-auto w-full max-w-md">
          <div
            className="pointer-events-none absolute -inset-10 rounded-full opacity-20 blur-3xl transition-colors duration-700"
            style={{ backgroundColor: current.accent }}
            aria-hidden="true"
          />

          <div
            data-tilt="0.6"
            className="card relative rounded-3xl p-7 transition-shadow duration-700"
            style={{ boxShadow: `0 30px 80px -30px ${current.accent}` }}
          >
            <div
              key={current.name}
              className="animate-[word-in_0.45s_cubic-bezier(0.22,1,0.36,1)_both]"
            >
              <span
                className="inline-flex rounded-full px-3 py-1 text-xs font-bold transition-colors duration-300"
                style={{ backgroundColor: current.soft, color: current.accent }}
              >
                {current.name}
              </span>
              <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted">
                Portfolio Value
              </p>
              <p className="mt-1 flex items-center gap-3 text-3xl font-bold tracking-tight text-ink">
                {current.value}
                <span
                  className="rounded-full px-2.5 py-1 text-sm font-semibold"
                  style={{
                    backgroundColor: current.soft,
                    color: current.accent,
                  }}
                >
                  ▲ {current.change}
                </span>
              </p>

              <svg
                viewBox={`0 0 ${CW} ${CH}`}
                className="mt-5 w-full"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id={`tab-fill-${active}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={current.accent}
                      stopOpacity="0.3"
                    />
                    <stop
                      offset="100%"
                      stopColor={current.accent}
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>
                <path
                  d={`${chartPath(current.points)} L${CW} ${CH} L0 ${CH} Z`}
                  fill={`url(#tab-fill-${active})`}
                />
                <path
                  d={chartPath(current.points)}
                  fill="none"
                  stroke={current.accent}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="draw-line"
                />
                <circle
                  cx={CW}
                  cy={CH - (current.points[current.points.length - 1] / 75) * CH}
                  r="4.5"
                  fill={current.accent}
                  stroke="var(--color-canvas)"
                  strokeWidth="2"
                />
              </svg>

              <div className="mt-5 space-y-2.5">
                {current.rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between rounded-xl bg-raised px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink/[0.06]"
                  >
                    <span className="text-sm font-semibold text-ink">
                      {row.label}
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: current.accent }}
                    >
                      {row.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
