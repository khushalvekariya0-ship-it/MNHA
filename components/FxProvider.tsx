"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// building an Intl formatter is slow, so each precision gets one, reused every frame
const formatters = new Map<number, Intl.NumberFormat>();
function indianFormat(decimals: number) {
  let f = formatters.get(decimals);
  if (!f) {
    f = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    formatters.set(decimals, f);
  }
  return f;
}

function animateCount(el: HTMLElement) {
  const original = el.textContent ?? "";
  const match = original.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) return;
  const [, prefix, numStr, suffix] = match;
  const hasComma = numStr.includes(",");
  const target = parseFloat(numStr.replace(/,/g, ""));
  const decimals = (numStr.split(".")[1] ?? "").length;
  const format = indianFormat(decimals);
  const duration = 1500;
  const start = performance.now();
  let shown = "";

  const tick = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const n = target * eased;
    const value = hasComma ? format.format(Number(n.toFixed(decimals))) : n.toFixed(decimals);
    const text = `${prefix}${value}${suffix}`;
    if (text !== shown) {
      el.textContent = text;
      shown = text;
    }
    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = original;
    }
  };
  requestAnimationFrame(tick);
}

export default function FxProvider() {
  const pathname = usePathname();

  // cursor spotlight on cards: every .card in the hovered .spot-group (or the
  // hovered card itself) gets the pointer position as --mx / --my
  useEffect(() => {
    let raf = 0;
    let last: PointerEvent | null = null;
    let litText: HTMLElement | null = null;
    const apply = () => {
      raf = 0;
      const e = last;
      if (!e || !(e.target instanceof Element)) return;

      const text = e.target.closest<HTMLElement>(".spot-text");
      if (litText && litText !== text) {
        litText.style.removeProperty("--mx");
        litText.style.removeProperty("--my");
      }
      litText = text;
      if (text) {
        const rect = text.getBoundingClientRect();
        text.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        text.style.setProperty("--my", `${e.clientY - rect.top}px`);
      }

      const group = e.target.closest<HTMLElement>(".spot-group");
      const cards = group
        ? Array.from(group.querySelectorAll<HTMLElement>(".card"))
        : [e.target.closest<HTMLElement>(".card")].filter(
            (card): card is HTMLElement => card !== null
          );
      // read every rect first, then write, so the browser lays out once
      const rects = cards.map((card) => card.getBoundingClientRect());
      cards.forEach((card, i) => {
        card.style.setProperty("--mx", `${e.clientX - rects[i].left}px`);
        card.style.setProperty("--my", `${e.clientY - rects[i].top}px`);
      });
    };
    const onPointer = (e: PointerEvent) => {
      last = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    document.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onPointer);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const cleanups: (() => void)[] = [];

    // count-up numbers when they scroll into view
    let io: IntersectionObserver | undefined;
    if (!reduced && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animateCount(entry.target as HTMLElement);
            io?.unobserve(entry.target);
          });
        },
        { threshold: 0.6 }
      );
      document
        .querySelectorAll<HTMLElement>("[data-countup]")
        .forEach((el) => io?.observe(el));
    }

    // mouse-follow 3D tilt + glass glare
    if (!reduced && fine) {
      document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
        if (!el.querySelector(":scope > .tilt-glare")) {
          const g = document.createElement("div");
          g.className = "tilt-glare";
          g.setAttribute("aria-hidden", "true");
          el.appendChild(g);
        }
        const glare = el.querySelector<HTMLElement>(":scope > .tilt-glare");
        const strength = parseFloat(el.dataset.tilt || "") || 1;

        const onMove = (e: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          el.style.transform = `perspective(900px) rotateX(${(
            -py *
            8 *
            strength
          ).toFixed(2)}deg) rotateY(${(px * 10 * strength).toFixed(
            2
          )}deg) translateY(-4px)`;
          if (glare) {
            glare.style.opacity = "1";
            glare.style.background = `radial-gradient(420px circle at ${(
              (px + 0.5) *
              100
            ).toFixed(1)}% ${((py + 0.5) * 100).toFixed(
              1
            )}%, rgb(255 255 255 / 0.1), transparent 60%)`;
          }
        };
        const onLeave = () => {
          el.style.transform = "";
          if (glare) glare.style.opacity = "0";
        };

        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          el.removeEventListener("mousemove", onMove);
          el.removeEventListener("mouseleave", onLeave);
        });
      });
    }

    // layered mouse parallax for [data-mouse-parallax] elements
    const mouseEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-mouse-parallax]")
    );
    if (!reduced && fine && mouseEls.length) {
      const factors = mouseEls.map((el) => parseFloat(el.dataset.mouseParallax || "8"));
      let raf = 0;
      let nx = 0;
      let ny = 0;
      const paint = () => {
        raf = 0;
        mouseEls.forEach((el, i) => {
          el.style.transform = `translate(${(nx * factors[i]).toFixed(1)}px, ${(
            ny * factors[i]
          ).toFixed(1)}px)`;
        });
      };
      const onMouse = (e: MouseEvent) => {
        nx = e.clientX / window.innerWidth - 0.5;
        ny = e.clientY / window.innerHeight - 0.5;
        if (!raf) raf = requestAnimationFrame(paint);
      };
      window.addEventListener("mousemove", onMouse, { passive: true });
      cleanups.push(() => {
        window.removeEventListener("mousemove", onMouse);
        cancelAnimationFrame(raf);
      });
    }

    // magnetic buttons: pull toward the cursor
    if (!reduced && fine) {
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        const onMove = (e: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const dx = e.clientX - (rect.left + rect.width / 2);
          const dy = e.clientY - (rect.top + rect.height / 2);
          el.style.transform = `translate(${(dx * 0.22).toFixed(1)}px, ${(
            dy * 0.3
          ).toFixed(1)}px)`;
        };
        const onLeave = () => {
          el.style.transform = "";
        };
        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          el.removeEventListener("mousemove", onMove);
          el.removeEventListener("mouseleave", onLeave);
        });
      });
    }

    // hero copy drifts up and fades as the page scrolls away
    const fadeEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scroll-fade]")
    );
    if (!reduced && fadeEls.length) {
      let raf = 0;
      let faded = false;
      // read in the scroll/resize events (layout is clean there); the frame only writes
      let y = window.scrollY;
      let vh = window.innerHeight;
      const onResize = () => {
        vh = window.innerHeight;
      };
      window.addEventListener("resize", onResize);
      cleanups.push(() => window.removeEventListener("resize", onResize));
      const paint = () => {
        raf = 0;
        const p = Math.min(Math.max(y / (vh * 0.6), 0), 1);
        // once the hero is fully gone there is nothing left to update
        if (p === 1 && faded) return;
        faded = p === 1;
        fadeEls.forEach((el) => {
          el.style.opacity = String(1 - p);
          el.style.transform = `translateY(${(y * 0.18).toFixed(1)}px) scale(${(
            1 -
            p * 0.04
          ).toFixed(3)})`;
        });
      };
      const onFade = () => {
        y = window.scrollY;
        if (!raf) raf = requestAnimationFrame(paint);
      };
      paint();
      window.addEventListener("scroll", onFade, { passive: true });
      cleanups.push(() => {
        window.removeEventListener("scroll", onFade);
        cancelAnimationFrame(raf);
      });
    }

    // scroll parallax for [data-parallax] elements
    const parallaxEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax]")
    );
    if (!reduced && parallaxEls.length) {
      const speeds = parallaxEls.map((el) => parseFloat(el.dataset.parallax || "0.1"));
      let raf = 0;
      const paint = () => {
        raf = 0;
        const vh = window.innerHeight;
        // read all rects, then write, so the browser lays out once per frame
        const rects = parallaxEls.map((el) => (el.parentElement ?? el).getBoundingClientRect());
        parallaxEls.forEach((el, i) => {
          const rect = rects[i];
          if (rect.bottom < -vh || rect.top > vh * 2) return;
          const offset = (rect.top + rect.height / 2 - vh / 2) * -speeds[i];
          el.style.transform = `translateY(${offset.toFixed(1)}px)`;
        });
      };
      const onScroll = () => {
        if (!raf) raf = requestAnimationFrame(paint);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => {
        window.removeEventListener("scroll", onScroll);
        cancelAnimationFrame(raf);
      });
    }

    return () => {
      io?.disconnect();
      cleanups.forEach((fn) => fn());
    };
  }, [pathname]);

  return null;
}
