"use client";

import Link from "next/link";
import { responsiveImage } from "@/lib/responsive-image";
import { motion, useReducedMotion } from "framer-motion";
import type { PointerEvent } from "react";

const categories = [
  { name: "Dresses", note: "Sculpted & fluid", image: "/images/toyin/toyinimg-15.webp" },
  { name: "Sets", note: "Two-piece ease", image: "/images/toyin/toyinimg-12.webp" },
  { name: "Tops", note: "Everyday polish", image: "/images/toyin/toyinimg-9.webp" },
  { name: "Skirts", note: "Heritage prints", image: "/images/toyin/toyinimg-13.webp" },
  { name: "Evening", note: "After-dark glamour", image: "/images/toyin/toyinimg-3.webp" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function CategoryShowcase() {
  const reduced = useReducedMotion();

  function tilt(event: PointerEvent<HTMLAnchorElement>) {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    event.currentTarget.style.setProperty("--rx", `${(y - .5) * -10}deg`);
    event.currentTarget.style.setProperty("--ry", `${(x - .5) * 12}deg`);
    event.currentTarget.style.setProperty("--gx", `${x * 100}%`);
  }

  function untilt(event: PointerEvent<HTMLAnchorElement>) {
    event.currentTarget.style.setProperty("--rx", "0deg");
    event.currentTarget.style.setProperty("--ry", "0deg");
  }

  return (
    <section className="cat-showcase" aria-labelledby="cat-showcase-title">
      <div className="cat-head">
        <motion.div initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .6 }} transition={{ duration: .8, ease }}>
          <span className="cat-kicker"><i aria-hidden="true" />Shop your way</span>
          <h2 id="cat-showcase-title">Explore by <em>category</em></h2>
        </motion.div>
        <motion.p initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .6 }} transition={{ duration: .8, delay: .1, ease }}>
          Five curated edits, each crafted to celebrate a different side of your story.
          <Link prefetch={false} href="/collections">View all collections <span aria-hidden="true">&#8594;</span></Link>
        </motion.p>
      </div>

      <div className="cat-rail">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            className="cat-item"
            initial={reduced ? false : { opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: .25 }}
            transition={{ duration: .9, delay: index * .08, ease }}
          >
            <Link prefetch={false} href={`/collections/${category.name.toLowerCase()}`} className="cat-card" onPointerMove={tilt} onPointerLeave={untilt}>
              <span className="cat-frame">
                <motion.img {...responsiveImage(category.image)} alt="" loading="lazy" initial={reduced ? false : { scale: 1.3 }} whileInView={{ scale: 1 }} viewport={{ once: true, amount: .25 }} transition={{ duration: 1.6, delay: index * .08 + .1, ease }} />
                <span className="cat-shade" aria-hidden="true" />
                <span className="cat-glare" aria-hidden="true" />
                <span className="cat-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span className="cat-info">
                  <small>{category.note}</small>
                  <strong>{category.name}</strong>
                  <span className="cat-cta">Explore <i aria-hidden="true">&#8599;</i></span>
                </span>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
