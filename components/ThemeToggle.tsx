"use client";

import { applyTheme, useTheme } from "./theme";

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

export default function ThemeToggle({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const theme = useTheme();
  const light = theme === "light";

  const toggle = (button: HTMLButtonElement) => {
    const next = light ? "dark" : "light";
    const doc = document as ViewTransitionDocument;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reduced) {
      applyTheme(next);
      return;
    }
    // the new theme grows out of the button
    const r = button.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = doc.startViewTransition(() => applyTheme(next));
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
  };

  const icon = "absolute transition-all duration-500 ease-out";

  return (
    <button
      type="button"
      onClick={(e) => toggle(e.currentTarget)}
      aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
      title={light ? "Dark mode" : "Light mode"}
      style={style}
      className={`relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ink/[0.07] text-ink ring-1 ring-ink/10 transition-[background-color,box-shadow,scale] duration-300 hover:bg-ink/[0.12] hover:shadow-[0_0_18px_-4px_rgba(0,208,156,0.6)] active:scale-90 ${className}`}
    >
      {/* sun: shown in light mode */}
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
        className={`${icon} ${light ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-50 opacity-0"}`}
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" />
      </svg>
      {/* moon: shown in dark mode */}
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={`${icon} ${light ? "-rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
      >
        <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />
      </svg>
    </button>
  );
}
