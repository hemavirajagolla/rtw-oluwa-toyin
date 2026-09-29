"use client";

import { ResponsiveImage } from "@/components/responsive-image";


import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { formatNaira } from "@/lib/currency";

type Pick = { slug: string; name: string; category: string; price: number; image: string };

const links = [
  { href: "/collections/evening", kicker: "After dark", title: "Evening", text: "Shimmer, drama and quiet poise.", image: "/images/toyin/toyinimg-10.webp" },
  { href: "/about", kicker: "Behind the label", title: "Our story", text: "The women and craft behind RTW.", image: "/images/toyin/toyinimg-7.webp" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function JournalBento({ picks }: { picks: Pick[] }) {
  const reduced = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: .2 },
    transition: { duration: .9, delay, ease },
  });

  return (
    <section className="journal" aria-labelledby="journal-title">
      <motion.div className="journal-feature-wrap" {...rise(0)}>
        <Link prefetch={false} href="/lookbook" className="journal-feature">
          <ResponsiveImage src="/images/toyin/toyinimg-8.webp" alt="RTW editorial portrait" loading="lazy" decoding="async" />
          <span className="journal-feature-shade" aria-hidden="true" />
          <span className="journal-feature-copy">
            <span className="journal-kicker"><i aria-hidden="true" />The RTW journal</span>
            <h2 id="journal-title">Details that <em>complete you.</em></h2>
            <span className="journal-feature-text">Discover the stories, styling and inspiration behind every edit.</span>
            <span className="journal-btn">Enter the lookbook <b aria-hidden="true">&#8594;</b></span>
          </span>
          <span className="journal-stamp" aria-hidden="true">
            <svg viewBox="0 0 100 100"><defs><path id="journal-circle" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" /></defs><text><textPath href="#journal-circle">STORIES &#8226; STYLING &#8226; INSPIRATION &#8226; </textPath></text></svg>
            <em>&#10022;</em>
          </span>
        </Link>
      </motion.div>

      {links.map((link, index) => (
        <motion.div key={link.href} className="journal-link-wrap" {...rise(.12 + index * .1)}>
          <Link prefetch={false} href={link.href} className="journal-link">
            <ResponsiveImage src={link.image} alt="" loading="lazy" decoding="async" />
            <span className="journal-link-shade" aria-hidden="true" />
            <span className="journal-link-copy">
              <small>{link.kicker}</small>
              <strong>{link.title}</strong>
              <span>{link.text}</span>
            </span>
            <i aria-hidden="true">&#8599;</i>
          </Link>
        </motion.div>
      ))}

      <motion.div className="journal-trending" {...rise(.3)}>
        <div className="journal-trending-head">
          <span><span className="journal-live" aria-hidden="true" />Trending now</span>
          <Link prefetch={false} href="/collections">Shop all <span aria-hidden="true">&#8594;</span></Link>
        </div>
        <div className="journal-trending-list">
          {picks.map((pick, index) => (
            <motion.div key={pick.slug} initial={reduced ? false : { opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .4 }} transition={{ duration: .7, delay: .4 + index * .1, ease }}>
              <Link prefetch={false} href={`/products/${pick.slug}`} className="journal-pick">
                <span className="journal-pick-img"><ResponsiveImage src={pick.image} alt="" loading="lazy" decoding="async" /></span>
                <span className="journal-pick-info">
                  <small>{pick.category}</small>
                  <strong>{pick.name}</strong>
                  <b>{formatNaira(pick.price)}</b>
                </span>
                <i aria-hidden="true">&#8599;</i>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
