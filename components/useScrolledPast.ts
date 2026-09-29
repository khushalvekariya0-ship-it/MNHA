"use client";

import { useEffect, useState } from "react";

// past this point the header gives way to the floating menu + theme buttons
export const DOCK_AFTER = 400;

export function useScrolledPast(px = DOCK_AFTER) {
  const [past, setPast] = useState(false);

  useEffect(() => {
    // read in the scroll event itself (layout is clean there); React skips
    // the render when the answer has not changed
    const onScroll = () => setPast(window.scrollY > px);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [px]);

  return past;
}
