"use client";

import { ResponsiveImage } from "@/components/responsive-image";


import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { formatNaira } from "@/lib/currency";

export type Look = {
  look: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string;
  altImage: string;
  colors: string[];
};

const ease = [0.22, 1, 0.36, 1] as const;
const INITIAL = 10;

// Landscape shots keep the model centred; portrait shots are anchored to the top so faces stay in frame.
const landscape = new Set(["/images/toyin/toyinimg-1.webp", "/images/toyin/toyinimg-2.webp"]);
const focus = (src: string) => (landscape.has(src) ? "center 30%" : "center top");

export function ShopEdit({ looks }: { looks: Look[] }) {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState(false);

  const categories = ["All", ...new Set(looks.map((item) => item.category))];
  const filtered = filter === "All" ? looks : looks.filter((item) => item.category === filter);
  const visible = filter === "All" && !expanded ? filtered.slice(0, INITIAL) : filtered;

  return (
    <section className="shop-edit" id="collection" aria-labelledby="shop-edit-title">
      <div className="shop-edit-head">
        <motion.div initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .6 }} transition={{ duration: .8, ease }}>
          <span className="shop-edit-kicker"><i aria-hidden="true" />{looks.length} ways to wear your story</span>
          <h2 id="shop-edit-title">Shop the <em>complete edit</em></h2>
        </motion.div>
        <Link prefetch={false} href="/collections" className="shop-edit-all">View collections <span aria-hidden="true">&#8594;</span></Link>
      </div>

      <div className="shop-edit-filters" role="tablist" aria-label="Filter looks by category">
        {categories.map((category) => (
          <button type="button" role="tab" key={category} aria-selected={filter === category} className={filter === category ? "active" : ""} onClick={() => setFilter(category)}>
            {filter === category && <motion.span layoutId="shop-edit-pill" className="shop-edit-pill" transition={{ duration: reduced ? 0 : .45, ease }} />}
            <span>{category}</span>
          </button>
        ))}
      </div>

      <motion.div layout={!reduced} className="shop-edit-grid">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((item, index) => (
            <motion.div
              layout={!reduced}
              key={`${item.slug}-${item.look}`}
              className="shop-card-wrap"
              initial={reduced ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: .92, transition: { duration: .25 } }}
              viewport={{ once: true, amount: .15 }}
              transition={{ duration: .7, delay: (index % 5) * .07, ease }}
            >
              <Link prefetch={false} href={`/products/${item.slug}`} className="shop-card">
                <span className="shop-card-media">
                  <ResponsiveImage src={item.image} alt={`${item.name}, look ${item.look}`} loading="lazy" decoding="async" style={{ objectPosition: focus(item.image) }} />
                  <span className="shop-card-cta">View piece <i aria-hidden="true">&#8599;</i></span>
                </span>
                <span className="shop-card-info">
                  <span>
                    <small>{item.category}</small>
                    <strong>{item.name}</strong>
                  </span>
                  <b>{formatNaira(item.price)}</b>
                </span>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filter === "All" && looks.length > INITIAL && (
        <div className="shop-edit-more">
          <button type="button" onClick={() => setExpanded((value) => !value)}>
            {expanded ? "Show fewer looks" : `Show all ${looks.length} looks`}
            <span aria-hidden="true">{expanded ? "↑" : "↓"}</span>
          </button>
        </div>
      )}
    </section>
  );
}
