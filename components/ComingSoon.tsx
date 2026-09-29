import type { CSSProperties } from "react";

/** Sign-ups are not open yet — every account CTA shows this date instead. */
export const LAUNCH_DATE = "1 Oct";

type Props = { className?: string; style?: CSSProperties };

/** Inert stand-in for the old "Sign Up" button. Sizing comes from className. */
export function ComingSoon({ className = "", style }: Props) {
  return (
    <span className={`btn-soon ${className}`} style={style}>
      <span className="soon-dot" aria-hidden="true" />
      Coming Soon
      <span className="soon-date">{LAUNCH_DATE}</span>
    </span>
  );
}

/** The line that sits under a full-size CTA. */
export function LaunchNote({ className = "", style }: Props) {
  return (
    <p className={`text-sm text-muted ${className}`} style={style}>
      Sign-ups open {LAUNCH_DATE} — no complicated steps, it takes minutes.
    </p>
  );
}
