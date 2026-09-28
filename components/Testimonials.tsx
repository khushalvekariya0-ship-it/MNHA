const rowOne = [
  {
    quote:
      "MNHA made my first SIP feel effortless. I finally understand where my money goes.",
    name: "Priya Sharma",
    role: "Designer, Ahmedabad",
    color: "from-primary to-primary-dark",
  },
  {
    quote:
      "Switched from spreadsheets to MNHA. The clean dashboard is a game changer.",
    name: "Rahul Mehta",
    role: "Software Engineer",
    color: "from-accent to-indigo-600",
  },
  {
    quote: "Zero commission is real. No surprises on any statement so far.",
    name: "Ananya Patel",
    role: "CA Student",
    color: "from-violet-500 to-violet-700",
  },
  {
    quote: "Applied for my first IPO in under a minute. Genuinely simple.",
    name: "Vikram Joshi",
    role: "Business Owner",
    color: "from-amber-500 to-amber-700",
  },
  {
    quote: "Support actually picks up the phone. That alone won me over.",
    name: "Neha Desai",
    role: "Teacher",
    color: "from-rose-500 to-rose-700",
  },
];

const rowTwo = [
  {
    quote: "The SIP calculator convinced me before I even signed up.",
    name: "Arjun Nair",
    role: "Marketing Manager",
    color: "from-accent to-indigo-600",
  },
  {
    quote:
      "I track stocks, gold and funds in one place now. No more app juggling.",
    name: "Kavita Iyer",
    role: "Doctor",
    color: "from-primary to-primary-dark",
  },
  {
    quote:
      "KYC took five minutes at midnight. Started investing the next morning.",
    name: "Sandeep Rao",
    role: "Freelancer",
    color: "from-rose-500 to-rose-700",
  },
  {
    quote:
      "My parents use it too — that says everything about how simple it is.",
    name: "Ishita Shah",
    role: "Student",
    color: "from-violet-500 to-violet-700",
  },
  {
    quote:
      "Clear pricing, clean design, quick withdrawals. Exactly what I needed.",
    name: "Manav Trivedi",
    role: "Consultant",
    color: "from-amber-500 to-amber-700",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

function Card({ item }: { item: (typeof rowOne)[number] }) {
  return (
    <figure className="card group w-[300px] shrink-0 rounded-2xl p-6 hover:-translate-y-1.5 sm:w-[330px]">
      <div className="flex gap-1" aria-label="5 star rating">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="#00d09c"
            className="transition-transform duration-300 group-hover:scale-110"
            style={{ transitionDelay: `${i * 40}ms` }}
            aria-hidden="true"
          >
            <path d="M12 3.5l2.5 5.2 5.7.7-4.2 3.9 1.1 5.6-5.1-2.8-5.1 2.8 1.1-5.6-4.2-3.9 5.7-.7L12 3.5z" />
          </svg>
        ))}
      </div>
      <blockquote className="mt-3 text-sm leading-6 text-ink">
        &ldquo;{item.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white ${item.color}`}
          aria-hidden="true"
        >
          {initials(item.name)}
        </span>
        <span>
          <span className="block text-sm font-bold text-ink">{item.name}</span>
          <span className="block text-xs text-body">{item.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

function Row({
  items,
  reverse = false,
}: {
  items: typeof rowOne;
  reverse?: boolean;
}) {
  return (
    <div className="marquee-wrap spot-group overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <div
        className={`marquee-track flex w-max gap-5 py-2 ${
          reverse ? "marquee-reverse" : ""
        }`}
      >
        <div className="flex shrink-0 gap-5 pr-5">
          {items.map((item) => (
            <Card key={item.name} item={item} />
          ))}
        </div>
        <div className="flex shrink-0 gap-5 pr-5" aria-hidden="true">
          {items.map((item) => (
            <Card key={item.name} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-28">
      {/* soft glows + giant quote mark */}
      <div
        className="pointer-events-none absolute -left-28 top-1/4 size-96 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-28 bottom-1/4 size-96 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute left-6 top-6 select-none font-serif text-[10rem] leading-none text-primary/[0.07]"
        aria-hidden="true"
      >
        &ldquo;
      </span>

      <div className="relative">
        {/* top marquee — scrolls left */}
        <div data-animate="">
          <Row items={rowOne} />
        </div>

        {/* center headline */}
        <div data-animate="zoom" className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <p className="eyebrow">Loved by investors</p>
          <h2 className="mt-5 text-4xl font-bold leading-tight tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            <span className="text-gradient">Trusted by more than</span>{" "}
            <span
              data-countup=""
              className="shimmer-text whitespace-nowrap"
            >
              10,00,000+
            </span>{" "}
            <span className="text-gradient">Indians</span>
          </h2>
          <p className="glass mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-ink">
            <span className="flex gap-0.5" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#00d09c">
                  <path d="M12 3.5l2.5 5.2 5.7.7-4.2 3.9 1.1 5.6-5.1-2.8-5.1 2.8 1.1-5.6-4.2-3.9 5.7-.7L12 3.5z" />
                </svg>
              ))}
            </span>
            4.8 average rating
          </p>
        </div>

        {/* bottom marquee — scrolls right */}
        <div data-animate="">
          <Row items={rowTwo} reverse />
        </div>
      </div>
    </section>
  );
}
