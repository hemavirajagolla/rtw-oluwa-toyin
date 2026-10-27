"use client";

import { LazyMotion, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

const loadMotionFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

// Only pages that still use Framer Motion wrap themselves in this, so the home page ships without it.
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadMotionFeatures}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
