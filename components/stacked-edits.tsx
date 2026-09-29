"use client";

import { ResponsiveImage } from "@/components/responsive-image";


import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { type CSSProperties, useState } from "react";

const edits = [
  { eyebrow: "The dress edit", title: "Own the moment.", text: "Sculpted silhouettes made for memorable entrances.", href: "/collections/dresses", action: "Shop dresses", image: "/images/toyin/toyinimg-15.webp", tone: "#681c36" },
  { eyebrow: "Effortless pairing", title: "Better together.", text: "Polished sets designed to make dressing feel effortless.", href: "/collections/sets", action: "Shop sets", image: "/images/toyin/toyinimg-12.webp", tone: "#0d5a47" },
  { eyebrow: "Everyday expression", title: "Style your story.", text: "Confident separates for a wardrobe that moves with you.", href: "/collections/tops", action: "Explore tops", image: "/images/toyin/toyinimg-9.webp", tone: "#145451" },
  { eyebrow: "After dark", title: "Made for the night.", text: "Evening pieces with shimmer, drama and quiet poise.", href: "/collections/evening", action: "Shop evening", image: "/images/toyin/toyinimg-10.webp", tone: "#3f4632" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function StackedEdits() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const go = (index: number) => setActive((index + edits.length) % edits.length);

  return (
    <section className={`mood${reduced ? " is-static" : ""}`} aria-labelledby="mood-title">
      <div className="mood-head">
        <motion.div initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .6 }} transition={{ duration: .8, ease }}>
          <span className="mood-kicker"><i aria-hidden="true" />Curated edits</span>
          <h2 id="mood-title">A mood for <em>every moment.</em></h2>
        </motion.div>
        <motion.div className="mood-controls" initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .6 }} transition={{ duration: .8, delay: .1, ease }}>
          <p>Four expressions of the season. Choose the one that feels like you.</p>
          <div>
            <span className="mood-count"><b>{String(active + 1).padStart(2, "0")}</b> / {String(edits.length).padStart(2, "0")}</span>
            <button type="button" onClick={() => go(active - 1)} aria-label="Previous edit">&#8592;</button>
            <button type="button" onClick={() => go(active + 1)} aria-label="Next edit">&#8594;</button>
          </div>
        </motion.div>
      </div>

      <div className="mood-rail">
        {edits.map((edit, index) => {
          const isActive = active === index;
          return (
            <motion.article
              key={edit.title}
              className={`mood-panel${isActive ? " active" : ""}`}
              style={{ "--tone": edit.tone } as CSSProperties}
              initial={reduced ? false : { opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: .2 }}
              transition={{ duration: .9, delay: index * .1, ease }}
            >
              <ResponsiveImage className="mood-cover" src={edit.image} alt="" loading="lazy" decoding="async" />
              <ResponsiveImage className="mood-blur" src={edit.image} alt="" loading="lazy" decoding="async" aria-hidden="true" />
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
                {isActive && <span />}
              </span>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
