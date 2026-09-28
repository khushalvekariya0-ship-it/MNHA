import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import SplitWords from "@/components/SplitWords";
import ParticleOrbLazy from "@/components/three/ParticleOrbLazy";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the MNHA team — support, product information or anything else. We reply within one business day.",
};

const contactCards = [
  {
    title: "Email us",
    detail: "support@mnha.in",
    note: "We usually reply within 1 business day.",
    icon: (
      <>
        <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
        <path d="M4.5 7.5l7.5 5.5 7.5-5.5" />
      </>
    ),
  },
  {
    title: "Call us",
    detail: "+91 79 4000 1234",
    note: "Mon–Sat · 9:00 AM – 6:00 PM IST",
    icon: (
      <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 006 6l1.5-2 4 1.5v3a2 2 0 01-2 2C10.5 19.5 4.5 13.5 4.5 5.5a2 2 0 012-2z" />
    ),
  },
  {
    title: "Visit us",
    detail: "MNHA House, SG Highway\nAhmedabad, Gujarat 380054",
    note: "By appointment only.",
    icon: (
      <>
        <path d="M12 21s-7-5.5-7-11a7 7 0 0114 0c0 5.5-7 11-7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
  },
];

const quickFacts = [
  { value: "< 2 hrs", label: "Avg. first reply" },
  { value: "24×7", label: "Live chat" },
  { value: "4.8★", label: "Support rating" },
];

export default function ContactPage() {
  return (
    <>
      {/* hero: copy + globe pinned on Ahmedabad */}
      <section className="relative isolate overflow-hidden">
        <div
          className="bg-grid pointer-events-none absolute inset-0 -z-20 [mask-image:radial-gradient(ellipse_70%_60%_at_60%_35%,black,transparent)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-[5%] top-10 -z-20 size-[560px] rounded-full bg-primary/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pt-36 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pt-40">
          <div>
            <p className="hero-fade eyebrow" style={{ "--d": "0s" } as React.CSSProperties}>
              Contact Us
            </p>
            <h1 className="mt-6 text-5xl font-bold leading-[1.04] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              <SplitWords
                text="We're here to help."
                accent={["help"]}
                trigger="load"
                baseDelay={100}
              />
            </h1>
            <p
              className="hero-fade mt-7 max-w-md text-lg leading-8"
              style={{ "--d": "0.5s" } as React.CSSProperties}
            >
              Have a question? Reach out to our team for support, product
              information, or anything else — a real human will get back to
              you, fast.
            </p>
            <div
              className="hero-fade spot-group mt-9 grid max-w-md grid-cols-3 gap-3"
              style={{ "--d": "0.65s" } as React.CSSProperties}
            >
              {quickFacts.map((fact) => (
                <div key={fact.label} className="card rounded-2xl px-3 py-4 text-center">
                  <p className="text-xl font-bold text-ink">{fact.value}</p>
                  <p className="mt-1 text-[11px] font-medium">{fact.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="hero-fade relative h-[380px] sm:h-[460px]"
            style={{ "--d": "0.3s" } as React.CSSProperties}
          >
            <ParticleOrbLazy variant="globe" pin={{ lat: 23.03, lon: 72.58 }} />
            <div className="pointer-events-none absolute left-1/2 top-[18%] -translate-x-1/2">
              <div data-mouse-parallax="-10">
                <div className="glass animate-float flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-ink shadow-[0_0_30px_-8px_rgba(0,208,156,0.6)] [animation-duration:6s]">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary" />
                    <span className="relative inline-flex size-2 rounded-full bg-primary" />
                  </span>
                  MNHA HQ · Ahmedabad
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* channels + form */}
      <section className="relative mx-auto max-w-7xl px-4 pb-28 pt-16 sm:px-6 lg:px-8 lg:pb-36">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          <div data-animate="left">
            <h2 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              <SplitWords text="Pick a channel" accent={["channel"]} />
            </h2>
            <p className="mt-3 text-base leading-7">
              Whatever works for you — we&apos;re on all of them.
            </p>

            <div data-animate-stagger="" className="spot-group mt-8 space-y-4">
              {contactCards.map((card) => (
                <div
                  key={card.title}
                  className="card group flex items-center gap-5 rounded-2xl p-5 hover:-translate-y-1"
                >
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-line-strong bg-raised text-primary transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:border-primary group-hover:bg-primary group-hover:text-[#03140e] group-hover:shadow-[0_0_30px_-4px_rgba(0,208,156,0.8)]">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {card.icon}
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-ink">{card.title}</h3>
                    <p className="mt-0.5 whitespace-pre-line text-sm font-semibold leading-6 text-primary">
                      {card.detail}
                    </p>
                    <p className="mt-1 text-xs text-muted">{card.note}</p>
                  </div>
                  <span
                    className="text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary"
                    aria-hidden="true"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14m-6-6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4 border-l-2 border-primary/60 pl-5">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-primary"
                aria-hidden="true"
              >
                <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <div>
                <p className="text-sm font-bold text-ink">Trusted by thousands of users</p>
                <p className="text-sm">Your privacy and security are our priority.</p>
              </div>
            </div>
          </div>

          <div data-animate="right">
            <div data-parallax="-0.03">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
