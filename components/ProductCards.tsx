import Link from "next/link";
import SplitWords from "./SplitWords";

/* Each card gets its own hand-drawn SVG illustration in MNHA's palette */

function StocksArt() {
  return (
    <svg viewBox="0 0 260 140" className="h-auto w-full max-w-[260px]" aria-hidden="true">
      <defs>
        <linearGradient id="pc-stocks" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00d09c" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#00d09c" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="150" y="8" width="56" height="8" rx="4" fill="#1c2531" />
      <rect x="150" y="22" width="40" height="8" rx="4" fill="#0f3a30" />
      <text x="196" y="29" fontSize="9" fill="#5f6b7c">
        1D
      </text>
      <path
        d="M10 122 L28 96 L42 106 L58 78 L72 90 L88 60 L104 76 L118 52 L132 68 L150 42 L164 60 L180 32 L196 46 L214 22 L214 128 L10 128 Z"
        fill="url(#pc-stocks)"
      />
      <path
        d="M10 122 L28 96 L42 106 L58 78 L72 90 L88 60 L104 76 L118 52 L132 68 L150 42 L164 60 L180 32 L196 46 L214 22"
        fill="none"
        stroke="#4df3c9"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="draw-line"
      />
      <circle cx="214" cy="22" r="5" fill="#d7fff3" stroke="#00d09c" strokeWidth="2.5" />
      <rect x="222" y="12" width="30" height="18" rx="9" fill="#111822" stroke="#2b3546" />
      <text x="237" y="25" fontSize="12" textAnchor="middle" fill="#4df3c9" fontWeight="700">
        +
      </text>
    </svg>
  );
}

function EtfsArt() {
  return (
    <svg viewBox="0 0 200 140" className="h-auto w-full max-w-[190px]" aria-hidden="true">
      {[30, 60, 90, 120].map((y) => (
        <line key={y} x1="12" x2="188" y1={y} y2={y} stroke="#1c2531" strokeWidth="1" />
      ))}
      {[40, 80, 120, 160].map((x) => (
        <line key={x} x1={x} x2={x} y1="18" y2="126" stroke="#1c2531" strokeWidth="1" />
      ))}
      <path
        d="M16 112 L55 88 L85 102 L125 72 L168 88"
        fill="none"
        stroke="#5f6b7c"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 96 L55 62 L92 82 L132 46 L170 27"
        fill="none"
        stroke="#4df3c9"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="draw-line"
      />
      <path d="M172 26 l-11 -2 m11 2 l-3 10" stroke="#4df3c9" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function BondsArt() {
  return (
    <svg viewBox="0 0 200 140" className="h-auto w-full max-w-[190px]" aria-hidden="true">
      <rect x="22" y="14" width="50" height="96" rx="25" fill="rgba(244,63,94,0.1)" stroke="rgba(251,113,133,0.45)" strokeWidth="1.5" />
      <path
        d="M47 40 q2.5 9 11 11.5 q-8.5 2.5 -11 11.5 q-2.5 -9 -11 -11.5 q8.5 -2.5 11 -11.5z"
        fill="rgba(251,113,133,0.25)"
        stroke="#fb7185"
        strokeWidth="1.2"
      />
      <rect x="128" y="30" width="50" height="96" rx="25" fill="rgba(244,63,94,0.05)" stroke="rgba(251,113,133,0.45)" strokeWidth="1.5" />
      <path
        d="M153 56 q2.5 9 11 11.5 q-8.5 2.5 -11 11.5 q-2.5 -9 -11 -11.5 q8.5 -2.5 11 -11.5z"
        fill="rgba(251,113,133,0.2)"
        stroke="#fb7185"
        strokeWidth="1.2"
      />
      <path d="M96 14 a16 16 0 0116 16 h-16z" fill="none" stroke="rgba(251,113,133,0.45)" strokeWidth="1.5" />
      <path d="M112 14 a16 16 0 00-16 16 h16z" fill="rgba(244,63,94,0.12)" stroke="rgba(251,113,133,0.45)" strokeWidth="1.5" />
      <circle cx="100" cy="102" r="22" fill="#111822" stroke="#fb7185" strokeWidth="1.5" />
      <path
        d="M92 92h16M92 98h16M93.5 92c9 0 9 10 0 10l11 10"
        fill="none"
        stroke="#fda4af"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M22 122 q6 -8 12 0 q6 8 12 0" fill="none" stroke="rgba(251,113,133,0.45)" strokeWidth="1.5" />
      <path d="M154 16 q6 -8 12 0" fill="none" stroke="rgba(251,113,133,0.45)" strokeWidth="1.5" />
    </svg>
  );
}

function IposArt() {
  const tiles: { c: number; r: number; fill: string; stroke: string }[] = [
    { c: 1, r: 0, fill: "rgba(251,113,133,0.2)", stroke: "#fb7185" },
    { c: 4, r: 0, fill: "rgba(167,139,250,0.2)", stroke: "#a78bfa" },
    { c: 2, r: 1, fill: "rgba(56,189,248,0.2)", stroke: "#38bdf8" },
    { c: 1, r: 2, fill: "rgba(245,165,36,0.2)", stroke: "#f5a524" },
    { c: 3, r: 2, fill: "rgba(0,208,156,0.22)", stroke: "#00d09c" },
    { c: 2, r: 3, fill: "rgba(251,113,133,0.2)", stroke: "#fb7185" },
    { c: 4, r: 3, fill: "rgba(167,139,250,0.2)", stroke: "#a78bfa" },
  ];
  const cell = (c: number, r: number) => ({ x: 24 + c * 32, y: 34 + r * 26 });
  return (
    <svg viewBox="0 0 240 140" className="h-auto w-full max-w-[230px]" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x={24 + i * 29} y="12" width="17" height="5" rx="2.5" fill="#1c2531" />
      ))}
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 6 }).map((_, c) => {
          const t = tiles.find((tile) => tile.c === c && tile.r === r);
          const pos = cell(c, r);
          return (
            <rect
              key={`${c}-${r}`}
              x={pos.x}
              y={pos.y}
              width="22"
              height="20"
              rx="6"
              fill={t ? t.fill : "#0b1017"}
              stroke={t ? t.stroke : "#1c2531"}
              strokeWidth="1.3"
            />
          );
        })
      )}
    </svg>
  );
}

function MutualFundsArt() {
  const C = 2 * Math.PI * 38;
  return (
    <svg viewBox="0 0 200 140" className="h-auto w-full max-w-[190px]" aria-hidden="true">
      <g transform="rotate(-90 100 70)">
        <circle
          cx="100"
          cy="70"
          r="38"
          fill="none"
          stroke="#00d09c"
          strokeWidth="17"
          strokeDasharray={`${C * 0.5 - 3} ${C - (C * 0.5 - 3)}`}
          strokeDashoffset="-1.5"
        />
        <circle
          cx="100"
          cy="70"
          r="38"
          fill="none"
          stroke="#6b7bff"
          strokeWidth="17"
          strokeDasharray={`${C * 0.3 - 3} ${C - (C * 0.3 - 3)}`}
          strokeDashoffset={-(C * 0.5 + 1.5)}
        />
        <circle
          cx="100"
          cy="70"
          r="38"
          fill="none"
          stroke="#f5a524"
          strokeWidth="17"
          strokeDasharray={`${C * 0.2 - 3} ${C - (C * 0.2 - 3)}`}
          strokeDashoffset={-(C * 0.8 + 1.5)}
        />
      </g>
      <rect x="152" y="52" width="26" height="7" rx="3.5" fill="rgba(0,208,156,0.45)" />
      <rect x="152" y="66" width="20" height="7" rx="3.5" fill="rgba(107,123,255,0.45)" />
      <rect x="152" y="80" width="15" height="7" rx="3.5" fill="rgba(245,165,36,0.45)" />
    </svg>
  );
}

function GoldArt() {
  return (
    <svg viewBox="0 0 200 140" className="h-auto w-full max-w-[190px]" aria-hidden="true">
      <ellipse cx="100" cy="100" rx="46" ry="15" fill="#b45309" stroke="#f59e0b" strokeWidth="1.5" />
      <ellipse cx="100" cy="84" rx="46" ry="15" fill="#d97706" stroke="#fbbf24" strokeWidth="1.5" />
      <ellipse cx="100" cy="68" rx="46" ry="15" fill="#f59e0b" stroke="#fde68a" strokeWidth="1.5" />
      <ellipse cx="100" cy="66" rx="34" ry="10" fill="none" stroke="#fde68a" strokeWidth="1.5" />
      <path
        d="M94 62h12M94 66.5h12M95.5 62c6.5 0 6.5 8 0 8l8.5 7"
        fill="none"
        stroke="#78350f"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M158 34 q2 7 8.5 9 q-6.5 2 -8.5 9 q-2 -7 -8.5 -9 q6.5 -2 8.5 -9z"
        fill="#fde68a"
        stroke="#f59e0b"
        strokeWidth="1.2"
      />
      <path
        d="M46 26 q1.5 5 6 6.5 q-4.5 1.5 -6 6.5 q-1.5 -5 -6 -6.5 q4.5 -1.5 6 -6.5z"
        fill="#fef3c7"
        stroke="#fcd34d"
        strokeWidth="1.2"
      />
    </svg>
  );
}

const products = [
  {
    name: "Stocks",
    caption: "Never miss a market move. Stay ahead.",
    wide: true,
    art: <StocksArt />,
  },
  {
    name: "ETFs",
    caption: "Diversify in one tap.",
    wide: false,
    art: <EtfsArt />,
  },
  {
    name: "Bonds",
    caption: "Steady, predictable returns.",
    wide: false,
    art: <BondsArt />,
  },
  {
    name: "IPOs",
    caption: "Track & apply for ongoing and upcoming IPOs.",
    wide: true,
    art: <IposArt />,
  },
  {
    name: "Mutual Funds",
    caption: "SIPs from just ₹100.",
    wide: false,
    art: <MutualFundsArt />,
  },
  {
    name: "Gold",
    caption: "Start with just ₹10.",
    wide: false,
    art: <GoldArt />,
  },
];

export default function ProductCards() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div data-animate="">
        <p className="eyebrow">Products</p>
        <h2 className="mt-5 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
          <SplitWords text="Every way to grow your money" accent={["grow"]} />
        </h2>
      </div>

      <div
        data-animate-stagger=""
        className="spot-group mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {products.map((product) => (
          <Link
            key={product.name}
            href="/features"
            data-cursor="Explore"
            className={`card group flex flex-col rounded-3xl p-7 hover:-translate-y-1.5 ${
              product.wide ? "sm:col-span-2 sm:flex-row sm:items-center sm:gap-8" : ""
            }`}
          >
            <div className={product.wide ? "sm:max-w-[45%]" : ""}>
              <h3 className="text-2xl font-bold tracking-tight text-ink">
                {product.name}
              </h3>
              <p className="mt-2 text-sm leading-6">{product.caption}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
                Explore
                <span
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </span>
            </div>
            <div
              className={`mt-6 flex flex-1 items-center justify-center transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.06] ${
                product.wide ? "sm:mt-0" : ""
              }`}
            >
              {product.art}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
