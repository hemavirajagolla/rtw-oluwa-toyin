"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function PageMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elements = ref.current?.querySelectorAll(".content-section, .category-tile, .heritage-copy, .lookbook-invite, .page-intro, .article-copy, .policy-body, .faq-item, .lookbook-card, .product-panel, .checkout-wrapper");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.animate([{ opacity: 0, transform: "translateY(28px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 800, easing: "cubic-bezier(.22,1,.36,1)" });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    // Above-the-fold content is already visible in the static HTML. Replaying
    // its entrance during hydration delays LCP and makes the page flash.
    elements?.forEach((element) => {
      if (element.getBoundingClientRect().top >= window.innerHeight) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [pathname]);
  return <div ref={ref} className="page-transition">{children}</div>;
}
