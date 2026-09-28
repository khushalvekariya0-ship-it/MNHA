"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogoLockup } from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { lockScroll, scrollToTop } from "./SmoothScroll";

const links = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Info", href: "/info" },
  { label: "Contact Us", href: "/contact" },
  { label: "Try Us", href: "/try" },
];

const R = 21;
const CIRCUMFERENCE = 2 * Math.PI * R;

// appears once the page is scrolled: menu + theme on wide screens (the mobile
// header already carries both), and back-to-top everywhere
export default function FloatingDock() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      setVisible(window.scrollY > 500);
      ringRef.current?.setAttribute("stroke-dashoffset", String(CIRCUMFERENCE * (1 - progress)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // a new page starts at the top, so re-check once its scroll reset has run
  useEffect(() => {
    setOpen(false);
    const recheck = window.setTimeout(() => setVisible(window.scrollY > 500), 80);
    return () => window.clearTimeout(recheck);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const focus = window.setTimeout(() => closeRef.current?.focus(), 350);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.clearTimeout(focus);
      window.removeEventListener("keydown", onKey);
      menuButtonRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  const shown = visible || open;

  return (
    <>
      <div
        className={`fixed bottom-5 right-4 z-40 flex flex-col items-center gap-3 transition-[opacity,translate] duration-300 ease-out sm:bottom-7 sm:right-7 ${
          shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <div className="hidden flex-col items-center gap-1.5 rounded-full border border-line-strong bg-surface/80 p-1 shadow-[0_12px_30px_-12px_var(--shadow-deep)] backdrop-blur-md md:flex">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="site-menu"
            tabIndex={shown ? 0 : -1}
            className="group flex size-10 items-center justify-center rounded-full text-ink transition-[background-color,scale] duration-300 hover:bg-ink/[0.08] active:scale-90"
          >
            <span className="relative block h-3.5 w-[18px]" aria-hidden="true">
              <span className="absolute left-0 top-0 h-0.5 w-full rounded bg-current transition-all duration-300 group-hover:w-2/3" />
              <span className="absolute left-0 top-1.5 h-0.5 w-full rounded bg-current" />
              <span className="absolute left-0 top-3 h-0.5 w-full rounded bg-current transition-all duration-300 group-hover:w-1/2" />
            </span>
          </button>
          <span className="h-px w-6 bg-line-strong" aria-hidden="true" />
          <ThemeToggle className="bg-transparent! ring-0! hover:bg-ink/[0.08]!" />
        </div>

        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          title="Back to top"
          tabIndex={shown ? 0 : -1}
          className="group relative flex size-12 items-center justify-center rounded-full border border-line-strong bg-surface/80 text-ink shadow-[0_12px_30px_-12px_var(--shadow-deep)] backdrop-blur-md transition-[border-color,box-shadow,scale] duration-300 hover:border-primary hover:shadow-[0_0_24px_-4px_rgba(0,208,156,0.6)] active:scale-90"
        >
          {/* ring fills with how far down the page you are */}
          <svg className="absolute inset-0 -rotate-90" width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
            <circle
              ref={ringRef}
              cx="24"
              cy="24"
              r={R}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE}
            />
          </svg>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:-translate-y-0.5"
            aria-hidden="true"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>

      {/* side menu */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[55] bg-[rgb(var(--scrim)/0.55)] backdrop-blur-sm transition-opacity duration-500 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />
      <aside
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
        className={`fixed inset-y-3 right-3 z-[60] flex w-[min(380px,calc(100vw-24px))] flex-col rounded-3xl border border-line-strong bg-surface/95 p-6 shadow-[0_30px_80px_-30px_var(--shadow-deep)] backdrop-blur-xl transition-[translate,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-8 ${
          open ? "translate-x-0 opacity-100" : "translate-x-[calc(100%+24px)] opacity-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="group" onClick={() => setOpen(false)}>
            <LogoLockup />
          </Link>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex size-10 items-center justify-center rounded-full bg-ink/[0.07] text-ink ring-1 ring-ink/10 transition-[background-color,rotate] duration-300 hover:rotate-90 hover:bg-ink/[0.12]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">Menu</p>
        <nav aria-label="Site" className="mt-3">
          <ul className="divide-y divide-line">
            {links.map((link, i) => {
              const active = pathname === link.href;
              return (
                <li
                  key={link.href}
                  className={`transition-[opacity,translate] duration-500 ease-out ${
                    open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
                  }`}
                  style={{ transitionDelay: open ? `${120 + i * 55}ms` : "0ms" }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className="group flex items-center gap-4 py-3.5"
                  >
                    <span className="w-6 text-xs font-semibold tabular-nums text-muted">0{i + 1}</span>
                    <span
                      className={`flex-1 text-2xl font-semibold tracking-tight transition-colors duration-300 ${
                        active ? "text-primary" : "text-ink group-hover:text-primary"
                      }`}
                    >
                      {link.label}
                    </span>
                    {active ? (
                      <span className="size-2 rounded-full bg-primary shadow-[0_0_10px_#00d09c]" aria-hidden="true" />
                    ) : (
                      <span
                        className="-translate-x-2 text-lg text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          className={`mt-auto space-y-4 transition-[opacity,translate] duration-500 ease-out ${
            open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: open ? "420ms" : "0ms" }}
        >
          <div className="flex items-center justify-between rounded-2xl border border-line px-4 py-3">
            <span>
              <span className="block text-sm font-semibold text-ink">Appearance</span>
              <span className="block text-xs text-muted">Switch dark / light</span>
            </span>
            <ThemeToggle />
          </div>
          <Link href="/signup" onClick={() => setOpen(false)} className="btn-primary flex w-full px-6 py-3.5 text-base">
            Sign Up
            <span aria-hidden="true">→</span>
          </Link>
          <p className="text-center text-xs text-muted">support@mnha.in</p>
        </div>
      </aside>
    </>
  );
}
