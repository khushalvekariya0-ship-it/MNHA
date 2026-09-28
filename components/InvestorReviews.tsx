import { Caveat } from "next/font/google";
import SplitWords from "@/components/SplitWords";
import StarfallReviews from "@/components/StarfallReviews";

const caveat = Caveat({ subsets: ["latin"], weight: ["600"] });

export default function InvestorReviews() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* night sky with a faint glow where the stars come down */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_30%_at_50%_100%,rgba(0,208,156,0.10),transparent_75%),linear-gradient(180deg,#05070b_0%,#060a12_45%,#07101a_100%)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-canvas to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-canvas to-transparent" />
      </div>

      {/* every falling star lands on a review */}
      <StarfallReviews />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pb-16 pt-28 sm:px-6 lg:px-8 xl:min-h-[max(100svh,640px)] xl:pb-14">
        <div data-animate="" className="max-w-2xl text-center">
          <p className="eyebrow rounded-full border border-primary/30 bg-primary/[0.07] px-4 py-1.5 backdrop-blur-sm">
            Investor stories
          </p>
          <h2 className="mt-6 text-4xl font-bold leading-[1.08] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
            <SplitWords text="Building wealth," />
            <br />
            <SplitWords text="together." accent={["together"]} baseDelay={200} />
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base leading-7 text-ink/75 sm:text-lg sm:leading-8">
            Here&apos;s what our investors have to say about their journey with MNHA.
          </p>
        </div>

        {/* reviews land in this gap (and around the headline on wide screens) */}
        <div data-scene-anchor="" className="h-[300px] w-full xl:h-auto xl:min-h-28 xl:flex-1" />

        <div data-animate="zoom" className="mt-6 xl:mt-0 xl:[--reveal-delay:0.6s]">
          <div className="flex items-center gap-6 rounded-full border border-white/10 bg-[rgba(8,16,26,0.6)] px-6 py-3.5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9),0_0_50px_-24px_rgba(0,208,156,0.6)] backdrop-blur-xl sm:gap-10 sm:px-10 sm:py-4">
            <div className="flex items-center gap-3.5">
              <span className="flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20" />
                  <circle cx="10" cy="8" r="3.5" />
                  <path d="M20 20v-1.5a3.5 3.5 0 0 0-2.5-3.35M15.5 4.6a3.5 3.5 0 0 1 0 6.8" />
                </svg>
              </span>
              <div>
                <p data-countup="" className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                  10L+
                </p>
                <p className="text-xs text-body sm:text-sm">Investors</p>
              </div>
            </div>
            <span className="h-10 w-px bg-white/10" aria-hidden="true" />
            <div className="flex items-center gap-3.5">
              <span className="flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 3.5l2.5 5.2 5.7.7-4.2 3.9 1.1 5.6-5.1-2.8-5.1 2.8 1.1-5.6-4.2-3.9 5.7-.7L12 3.5z" />
                </svg>
              </span>
              <div>
                <p data-countup="" className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                  4.8/5
                </p>
                <p className="text-xs text-body sm:text-sm">Average rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* handwritten sign-off */}
      <div
        data-animate=""
        className="pointer-events-none absolute bottom-[3%] right-[5%] hidden -rotate-[8deg] xl:block"
        style={{ "--reveal-delay": "1s" } as React.CSSProperties}
        aria-hidden="true"
      >
        <p
          className={`${caveat.className} write-in text-4xl leading-[1.05] text-primary-bright drop-shadow-[0_0_12px_rgba(0,208,156,0.45)]`}
          style={{ animationDelay: "1.4s" }}
        >
          Your future
          <br />
          <span className="pl-10">matters</span>
        </p>
        <svg width="170" height="58" viewBox="0 0 170 58" fill="none" className="ml-2 mt-1" aria-hidden="true">
          <path
            d="M4 36 C48 56 108 52 158 18"
            pathLength={1400}
            className="draw-line"
            stroke="#4df3c9"
            strokeWidth="2.2"
            strokeLinecap="round"
            style={{ animationDuration: "0.9s", animationDelay: "3s" }}
          />
          <path
            d="M143 16 L158 18 L153 32"
            pathLength={1400}
            className="draw-line"
            stroke="#4df3c9"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animationDuration: "0.4s", animationDelay: "3.8s" }}
          />
        </svg>
      </div>
    </section>
  );
}
