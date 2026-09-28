const quotes = [
  { name: "NIFTY 50", value: "25,412.30", change: "+0.86%", up: true },
  { name: "SENSEX", value: "83,120.45", change: "+0.72%", up: true },
  { name: "RELIANCE", value: "₹2,896.10", change: "+1.24%", up: true },
  { name: "TCS", value: "₹3,742.50", change: "+0.98%", up: true },
  { name: "HDFC BANK", value: "₹1,642.30", change: "-0.32%", up: false },
  { name: "INFY", value: "₹1,423.15", change: "+1.60%", up: true },
  { name: "GOLD", value: "₹1,01,240", change: "+0.41%", up: true },
  { name: "USD/INR", value: "87.14", change: "-0.12%", up: false },
];

function Row({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-12 pr-12"
      aria-hidden={ariaHidden || undefined}
    >
      {quotes.map((quote) => (
        <span
          key={quote.name}
          className="flex items-center gap-2.5 whitespace-nowrap text-sm transition-opacity duration-300 hover:opacity-100"
        >
          <span className="font-semibold text-ink">{quote.name}</span>
          <span className="text-body tabular-nums">{quote.value}</span>
          <span
            className={`font-semibold tabular-nums ${
              quote.up ? "text-primary" : "text-rose-400"
            }`}
          >
            {quote.up ? "▲" : "▼"} {quote.change}
          </span>
        </span>
      ))}
    </div>
  );
}

export default function Ticker() {
  return (
    <div className="ticker-wrap relative overflow-hidden border-y border-line bg-surface/70 py-3.5 [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
      <div className="ticker-track flex w-max">
        <Row />
        <Row ariaHidden />
      </div>
    </div>
  );
}
