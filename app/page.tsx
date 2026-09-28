import Hero from "@/components/home/Hero";
import Ticker from "@/components/home/Ticker";
import Steps from "@/components/home/Steps";
import CTA from "@/components/home/CTA";
import ProductCards from "@/components/ProductCards";
import Testimonials from "@/components/Testimonials";
import ScrollText from "@/components/ScrollText";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />

      <section className="relative mx-auto max-w-5xl px-4 py-28 sm:px-6 lg:px-8 lg:py-40">
        <p data-animate="" className="eyebrow">
          Why MNHA
        </p>
        <ScrollText
          className="mt-8 text-3xl font-semibold leading-[1.3] tracking-[-0.02em] sm:text-4xl lg:text-5xl"
          text="Investing shouldn't feel complicated. MNHA brings stocks, mutual funds, gold and IPOs into one sharp, simple app — with zero commission, zero paperwork and zero guesswork."
          highlight={["zero", "sharp"]}
        />
      </section>

      <ProductCards />
      <Steps />
      <Testimonials />
      <CTA />
    </>
  );
}
