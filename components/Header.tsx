"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogoLockup } from "./Logo";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Info", href: "/info" },
  { label: "Contact Us", href: "/contact" },
  { label: "Try Us", href: "/try" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pill, setPill] = useState({ left: 0, width: 0, visible: false });
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const movePill = (el: HTMLElement) => {
    setPill({ left: el.offsetLeft, width: el.offsetWidth, visible: true });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full border pl-4 pr-2 transition-all duration-500 ${
          scrolled
            ? "h-14 border-line-strong bg-canvas/75 shadow-[0_12px_40px_-12px_var(--shadow-deep)] backdrop-blur-xl"
            : "h-16 border-line bg-surface/40 backdrop-blur-md"
        }`}
      >
        <Link
          href="/"
          aria-label="MNHA home"
          className="nav-item-in group"
          style={{ "--nav-delay": "0.05s" } as React.CSSProperties}
        >
          <LogoLockup />
        </Link>

        <nav
          ref={navRef}
          className="relative hidden items-center md:flex"
          aria-label="Main"
          onMouseLeave={() => setPill((p) => ({ ...p, visible: false }))}
        >
          <span
            className="pointer-events-none absolute top-1/2 h-9 -translate-y-1/2 rounded-full bg-ink/[0.07] ring-1 ring-ink/10 transition-all duration-300 ease-out"
            style={{
              left: pill.left,
              width: pill.width,
              opacity: pill.visible ? 1 : 0,
            }}
            aria-hidden="true"
          />
          {navLinks.map((link, i) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={(e) => movePill(e.currentTarget)}
                className={`nav-item-in relative px-4 py-2 text-sm font-medium transition-colors ${
                  active ? "text-ink" : "text-body hover:text-ink"
                }`}
                style={
                  { "--nav-delay": `${0.18 + i * 0.09}s` } as React.CSSProperties
                }
              >
                {link.label}
                {active && (
                  <span
                    className="absolute bottom-0 left-1/2 size-1 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_8px_#00d09c]"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle
            className="nav-item-in"
            style={{ "--nav-delay": "0.52s" } as React.CSSProperties}
          />
          <Link
            href="/signup"
            data-magnetic=""
            className="nav-item-in btn-primary hidden px-5 py-2.5 text-sm md:inline-flex"
            style={{ "--nav-delay": "0.6s" } as React.CSSProperties}
          >
            Sign Up
          </Link>

          <button
            type="button"
            className="nav-item-in rounded-full p-3 text-ink hover:bg-ink/10 md:hidden"
            style={{ "--nav-delay": "0.2s" } as React.CSSProperties}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            <span className="relative block h-4 w-6" aria-hidden="true">
              <span
                className={`menu-bar absolute left-0 top-0 block h-0.5 w-6 rounded bg-current ${
                  open ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`menu-bar absolute left-0 top-[7px] block h-0.5 w-6 rounded bg-current ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`menu-bar absolute left-0 top-[14px] block h-0.5 w-6 rounded bg-current ${
                  open ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="glass animate-menu mx-auto mt-2 max-w-6xl rounded-3xl p-2 md:hidden"
          aria-label="Mobile"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-2xl px-4 py-3 text-sm font-medium ${
                pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-body hover:bg-ink/5 hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/signup"
            className="btn-primary mt-2 flex w-full px-4 py-3 text-sm"
          >
            Sign Up
          </Link>
        </nav>
      )}
    </header>
  );
}
