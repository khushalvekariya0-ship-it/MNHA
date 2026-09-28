const line =
  "M0 150 L30 138 L60 144 L90 118 L120 124 L150 98 L180 104 L210 78 L240 84 L270 56 L300 62 L330 36 L360 22";

// validated dark-mode categorical palette (legend labels give secondary encoding)
const allocation = [
  { name: "Stocks", pct: 45, color: "#00a47a" },
  { name: "Mutual Funds", pct: 30, color: "#6b7bff" },
  { name: "Gold", pct: 15, color: "#c67c0e" },
  { name: "FDs", pct: 10, color: "#9670ea" },
];

const R = 34;
const C = 2 * Math.PI * R;

export default function DashboardMockup() {
  let acc = 0;
  return (
    <div className="relative w-full max-w-xl">
      <div className="glass rounded-3xl p-5 shadow-[0_40px_90px_-30px_var(--shadow-deep)]">
        {/* window bar */}
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-rose-500/80" />
          <span className="size-2.5 rounded-full bg-amber-400/80" />
          <span className="size-2.5 rounded-full bg-primary/80" />
          <span className="ml-3 text-xs font-semibold text-body">MNHA · Dashboard</span>
          <span className="ml-auto h-6 w-28 rounded-full border border-line bg-raised" />
        </div>

        <div className="mt-5 grid grid-cols-[110px_1fr] gap-4">
          <ul className="space-y-1 text-[11px] font-medium">
            {["Dashboard", "Portfolio", "SIPs", "Explore", "Reports"].map((item, i) => (
              <li
                key={item}
                className={`rounded-lg px-2.5 py-2 ${
                  i === 0 ? "bg-primary/15 text-primary" : "text-muted"
                }`}
              >
                {item}
              </li>
            ))}
          </ul>

          <div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] font-medium text-body">Total Portfolio</p>
                <p className="text-2xl font-bold tracking-tight text-ink">₹23,23,391</p>
              </div>
              <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-bold text-primary">
                ▲ 21.2%
              </span>
            </div>
            <svg viewBox="0 0 360 160" className="mt-3 w-full" aria-hidden="true">
              <defs>
                <linearGradient id="dash-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d09c" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#00d09c" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[40, 80, 120].map((y) => (
                <line key={y} x1="0" x2="360" y1={y} y2={y} stroke="var(--color-line)" strokeWidth="1" />
              ))}
              <path d={`${line} L360 160 L0 160 Z`} fill="url(#dash-fill)" />
              <path
                d={line}
                fill="none"
                stroke="#4df3c9"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="draw-line"
              />
              <circle cx="360" cy="22" r="4" fill="#d7fff3" />
            </svg>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { k: "Invested", v: "₹12.0L" },
                { k: "Returns", v: "₹11.2L" },
                { k: "XIRR", v: "18.4%" },
              ].map((s) => (
                <div key={s.k} className="rounded-xl border border-line bg-raised px-2.5 py-2">
                  <p className="text-[10px] text-muted">{s.k}</p>
                  <p className="text-xs font-bold text-ink">{s.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* floating allocation card */}
      <div
        data-mouse-parallax="-16"
        className="absolute -bottom-10 -right-4 hidden sm:block"
      >
        <div className="glass w-56 rounded-2xl p-4 shadow-[0_30px_60px_-20px_var(--shadow-deep)]">
          <p className="text-[11px] font-semibold text-ink">Portfolio Allocation</p>
          <div className="mt-3 flex items-center gap-3">
            <svg width="76" height="76" viewBox="0 0 80 80" className="donut-in shrink-0" aria-hidden="true">
              <g transform="rotate(-90 40 40)">
                {allocation.map((seg) => {
                  const dash = (seg.pct / 100) * C - 2;
                  const start = (acc / 100) * C + 1;
                  acc += seg.pct;
                  return (
                    <circle
                      key={seg.name}
                      cx="40"
                      cy="40"
                      r={R}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="11"
                      strokeDasharray={`${dash} ${C - dash}`}
                      strokeDashoffset={-start}
                    />
                  );
                })}
              </g>
            </svg>
            <ul className="space-y-1 text-[10px]">
              {allocation.map((seg) => (
                <li key={seg.name} className="flex items-center gap-1.5 text-body">
                  <span className="size-1.5 rounded-full" style={{ backgroundColor: seg.color }} />
                  {seg.name}
                  <span className="ml-auto pl-2 font-semibold text-ink">{seg.pct}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
