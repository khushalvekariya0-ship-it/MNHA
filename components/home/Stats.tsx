const stats = [
  { value: "10L+", label: "Happy investors" },
  { value: "₹500 Cr+", label: "Invested through MNHA" },
  { value: "4.8★", label: "Average app rating" },
  { value: "24×7", label: "Human support" },
];

export default function Stats() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div
        data-animate-stagger=""
        className="spot-group grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="card group rounded-3xl px-5 py-10 text-center hover:-translate-y-1"
          >
            <p
              data-countup=""
              className="text-gradient text-4xl font-bold tracking-[-0.04em] tabular-nums sm:text-5xl"
            >
              {stat.value}
            </p>
            <p className="mt-3 text-sm font-medium text-body transition-colors duration-300 group-hover:text-ink">
              {stat.label}
            </p>
            <span
              className="mx-auto mt-4 block h-0.5 w-6 rounded-full bg-primary/40 transition-all duration-500 group-hover:w-14 group-hover:bg-primary group-hover:shadow-[0_0_10px_#00d09c]"
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
