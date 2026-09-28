import Link from "next/link";
import SplitWords from "@/components/SplitWords";
import WaveBackdrop from "@/components/WaveBackdrop";
import ParticleOrbLazy from "@/components/three/ParticleOrbLazy";
import type { OrbVariant } from "@/components/three/ParticleOrb";

export default function CTA({
  title = "Your wealth journey starts here.",
  subtitle = "Simple investing. Clear decisions. Built for your future.",
  accent = ["here"],
  orb = "ring",
  backdrop = "orb",
}: {
  title?: string;
  subtitle?: string;
  accent?: string[];
  orb?: OrbVariant | false;
  backdrop?: "orb" | "waves";
}) {
  const waves = backdrop === "waves";

  return (
    <section
      className={`relative isolate overflow-hidden ${
        waves
          ? "pb-60 pt-28 sm:pb-56 lg:min-h-[max(100svh,720px)] lg:pt-24"
          : "border-t border-line py-28 lg:py-40"
      }`}
    >
      {waves ? (
        <WaveBackdrop />
      ) : (
        <>
          <div
            className="bg-grid pointer-events-none absolute inset-0 -z-20 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -z-20 size-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl"
            aria-hidden="true"
          />
          {orb && (
            <div className="absolute inset-0 -z-10 opacity-80" aria-hidden="true">
              <ParticleOrbLazy variant={orb} />
            </div>
          )}
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_38%_42%_at_50%_50%,rgb(var(--scrim)/0.85),rgb(var(--scrim)/0))]"
            aria-hidden="true"
          />
        </>
      )}

      <div
        data-animate=""
        className="relative mx-auto max-w-3xl px-4 text-center sm:px-6"
      >
        {waves ? (
          <>
            <p className="text-sm font-bold uppercase tracking-[0.32em] text-[#2ee6d6] light:text-[#0e9384]">
              Get started
            </p>
            <span className="mx-auto mt-3 block h-0.5 w-10 rounded-full bg-[#2ee6d6]/70 light:bg-[#0e9384]/60" aria-hidden="true" />
          </>
        ) : (
          <p className="eyebrow">Get started</p>
        )}
        <h2 className="mt-5 text-4xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-6xl">
          <SplitWords
            text={title}
            accent={accent}
            accentClassNames={
              waves
                ? [
                    "bg-gradient-to-r from-[#34f0c8] to-[#19d9ff] bg-clip-text text-transparent light:from-[#00a37a] light:to-[#0891b2]",
                    "bg-gradient-to-r from-[#19c8ff] to-[#1a7dff] bg-clip-text text-transparent light:from-[#0891b2] light:to-[#1d4ed8]",
                  ]
                : undefined
            }
          />
        </h2>
        <p className={`mx-auto mt-6 max-w-xl text-lg leading-8 ${waves ? "text-ink/85" : ""}`}>
          {subtitle}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signup"
            data-magnetic=""
            className="btn-primary px-8 py-4 text-base"
          >
            Start Investing
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/features"
            data-magnetic=""
            className="btn-ghost px-8 py-4 text-base"
          >
            Explore MNHA
          </Link>
        </div>
        <p className={`mt-6 text-sm ${waves ? "text-ink/70" : "text-muted"}`}>
          No complicated steps. Get started in minutes.
        </p>
      </div>
    </section>
  );
}
