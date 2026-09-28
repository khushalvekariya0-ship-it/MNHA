import Link from "next/link";
import HeroSceneLazy from "@/components/three/HeroSceneLazy";
import SplitWords from "@/components/SplitWords";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-canvas">
      {/* crisp grid + top glow */}
      <div
        className="bg-grid pointer-events-none absolute inset-0 -z-20 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_15%,black,transparent)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[-22%] -z-20 h-[560px] w-[1000px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
        aria-hidden="true"
      />

      {/* live 3D wealth terrain; its growth line runs between
          [data-line-above] and [data-line-below] */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <HeroSceneLazy />
      </div>

      {/* dark vignette behind the copy keeps it legible over the particles;
          it fades out above the growth line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60%] bg-[radial-gradient(ellipse_46%_55%_at_50%_45%,rgb(var(--scrim)/0.92)_30%,rgb(var(--scrim)/0))]"
        aria-hidden="true"
      />

      <div
        data-scroll-fade=""
        className="relative mx-auto w-full max-w-5xl px-4 pt-36 text-center sm:px-6 sm:pt-40 lg:px-8 lg:pt-44 [@media(min-width:1024px)_and_(max-height:800px)]:pt-36"
      >
        <div className="hero-fade" style={{ "--d": "0s" } as React.CSSProperties}>
          <Link
            href="/features"
            className="glass inline-flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4 text-xs font-semibold text-ink transition-colors hover:border-primary/50"
          >
            <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#03140e]">
              New
            </span>
            Live portfolio tracking is here
            <span className="text-primary" aria-hidden="true">
              →
            </span>
          </Link>
        </div>

        <h1
          data-line-above=""
          className="mt-8 text-[2.7rem] font-bold leading-[1.02] tracking-[-0.045em] sm:text-7xl lg:text-[5.6rem]"
        >
          <SplitWords text="Grow your wealth," trigger="load" baseDelay={100} />
          <br />
          <SplitWords
            text="the smart way."
            accent={["smart", "way"]}
            trigger="load"
            baseDelay={280}
          />
        </h1>
      </div>

      <div
        data-scroll-fade=""
        className="relative mx-auto mt-auto w-full max-w-5xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-28"
      >
        <div
          data-line-below=""
          className="hero-fade flex flex-wrap items-center justify-center gap-3"
          style={{ "--d": "0.7s" } as React.CSSProperties}
        >
          <Link
            href="/signup"
            data-magnetic=""
            className="btn-primary pulse-glow py-2 pl-7 pr-2 text-base"
          >
            Start Investing
            <span
              className="flex size-10 items-center justify-center rounded-full bg-[#03140e] text-lg text-primary"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
          <Link
            href="/features"
            data-magnetic=""
            className="btn-ghost px-7 py-4 text-base"
          >
            Explore Features
          </Link>
        </div>
      </div>

      {/* scroll cue */}
      <div
        className="hero-fade pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
        style={{ "--d": "1.5s" } as React.CSSProperties}
        aria-hidden="true"
      >
        <span className="flex h-9 w-6 justify-center rounded-full border-2 border-line-strong pt-1.5">
          <span className="scroll-cue-dot size-1.5 rounded-full bg-primary" />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted">
          Scroll
        </span>
      </div>
    </section>
  );
}
