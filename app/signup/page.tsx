import type { Metadata } from "next";
import SignupForm from "@/components/SignupForm";
import SplitWords from "@/components/SplitWords";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create your free MNHA account in under a minute and start investing in stocks, mutual funds, F&O and IPOs.",
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
            Join MNHA
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            <SplitWords
              text="Your wealth journey starts with one account."
              accent={["one", "account"]}
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
          <SignupForm />
        </div>
      </div>
    </section>
  );
}
