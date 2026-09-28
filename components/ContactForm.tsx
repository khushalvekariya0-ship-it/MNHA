"use client";

import { useState } from "react";

const fieldClasses =
  "w-full rounded-xl border border-line bg-raised py-3.5 pl-11 pr-4 text-sm text-ink placeholder:text-muted outline-none transition-all duration-300 hover:border-line-strong focus:border-primary focus:bg-surface focus:shadow-[0_0_0_4px_rgba(0,208,156,0.12),0_0_24px_-6px_rgba(0,208,156,0.5)]";

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="pointer-events-none absolute left-3.5 top-[1.1rem] text-muted transition-all duration-300 group-focus-within:scale-110 group-focus-within:text-primary"
      aria-hidden="true"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </span>
  );
}

const confetti = [
  { tx: "-52px", ty: "-44px", color: "#00d09c" },
  { tx: "48px", ty: "-52px", color: "#5367ff" },
  { tx: "-60px", ty: "10px", color: "#d97706" },
  { tx: "58px", ty: "6px", color: "#8b5cf6" },
  { tx: "-34px", ty: "-70px", color: "#8b5cf6" },
  { tx: "30px", ty: "-74px", color: "#d97706" },
  { tx: "-14px", ty: "-84px", color: "#5367ff" },
  { tx: "14px", ty: "-88px", color: "#00b386" },
];

type Status = "idle" | "sending" | "sent";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [shake, setShake] = useState(false);

  if (status === "sent") {
    return (
      <div
        data-animate="zoom"
        className="card flex h-full flex-col items-center justify-center rounded-3xl border-primary/40 p-10 text-center shadow-[0_0_80px_-30px_rgba(0,208,156,0.6)]"
      >
        <div className="relative">
          {confetti.map((dot, i) => (
            <span
              key={i}
              className="confetti-dot"
              style={
                {
                  "--tx": dot.tx,
                  "--ty": dot.ty,
                  backgroundColor: dot.color,
                } as React.CSSProperties
              }
              aria-hidden="true"
            />
          ))}
          <span className="animate-pop flex size-14 items-center justify-center rounded-full bg-primary text-[#03140e] shadow-[0_0_30px_rgba(0,208,156,0.7)]">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </span>
        </div>
        <h3 className="mt-5 text-xl font-bold text-ink">Message sent!</h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-body">
          Thanks for reaching out. Our team will get back to you within one
          business day.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-primary hover:text-primary-bright"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      data-animate-stagger=""
      className={`card rounded-3xl p-7 shadow-[0_40px_100px_-40px_var(--shadow-deep)] sm:p-9 ${
        shake ? "animate-shake" : ""
      }`}
      onSubmit={(e) => {
        e.preventDefault();
        setStatus("sending");
        window.setTimeout(() => setStatus("sent"), 900);
      }}
      onInvalidCapture={() => {
        setShake(true);
        window.setTimeout(() => setShake(false), 500);
      }}
    >
      <h2 className="text-2xl font-bold tracking-tight text-ink">
        Send us a message
      </h2>
      <p className="mt-2 text-sm leading-6 text-body">
        Fill in the details below and we&apos;ll get back to you as soon as
        possible.
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <div className="group relative">
          <FieldIcon>
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20c.8-3.5 3.5-5.5 7-5.5s6.2 2 7 5.5" />
          </FieldIcon>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Full name*"
            aria-label="Full name"
            className={fieldClasses}
          />
        </div>
        <div className="group relative">
          <FieldIcon>
            <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
            <path d="M4.5 7.5l7.5 5.5 7.5-5.5" />
          </FieldIcon>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Email*"
            aria-label="Email"
            className={fieldClasses}
          />
        </div>
      </div>

      <div className="group relative mt-4">
        <FieldIcon>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M9.5 9.5a2.5 2.5 0 114 2c-.9.6-1.5 1-1.5 2m0 3h.01" />
        </FieldIcon>
        <select
          id="topic"
          name="topic"
          required
          defaultValue=""
          aria-label="What can we help with?"
          className={`${fieldClasses} appearance-none pr-10 invalid:text-muted`}
        >
          <option value="" disabled>
            What can we help with?*
          </option>
          <option>Account &amp; KYC</option>
          <option>Payments &amp; withdrawals</option>
          <option>Products &amp; investing</option>
          <option>Partnerships</option>
          <option>Something else</option>
        </select>
        <span
          className="pointer-events-none absolute right-4 top-[1.15rem] text-muted transition-transform duration-300 group-focus-within:rotate-180 group-focus-within:text-primary"
          aria-hidden="true"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </div>

      <div className="group relative mt-4">
        <FieldIcon>
          <path d="M20 12a8 8 0 10-3.5 6.6L20 20l-1-3.5A8 8 0 0020 12z" />
          <path d="M8.5 11h7m-7 3.5h4.5" />
        </FieldIcon>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Your message*"
          aria-label="Your message"
          className={`${fieldClasses} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary mt-6 flex w-full px-6 py-4 text-base disabled:cursor-wait disabled:opacity-80"
      >
        {status === "sending" ? (
          <>
            <svg
              className="size-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeOpacity="0.3"
                strokeWidth="3"
              />
              <path
                d="M21 12a9 9 0 00-9-9"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            Sending…
          </>
        ) : (
          <>
            Send Message
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14m-6-6l6 6-6 6" />
            </svg>
          </>
        )}
      </button>

      <p className="mt-5 flex items-center justify-center gap-2 text-xs text-body">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 text-primary"
          aria-hidden="true"
        >
          <rect x="4" y="10" width="16" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 018 0v3" />
        </svg>
        Your information is secure and will only be used to respond to your
        request.
      </p>
    </form>
  );
}
