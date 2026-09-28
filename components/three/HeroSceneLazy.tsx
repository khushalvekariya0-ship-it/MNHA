"use client";

import dynamic from "next/dynamic";
import { useTheme } from "@/components/theme";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function HeroSceneLazy() {
  const theme = useTheme();
  return <HeroScene light={theme === "light"} />;
}
