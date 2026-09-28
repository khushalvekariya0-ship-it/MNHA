"use client";

import dynamic from "next/dynamic";
import type { OrbVariant } from "./ParticleOrb";

const ParticleOrb = dynamic(() => import("./ParticleOrb"), { ssr: false });

export default function ParticleOrbLazy(props: {
  variant?: OrbVariant;
  pin?: { lat: number; lon: number };
}) {
  return <ParticleOrb {...props} />;
}
