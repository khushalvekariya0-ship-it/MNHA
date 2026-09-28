"use client";

import { useRef, useState } from "react";

function formatINR(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function compactINR(value: number) {
  if (value >= 1e7) return `₹${parseFloat((value / 1e7).toFixed(2))}Cr`;
  if (value >= 1e5) return `₹${parseFloat((value / 1e5).toFixed(2))}L`;
  if (value >= 1e3) return `₹${Math.round(value / 1e3)}K`;
  return `₹${Math.round(value)}`;
}

function niceCeil(value: number) {
  if (value <= 0) return 1;
  const exp = Math.floor(Math.log10(value));
  const base = Math.pow(10, exp);
  const m = value / base;
  const nice = m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10;
  return nice * base;
}

type Mode = "sip" | "lumpsum";

const W = 340;
const H = 220;
const PAD = { l: 46, r: 16, t: 12, b: 32 };
const plotW = W - PAD.l - PAD.r;
const plotH = H - PAD.t - PAD.b;

export default function SipCalculator() {
  const [mode, setMode] = useState<Mode>("sip");
  const [sipAmount, setSipAmount] = useState(10000);
  const [lumpsumAmount, setLumpsumAmount] = useState(500000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);
  const [hoverYear, setHoverYear] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const monthlyRate = rate / 12 / 100;

  const valueAtMonth = (m: number) => {
    if (mode === "sip") {
      if (monthlyRate === 0) return sipAmount * m;
      return (
        sipAmount *
        ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) *
        (1 + monthlyRate)
      );
    }
    return lumpsumAmount * Math.pow(1 + rate / 100, m / 12);
  };

  const months = years * 12;
  const invested = mode === "sip" ? sipAmount * months : lumpsumAmount;
  const total = valueAtMonth(months);
  const returns = total - invested;

  // chart geometry
  const curve = Array.from({ length: months + 1 }, (_, m) => valueAtMonth(m));
  const maxY = niceCeil(total);
  const x = (m: number) => PAD.l + (m / months) * plotW;
  const y = (v: number) => PAD.t + (1 - v / maxY) * plotH;
  const linePath = curve
    .map((v, m) => `${m === 0 ? "M" : "L"}${x(m).toFixed(1)} ${y(v).toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L${x(months).toFixed(1)} ${(PAD.t + plotH).toFixed(1)} L${PAD.l} ${(PAD.t + plotH).toFixed(1)} Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * maxY);
  const xStep = years <= 6 ? 1 : Math.ceil(years / 5);
  const xTicks: number[] = [];
  for (let t = 0; t <= years; t += xStep) xTicks.push(t);
  if (xTicks[xTicks.length - 1] !== years) xTicks.push(years);

  const handlePointer = (e: React.PointerEvent<SVGSVGElement>) => {
    const el = svgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const sx = ((e.clientX - rect.left) / rect.width) * W;
    const yr = Math.round(((sx - PAD.l) / plotW) * years);
    setHoverYear(Math.min(Math.max(yr, 0), years));
  };

  const hoverValue = hoverYear === null ? null : curve[hoverYear * 12];

  return (
    <div className="card rounded-3xl p-6 shadow-[0_40px_100px_-40px_rgba(0,208,156,0.35)] sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.9fr_1.1fr] lg:gap-9">
        {/* controls */}
        <div>
          <div className="inline-flex gap-2">
            {(
              [
                { key: "sip", label: "Monthly SIP" },
                { key: "lumpsum", label: "Lumpsum" },
              ] as { key: Mode; label: string }[]
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setMode(tab.key)}
                className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
                  mode === tab.key
                    ? "bg-primary text-[#03140e] shadow-[0_0_24px_-6px_rgba(0,208,156,0.8)]"
                    : "border border-line-strong bg-white/[0.03] text-body hover:border-primary/50 hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-8">
            {mode === "sip" ? (
              <SliderRow
                label="Monthly investment"
                value={formatINR(sipAmount)}
                min={500}
                max={100000}
                step={500}
                current={sipAmount}
                onChange={setSipAmount}
              />
            ) : (
              <SliderRow
                label="One-time investment"
                value={formatINR(lumpsumAmount)}
                min={10000}
                max={10000000}
                step={10000}
                current={lumpsumAmount}
                onChange={setLumpsumAmount}
              />
            )}

            <SliderRow
              label="Time period"
              value={`${years} ${years === 1 ? "year" : "years"}`}
              min={1}
              max={30}
              step={1}
              current={years}
              onChange={setYears}
            />

            <SliderRow
              label="Expected return (p.a.)"
              value={`${rate}%`}
              min={1}
              max={20}
              step={0.5}
              current={rate}
              onChange={setRate}
            />
          </div>
        </div>

        {/* results */}
        <div className="flex flex-col justify-center gap-6 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/[0.1] to-primary/[0.02] p-6 sm:p-7">
          <div>
            <p className="text-sm font-medium text-body">Invested amount</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-ink tabular-nums">
              {formatINR(invested)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-body">Estimated returns</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-primary tabular-nums">
              {formatINR(returns)}
            </p>
          </div>
          <div className="border-t border-primary/20 pt-5">
            <p className="text-sm font-medium text-body">Total value</p>
            <p className="text-gradient-green mt-1 text-[2rem] font-bold leading-tight tracking-tight tabular-nums">
              {formatINR(total)}
            </p>
          </div>
        </div>

        {/* growth chart */}
        <div className="lg:border-l lg:border-line lg:pl-9">
          <h3 className="text-base font-bold text-ink">Your money growth</h3>
          <p className="mt-1 text-sm text-body">
            {compactINR(invested)} invested{" "}
            <span aria-hidden="true">→</span>{" "}
            {compactINR(total)} projected
          </p>

          <div className="relative mt-4">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              className="w-full touch-none"
              role="img"
              aria-label={`Projected growth: ${formatINR(invested)} invested becomes ${formatINR(total)} in ${years} years at ${rate} percent annual return`}
              onPointerMove={handlePointer}
              onPointerLeave={() => setHoverYear(null)}
            >
              <defs>
                <linearGradient id="growth-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d09c" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#00d09c" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* recessive horizontal grid + y labels */}
              {yTicks.map((tick) => (
                <g key={tick}>
                  <line
                    x1={PAD.l}
                    x2={W - PAD.r}
                    y1={y(tick)}
                    y2={y(tick)}
                    stroke="#1c2531"
                    strokeWidth="1"
                  />
                  <text
                    x={PAD.l - 7}
                    y={y(tick) + 3.5}
                    textAnchor="end"
                    fontSize="10"
                    fill="#5f6b7c"
                  >
                    {compactINR(tick)}
                  </text>
                </g>
              ))}

              {/* x labels */}
              {xTicks.map((tick) => (
                <text
                  key={tick}
                  x={x(tick * 12)}
                  y={H - 14}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#5f6b7c"
                >
                  {tick}
                </text>
              ))}
              <text
                x={PAD.l + plotW / 2}
                y={H - 1}
                textAnchor="middle"
                fontSize="10"
                fill="#5f6b7c"
              >
                Years
              </text>

              {/* area + line */}
              <path d={areaPath} fill="url(#growth-fill)" />
              <path
                d={linePath}
                fill="none"
                stroke="#4df3c9"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                className="draw-line"
                style={{ filter: "drop-shadow(0 0 6px rgba(0,208,156,0.7))" }}
              />

              {/* end dot */}
              <circle
                cx={x(months)}
                cy={y(total)}
                r="4.5"
                fill="#d7fff3"
                stroke="#00d09c"
                strokeWidth="2"
              />

              {/* hover crosshair */}
              {hoverYear !== null && hoverValue !== null && (
                <g>
                  <line
                    x1={x(hoverYear * 12)}
                    x2={x(hoverYear * 12)}
                    y1={PAD.t}
                    y2={PAD.t + plotH}
                    stroke="#5f6b7c"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <circle
                    cx={x(hoverYear * 12)}
                    cy={y(hoverValue)}
                    r="4.5"
                    fill="#00d09c"
                    stroke="#05070b"
                    strokeWidth="2"
                  />
                </g>
              )}
            </svg>

            {/* tooltip */}
            {hoverYear !== null && hoverValue !== null && (
              <div
                className="glass pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[120%] whitespace-nowrap rounded-lg px-3 py-1.5 text-xs shadow-lg"
                style={{
                  left: `${(x(hoverYear * 12) / W) * 100}%`,
                  top: `${(y(hoverValue) / H) * 100}%`,
                }}
              >
                <span className="font-medium text-body">
                  Year {hoverYear} ·{" "}
                </span>
                <span className="font-bold text-ink">
                  {formatINR(hoverValue)}
                </span>
              </div>
            )}
          </div>

          <p className="mt-3 text-[11px] leading-4 text-muted">
            Projections assume a constant annual return and are for
            illustration only.
          </p>
        </div>
      </div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  current,
  onChange,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  current: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label className="text-sm font-medium text-ink">{label}</label>
        <span className="rounded-lg bg-primary/15 px-3 py-1 text-sm font-bold text-primary tabular-nums">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        style={
          {
            "--fill": `${((current - min) / (max - min)) * 100}%`,
          } as React.CSSProperties
        }
      />
    </div>
  );
}
