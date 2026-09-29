import type { Metadata } from "next";
import Link from "next/link";
import { LAUNCH_DATE } from "@/components/ComingSoon";
import SplitWords from "@/components/SplitWords";

export const metadata: Metadata = {
  title: "Coming Soon",
  description: `MNHA accounts open on ${LAUNCH_DATE}. Explore the platform now and start investing in stocks, mutual funds, F&O and IPOs the day sign-ups go live.`,
};

const perks = [
  "Zero commission on mutual funds",
  "Free account — no opening or maintenance charges",
  "5-minute paperless KYC with PAN + Aadhaar",
  "Start investing with as little as ₹100",
];

export default function SignupPage() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        className="bg-grid pointer-events-none absolute inset-0 -z-20 [mask-image:radial-gradient(ellipse_70%_60%_at_30%_40%,black,transparent)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-32 top-24 -z-20 size-[560px] rounded-full bg-primary/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 -z-20 size-[480px] rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-28 pt-36 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pt-44">
        <div>
          <p className="hero-fade eyebrow" style={{ "--d": "0s" } as React.CSSProperties}>
            Coming {LAUNCH_DATE}
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            <SplitWords
              text="Your MNHA account opens soon."
              accent={["soon"]}
              trigger="load"
              baseDelay={100}
            />
          </h1>
          <ul data-animate-stagger="" className="spot-group mt-10 space-y-3">
            {perks.map((perk) => (
              <li
                key={perk}
                className="card group flex items-center gap-4 rounded-2xl px-5 py-4 text-base text-ink hover:-translate-y-0.5"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-[#03140e] shadow-[0_0_14px_rgba(0,208,156,0.6)] transition-transform duration-300 group-hover:scale-110">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <div data-animate="right">
          <div className="card rounded-3xl px-7 py-12 text-center sm:px-10">
            <span className="btn-soon px-6 py-3 text-base">
              <span className="soon-dot" aria-hidden="true" />
              Coming Soon
              <span className="soon-date">{LAUNCH_DATE}</span>
            </span>
            <h2 className="mt-8 text-3xl font-bold tracking-[-0.03em] text-ink">
              Sign-ups open {LAUNCH_DATE}
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-base leading-7">
              We are putting the final touches on MNHA accounts. Come back on{" "}
              {LAUNCH_DATE} — opening one takes minutes.
            </p>

            <div className="hairline my-9" />

            <p className="text-sm text-muted">
              Want a head start? Run the numbers or say hello.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/try"
                data-magnetic=""
                className="btn-primary px-7 py-3.5 text-base"
              >
                Try the calculator
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/contact"
                data-magnetic=""
                className="btn-ghost px-7 py-3.5 text-base"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
