"use client";

import { useEffect, useState } from "react";

// past this point the header gives way to the floating menu + theme buttons
export const DOCK_AFTER = 400;

export function useScrolledPast(px = DOCK_AFTER) {
  const [past, setPast] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setPast(window.scrollY > px);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [px]);

  return past;
}
