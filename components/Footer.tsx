import Link from "next/link";
import { LogoMark } from "./Logo";

const columns = [
  {
    title: "Products",
    links: [
      { label: "Stocks", href: "/features" },
      { label: "Mutual Funds", href: "/features" },
      { label: "ETFs", href: "/features" },
      { label: "Gold", href: "/features" },
      { label: "IPOs", href: "/features" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/info" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help", href: "/contact" },
      { label: "SIP Calculator", href: "/try" },
      { label: "Sign Up", href: "/signup" },
    ],
  },
];

const socials = [
  {
    label: "Email",
    href: "/contact",
    icon: (
      <>
        <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
        <path d="M4.5 7.5l7.5 5.5 7.5-5.5" />
      </>
    ),
  },
  {
    label: "Phone",
    href: "/contact",
    icon: (
      <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 006 6l1.5-2 4 1.5v3a2 2 0 01-2 2C10.5 19.5 4.5 13.5 4.5 5.5a2 2 0 012-2z" />
    ),
  },
  {
    label: "Website",
    href: "/",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.5 12h17M12 3.5c2.5 2.5 3.5 5.5 3.5 8.5s-1 6-3.5 8.5c-2.5-2.5-3.5-5.5-3.5-8.5s1-6 3.5-8.5z" />
      </>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-canvas">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark size={32} />
              <span className="leading-tight">
                <span className="block text-lg font-bold tracking-tight text-ink">
                  MNHA
                </span>
                <span className="block text-[9px] font-semibold uppercase tracking-[0.22em] text-primary">
                  Your Wealth
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-6">
              MNHA House, SG Highway,
              <br />
              Ahmedabad, Gujarat 380054
            </p>
            <p className="mt-2 text-sm text-ink">support@mnha.in</p>

            <div className="mt-6 flex gap-3">
              {socials.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  data-magnetic=""
                  className="flex size-10 items-center justify-center rounded-full border border-line-strong text-body hover:border-primary hover:text-primary hover:shadow-[0_0_18px_rgba(0,208,156,0.45)]"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {social.icon}
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-ink">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-sm transition-colors duration-300 hover:text-primary"
                    >
                      <span
                        className="h-px w-0 bg-primary transition-all duration-300 group-hover:w-3"
                        aria-hidden="true"
                      />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* giant wordmark lit by the cursor */}
        <p
          className="spot-text mt-16 select-none text-center text-[23vw] font-black leading-[0.8] tracking-[-0.06em] lg:text-[17rem]"
          aria-hidden="true"
        >
          MNHA
        </p>

        <div className="hairline" />
        <div className="flex flex-col gap-4 py-8 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p className="max-w-3xl leading-5">
            Investments in the securities market are subject to market risks.
            Read all the related documents carefully before investing. Past
            performance is not indicative of future returns.
          </p>
          <p className="shrink-0">© 2026 MNHA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
