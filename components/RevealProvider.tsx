"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RevealProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          if (el.hasAttribute("data-animate-stagger")) {
            Array.from(el.children).forEach((child, i) => {
              const c = child as HTMLElement;
              c.style.transitionDelay = `${i * 90}ms`;
              c.classList.add("in-view");
              // clear the delay after the reveal so hover stays snappy
              window.setTimeout(() => {
                c.style.transitionDelay = "";
              }, i * 90 + 800);
            });
          } else {
            el.classList.add("in-view");
          }
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" }
    );

    document
      .querySelectorAll("[data-animate], [data-animate-stagger]")
      .forEach((el) => io.observe(el));

    // watch for elements added later (e.g. a form re-mounting after submit)
    const mo = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches("[data-animate], [data-animate-stagger]")) {
            io.observe(node);
          }
          node
            .querySelectorAll("[data-animate], [data-animate-stagger]")
            .forEach((el) => io.observe(el));
        });
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
