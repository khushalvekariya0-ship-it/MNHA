import type { Metadata } from "next";
import { ComingSoon, LaunchNote } from "@/components/ComingSoon";
import SipCalculator from "@/components/SipCalculator";
import SplitWords from "@/components/SplitWords";

export const metadata: Metadata = {
  title: "Try Us",
  description:
    "See how your money could grow — try MNHA's investment calculator with live growth projections. No sign-up required.",
};

const tips = [
  {
    title: "Start small",
    description: "Start investing from ₹100/month.",
    icon: (
      <>
        <path d="M12 20v-7" />
        <path d="M12 13c-4.5 0-7-2.5-7.5-6.5C8.5 6 12 8 12 13z" />
        <path d="M12 11c.5-3.5 3-5.5 7-5.5C18.5 9.5 16 11 12 11z" />
      </>
    ),
  },
  {
    title: "Stay consistent",
    description: "Automate your investments and build discipline.",
    icon: (
      <>
        <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
        <path d="M4 10h16M8.5 3.5v3m7-3v3" />
        <path d="M9.5 14.5l1.8 1.8 3.4-3.4" />
      </>
    ),
  },
  {
    title: "Think long-term",
    description: "Give your investments time to grow.",
    icon: (
      <>
        <circle cx="12" cy="13" r="7.5" />
        <path d="M12 9.5V13l2.5 2.5M9.5 3.5h5" />
      </>
    ),
  },
];

export default function TryPage() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        className="bg-grid pointer-events-none absolute inset-0 -z-20 [mask-image:radial-gradient(ellipse_70%_50%_at_50%_20%,black,transparent)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[-12%] -z-20 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-40 bottom-20 -z-20 size-[480px] rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-28 pt-36 sm:px-6 lg:px-8 lg:pt-44">
        {/* hero */}
        <div className="text-center">
          <p className="hero-fade eyebrow" style={{ "--d": "0s" } as React.CSSProperties}>
            Try MNHA
          </p>
          <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-bold leading-[1.04] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            <SplitWords
              text="See how your money could grow."
              accent={["grow"]}
              trigger="load"
              baseDelay={100}
            />
          </h1>
          <p
            className="hero-fade mx-auto mt-6 max-w-xl text-lg"
            style={{ "--d": "0.5s" } as React.CSSProperties}
          >
            Drag the sliders — the projection redraws live. No sign-up required.
          </p>
        </div>

        {/* calculator */}
        <div data-animate="zoom" className="mt-14">
          <SipCalculator />
        </div>

        {/* tips */}
        <div data-animate-stagger="" className="spot-group mt-6 grid gap-5 sm:grid-cols-3">
          {tips.map((tip) => (
            <div
              key={tip.title}
              className="card group flex items-center gap-5 rounded-2xl p-6 hover:-translate-y-1"
            >
              <span className="flex size-13 shrink-0 items-center justify-center rounded-2xl border border-line-strong bg-raised p-3 text-primary transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:border-primary group-hover:bg-primary group-hover:text-[#03140e] group-hover:shadow-[0_0_30px_-4px_rgba(0,208,156,0.8)]">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {tip.icon}
                </svg>
              </span>
              <div>
                <h3 className="text-lg font-bold text-ink">{tip.title}</h3>
                <p className="mt-1 text-sm leading-6">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* bottom CTA */}
        <div data-animate="" className="mt-24 text-center">
          <h2 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
            <SplitWords text="Like what you see? Make it real." accent={["real"]} />
          </h2>
          <ComingSoon className="mt-8 px-9 py-4 text-base" />
          <LaunchNote className="mt-5" />
        </div>
      </div>
    </section>
  );
}
