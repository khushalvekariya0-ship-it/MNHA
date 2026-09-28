"use client";

import Link from "next/link";
import { useState } from "react";

const inputClasses =
  "w-full rounded-xl border border-line bg-raised px-4 py-3 text-sm text-ink placeholder:text-muted outline-none transition-all duration-300 hover:border-line-strong focus:border-primary focus:bg-surface focus:shadow-[0_0_0_4px_rgba(0,208,156,0.12),0_0_24px_-6px_rgba(0,208,156,0.5)]";

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

export default function SignupForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [shake, setShake] = useState(false);

  if (status === "sent") {
    return (
      <div
        data-animate="zoom"
        className="card rounded-3xl border-primary/40 p-10 text-center shadow-[0_0_80px_-30px_rgba(0,208,156,0.6)]"
      >
        <div className="relative inline-block">
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
          <span className="animate-pop inline-flex size-14 items-center justify-center rounded-full bg-primary text-[#03140e] shadow-[0_0_30px_rgba(0,208,156,0.7)]">
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
        <h2 className="mt-5 text-2xl font-bold text-ink">
          You&apos;re on the list!
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-body">
          We&apos;ve received your details. Check your email for the next steps
          to verify your account and complete your KYC.
        </p>
        <Link
          href="/"
          className="btn-primary mt-7 px-7 py-3 text-sm"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <form
      className={`card rounded-3xl p-8 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)] sm:p-10 ${
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
      <h1 className="text-2xl font-bold tracking-tight text-ink">
        Create your MNHA account
      </h1>
      <p className="mt-2 text-sm">
        Free forever. Takes less than a minute.
      </p>

      <div className="mt-7 space-y-5">
        <div>
          <label
            htmlFor="fullName"
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            placeholder="As per your PAN card"
            className={inputClasses}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className={inputClasses}
          />
        </div>

        <div>
          <label
            htmlFor="mobile"
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            Mobile number
          </label>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-xl border border-r-0 border-line bg-surface px-3.5 text-sm font-medium text-muted">
              +91
            </span>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              required
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              placeholder="10-digit mobile number"
              className={`${inputClasses} rounded-l-none`}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="At least 8 characters"
            className={inputClasses}
          />
        </div>

        <label className="flex items-start gap-3 text-xs leading-5 text-muted">
          <input
            type="checkbox"
            required
            className="mt-0.5 size-4 rounded border-line-strong accent-primary"
          />
          <span>
            I agree to MNHA&apos;s Terms of Service and Privacy Policy, and
            I understand that investments are subject to market risks.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary mt-7 flex w-full px-6 py-3.5 text-base disabled:cursor-wait disabled:opacity-80"
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
            Creating account…
          </>
        ) : (
          "Create Account"
        )}
      </button>

      <p className="mt-5 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          href="/contact"
          className="font-semibold text-primary hover:text-primary-bright"
        >
          Talk to us
        </Link>
      </p>
    </form>
  );
}
