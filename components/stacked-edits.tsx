"use client";

import { ResponsiveImage } from "@/components/responsive-image";


import Link from "next/link";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { type CSSProperties, useState } from "react";

const edits = [
  { eyebrow: "The bubu edit", title: "Flowing and regal.", text: "Floor-length bubus with rich fabrics and beautiful beadwork.", href: "/collections/bubu", action: "Shop bubu", image: "/images/products/zainab-bubu-1.jpg", tone: "#2f2f63" },
  { eyebrow: "Effortless pairing", title: "Better together.", text: "Matching tops and wide-leg trousers designed to make dressing feel effortless.", href: "/collections/co-ords", action: "Shop co-ords", image: "/images/products/simi-two-piece-set-1.jpg", tone: "#0d5a47" },
  { eyebrow: "Grand occasions", title: "Own the moment.", text: "Statement gowns for weddings, owambe and every celebration worth dressing up for.", href: "/collections/gowns", action: "Shop gowns", image: "/images/toyin/toyinimg-3.webp", tone: "#681c36" },
  { eyebrow: "One effortless piece", title: "Style your story.", text: "Tailored and fluid jumpsuits that take you from the day to the dinner.", href: "/collections/jumpsuits", action: "Shop jumpsuits", image: "/images/toyin/toyinimg-9.webp", tone: "#145451" },
];


export function StackedEdits() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const go = (index: number) => setActive((index + edits.length) % edits.length);

  return (
    <section className={`mood${reduced ? " is-static" : ""}`} aria-labelledby="mood-title">
      <div className="mood-head">
        <div data-reveal>
          <span className="mood-kicker"><i aria-hidden="true" />Curated edits</span>
          <h2 id="mood-title">A mood for <em>every moment.</em></h2>
        </div>
        <div className="mood-controls" data-reveal>
          <p>Four expressions of the season. Choose the one that feels like you.</p>
          <div>
            <span className="mood-count"><b>{String(active + 1).padStart(2, "0")}</b> / {String(edits.length).padStart(2, "0")}</span>
            <button type="button" onClick={() => go(active - 1)} aria-label="Previous edit">&#8592;</button>
            <button type="button" onClick={() => go(active + 1)} aria-label="Next edit">&#8594;</button>
          </div>
        </div>
      </div>

      <div className="mood-rail">
        {edits.map((edit, index) => {
          const isActive = active === index;
          return (
            <article
              key={edit.title}
              className={`mood-panel${isActive ? " active" : ""}`}
              style={{ "--tone": edit.tone } as CSSProperties}
             
              data-reveal
             
             
            >
              <ResponsiveImage className="mood-cover" src={edit.image} alt="" loading="lazy" decoding="async" />
              <ResponsiveImage className="mood-blur" src={edit.image} sizes="160px" alt="" loading="lazy" decoding="async" aria-hidden="true" />
              <ResponsiveImage className="mood-figure" src={edit.image} alt={edit.title} loading="lazy" decoding="async" />
              <span className="mood-tint" aria-hidden="true" />

              <button type="button" className="mood-hit" onClick={() => go(index)} aria-expanded={isActive} aria-label={`Show ${edit.eyebrow}`} tabIndex={isActive ? -1 : 0} />

              <span className="mood-strip" aria-hidden="true">
                <em>{String(index + 1).padStart(2, "0")}</em>
                <strong>{edit.title}</strong>
                <i>+</i>
              </span>

              <div className="mood-copy" aria-hidden={!isActive}>
                <span className="mood-num" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <small>{edit.eyebrow}</small>
                <h3>{edit.title.split(" ").map((word, i) => <span key={`${word}-${i}`} style={{ "--i": i } as CSSProperties}><span>{word}</span></span>)}</h3>
                <p>{edit.text}</p>
                <Link prefetch={false} href={edit.href} tabIndex={isActive ? 0 : -1}>{edit.action} <span aria-hidden="true">&#8599;</span></Link>
              </div>

              <span className="mood-progress" aria-hidden="true">
                {isActive && <span onAnimationEnd={() => go(index + 1)} />}
              </span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
