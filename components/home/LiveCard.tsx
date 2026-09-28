"use client";

import { useEffect, useRef, useState } from "react";

const OPEN_VALUE = 245300;
const START_VALUE = 248320;
const SEED = [
  42, 44, 43, 46, 45, 48, 47, 50, 49, 52, 51, 54, 53, 55, 57, 56, 58, 60, 59,
  61, 63, 62, 64, 66,
];

function sparkPath(series: number[], w: number, h: number) {
  const min = Math.min(...series);
  const span = Math.max(...series) - min || 1;
  return series
    .map(
      (v, i) =>
        `${i === 0 ? "M" : "L"}${((i / (series.length - 1)) * w).toFixed(1)} ${(
          h -
          ((v - min) / span) * h
        ).toFixed(1)}`
    )
    .join(" ");
}

export default function LiveCard() {
  const [value, setValue] = useState(START_VALUE);
  const [series, setSeries] = useState(SEED);
  const [dir, setDir] = useState<"up" | "down">("up");
  const [tick, setTick] = useState(0);
  const valueRef = useRef(START_VALUE);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      const prev = valueRef.current;
      const change = (Math.random() - 0.4) * prev * 0.004;
      const next = Math.max(prev + change, OPEN_VALUE * 0.95);
      valueRef.current = next;
      setValue(next);
      setDir(change >= 0 ? "up" : "down");
      setTick((n) => n + 1);
      setSeries((s) => [
        ...s.slice(1),
        s[s.length - 1] + (change >= 0 ? 1 : -1) * (1 + Math.random() * 2),
      ]);
    }, 1800);
    return () => window.clearInterval(id);
  }, []);

  const pct = ((value - OPEN_VALUE) / OPEN_VALUE) * 100;
  const up = pct >= 0;
  const line = sparkPath(series, 230, 40);

  return (
    <div className="glass w-[270px] rounded-2xl p-5 text-left shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Portfolio
        </p>
        <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-primary">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary" />
            <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
          </span>
          LIVE
        </span>
      </div>
      <p
        key={tick}
        className={`mt-2 text-2xl font-bold tracking-tight text-ink tabular-nums ${
          tick === 0 ? "" : dir === "up" ? "flash-up" : "flash-down"
        }`}
      >
        ₹{Math.round(value).toLocaleString("en-IN")}
      </p>
      <p
        className={`text-xs font-semibold tabular-nums ${
          up ? "text-primary" : "text-rose-400"
        }`}
      >
        {up ? "▲" : "▼"} {Math.abs(pct).toFixed(2)}% today
      </p>
      <svg viewBox="0 0 230 44" className="mt-3 w-full" aria-hidden="true">
        <defs>
          <linearGradient id="live-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00d09c" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#00d09c" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${line} L230 44 L0 44 Z`} fill="url(#live-fill)" />
        <path
          d={line}
          fill="none"
          stroke={up ? "#4df3c9" : "#fb7185"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: "stroke 0.4s ease" }}
        />
      </svg>
    </div>
  );
}
