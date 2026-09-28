export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 34 34"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mnha-g" x1="0" y1="0" x2="34" y2="34">
          <stop offset="0%" stopColor="#4df3c9" />
          <stop offset="100%" stopColor="#00b386" />
        </linearGradient>
      </defs>
      <rect width="34" height="34" rx="9" fill="url(#mnha-g)" />
      <path
        d="M10.5 22.5v-11l6.5 7 6.5-7v11"
        stroke="#03140e"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LogoLockup() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="inline-flex drop-shadow-[0_0_12px_rgba(0,208,156,0.45)] transition-transform duration-500 group-hover:rotate-[360deg]">
        <LogoMark />
      </span>
      <span className="leading-tight">
        <span className="block text-xl font-bold tracking-tight text-ink">
          MNHA
        </span>
        <span className="block text-[9px] font-semibold uppercase tracking-[0.22em] text-primary">
          Your Wealth
        </span>
      </span>
    </span>
  );
}
