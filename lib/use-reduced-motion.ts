"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const list = window.matchMedia(query);
  list.addEventListener("change", callback);
  return () => list.removeEventListener("change", callback);
}

// Lightweight stand-in for framer-motion's useReducedMotion (no animation library needed).
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}
