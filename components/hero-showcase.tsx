"use client";

import { ResponsiveImage } from "@/components/responsive-image";


import Link from "next/link";
import { responsiveImage } from "@/lib/responsive-image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { type CSSProperties, useRef, useState } from "react";
import { formatNaira } from "@/lib/currency";

const slides = [
  { tab: "Occasion", kicker: "Occasion Wear", title: "Arrive with", accent: "confidence.", copy: "Statement details and fluid shapes for every unforgettable entrance you are about to make.", image: "/images/toyin/toyinimg-5.webp", href: "/lookbook", glow: "#d9a24a", product: { name: "Kente Pleat Skirt", price: 140, slug: "kente-pleat-skirt", image: "/images/toyin/toyinimg-6.webp", colors: [["Saffron", "#e3a13a"], ["Terracotta", "#c0582f"]] }, spot: { x: 62, y: 58 } },
  { tab: "Evening", kicker: "The Evening Edit", title: "Made for", accent: "the spotlight.", copy: "Sequins, sculpted silhouettes and fearless colour. Eveningwear designed to be remembered long after the night ends.", image: "/images/toyin/toyinimg-10.webp", href: "/collections/evening", glow: "#e0842c", product: { name: "Noir Evening Gown", price: 260, slug: "noir-evening-gown", image: "/images/toyin/toyinimg-11.webp", colors: [["Onyx", "#1d1d1f"], ["Deep Green", "#1f4d3a"]] }, spot: { x: 44, y: 66 } },
  { tab: "Resort", kicker: "Resort Collection", title: "Sun-kissed", accent: "and effortless.", copy: "Airy layers and soft lace that move with the breeze, from the shoreline to sunset dinners.", image: "/images/toyin/toyinimg-14.webp", href: "/collections/tops", glow: "#6fc2ba", product: { name: "Ivory Strap Top", price: 115, slug: "ivory-strap-top", image: "/images/toyin/toyinimg-8.webp", crop: "center 38%", colors: [["Ivory", "#f1e9da"]] }, spot: { x: 56, y: 50 } },
  { tab: "New in", kicker: "New Season", title: "Wear your", accent: "own story.", copy: "Heritage prints reimagined with modern tailoring. Considered pieces that celebrate who you are.", image: "/images/toyin/toyinimg-13.webp", href: "/collections/dresses", glow: "#d8434f", product: { name: "Emerald Ruched Dress", price: 180, slug: "emerald-ruched-dress", image: "/images/toyin/toyinimg-15.webp", colors: [["Emerald", "#0f6b4f"]] }, spot: { x: 50, y: 62 } },
];

const marquee = ["Luxury African ready-to-wear", "Delivery across Nigeria", "Styling on WhatsApp", "Made to be remembered", "New season now live"];
const ease = [0.22, 1, 0.36, 1] as const;

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  return <>{to}{suffix}</>;
}

function Words({ text, delay, className }: { text: string; delay: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <span className={className}>
      {text.split(" ").map((word, index) => (
        <span className="lux-word" key={`${word}-${index}`}>
          <motion.span initial={false} animate={{ y: 0 }} exit={reduced ? undefined : { y: "-110%", transition: { duration: .35, delay: index * .03, ease } }} transition={{ duration: .8, delay: delay + index * .07, ease }}>{word}</motion.span>
        </span>
      ))}
    </span>
  );
}

export function HeroShowcase() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const touchX = useRef<number | null>(null);
  const slide = slides[active];

  const go = (index: number) => setActive((index + slides.length) % slides.length);

  return (
    <section
      className={`lux-hero${reduced ? " is-static" : ""}`}
      style={{ "--glow": slide.glow } as CSSProperties}
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      <div className="lux-hero-bg" aria-hidden="true">
        <span className="lux-orb lux-orb-a" />
        <span className="lux-orb lux-orb-b" />
        <span className="lux-orb lux-orb-c" />
        <span className="lux-grid" />
      </div>

      <div className="lux-hero-inner">
        <div className="lux-hero-copy">
          <motion.div className="lux-eyebrow" initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, ease }}>
            <span className="lux-pulse" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={slide.kicker} initial={false} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .35 }}>{slide.kicker}</motion.span>
            </AnimatePresence>
            <b>{String(active + 1).padStart(2, "0")} <i>/ {String(slides.length).padStart(2, "0")}</i></b>
          </motion.div>

          <motion.p className="lux-quote" initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .15, ease }}>
            <span aria-hidden="true">&ldquo;</span>Design for a woman who owns every moment.<span aria-hidden="true">&rdquo;</span>
          </motion.p>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={slide.title} className="lux-copy-swap" exit={{ opacity: reduced ? 0 : 1 }} transition={{ duration: .4 }}>
              <h1>
                <Words text={slide.title} delay={.05} />
                <Words text={slide.accent} delay={.2} className="lux-accent" />
              </h1>
              <motion.p initial={false} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10, transition: { duration: .3 } }} transition={{ duration: .6, delay: .35, ease }}>{slide.copy}</motion.p>
            </motion.div>
          </AnimatePresence>

          <motion.div className="lux-actions" initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .5, ease }}>
            <Link prefetch={false} href={slide.href} className="lux-btn lux-btn-primary">Discover the edit <span aria-hidden="true">&#8594;</span></Link>
            <Link prefetch={false} href="/collections" className="lux-btn lux-btn-ghost">Shop all</Link>
          </motion.div>

          <motion.div className="lux-proof" initial={false} animate={{ opacity: 1 }} transition={{ duration: .8, delay: .7 }}>
            <span className="lux-proof-faces" aria-hidden="true">{slides.slice(0, 3).map((item) => <ResponsiveImage key={item.image} src={item.image} alt="" sizes="36px" />)}</span>
            <span><strong><CountUp to={10} suffix="K+" /></strong> clients styled worldwide</span>
          </motion.div>

          <motion.dl className="lux-stats" initial={false} animate={{ opacity: 1 }} transition={{ duration: .8, delay: .7 }}>
            <div><dt>Happy clients</dt><dd><CountUp to={10} suffix="K+" /></dd></div>
            <div><dt>Curated looks</dt><dd><CountUp to={15} /></dd></div>
            <div><dt>Ships to</dt><dd><CountUp to={30} suffix="+" /><small>countries</small></dd></div>
          </motion.dl>
        </div>

        <div
          className="lux-hero-visual"
          onTouchStart={(event) => { touchX.current = event.touches[0].clientX; }}
          onTouchEnd={(event) => {
            if (touchX.current === null) return;
            const delta = event.changedTouches[0].clientX - touchX.current;
            if (Math.abs(delta) > 45) go(active + (delta < 0 ? 1 : -1));
            touchX.current = null;
          }}
        >
          <span className="lux-spark lux-spark-a" aria-hidden="true">&#10022;</span>
          <span className="lux-spark lux-spark-b" aria-hidden="true">&#10022;</span>
          <span className="lux-spark lux-spark-c" aria-hidden="true">&#10022;</span>

          <div className="lux-stage">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={active} className="lux-bignum" aria-hidden="true" initial={false} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: .6, ease }}>{String(active + 1).padStart(2, "0")}</motion.span>
            </AnimatePresence>
            <motion.div className="lux-arch" initial={false} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease }}>
              <AnimatePresence initial={false}>
                <motion.img
                  key={slide.image}
                  {...responsiveImage(slide.image, "(max-width: 640px) 80vw, 40vw")}
                  alt={`${slide.kicker}: ${slide.title} ${slide.accent}`}
                  loading={active === 0 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={active === 0 ? "high" : "auto"}
                  initial={false}
                  animate={reduced ? { opacity: 1, zIndex: 1 } : { clipPath: "inset(0% 0% 0% 0%)", scale: 1.04, zIndex: 1 }}
                  exit={{ zIndex: 0, scale: 1.1 }}
                  transition={{ duration: reduced ? .2 : 1.1, ease }}
                />
              </AnimatePresence>
              <span className="lux-arch-shine" aria-hidden="true" />
              <AnimatePresence initial={false}>
                <motion.div key={slide.product.slug} className="lux-hotspot" style={{ left: `${slide.spot.x}%`, top: `${slide.spot.y}%` }} initial={false} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .4 }} transition={{ duration: .45, delay: .9, ease }}>
                  <Link prefetch={false} href={`/products/${slide.product.slug}`} aria-label={`Shop ${slide.product.name}`}>
                    <i aria-hidden="true" />
                    <span>{slide.product.name}<b>{formatNaira(slide.product.price)}</b></span>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.svg className="lux-badge" viewBox="0 0 120 120" aria-hidden="true">
              <defs><path id="lux-badge-circle" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" /></defs>
              <text><textPath href="#lux-badge-circle">WEAR YOUR OWN STORY &#8226; RTW ATELIER &#8226; </textPath></text>
              <circle cx="60" cy="60" r="20" />
              <path d="M52 68 68 52M56 52h12v12" />
            </motion.svg>

            <motion.div className="lux-look-wrap">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={slide.product.slug} initial={false} animate={{ opacity: 1, y: 0, rotate: -5 }} exit={{ opacity: 0, y: -16, rotate: -2 }} transition={{ duration: .7, delay: .3, ease }}>
                  <Link prefetch={false} href={`/products/${slide.product.slug}`} className="lux-look">
                    <span className="lux-look-img">
                      <ResponsiveImage src={slide.product.image} sizes="120px" alt="" loading="lazy" decoding="async" style={"crop" in slide.product ? { objectPosition: slide.product.crop } : undefined} />
                      <em>Shop the look</em>
                    </span>
                    <span className="lux-look-info">
                      <strong>{slide.product.name}</strong>
                      <span className="lux-look-meta">
                        <span className="lux-swatches">
                          {slide.product.colors.map(([name, hex]) => <i key={name} title={name} style={{ background: hex }} />)}
                        </span>
                        <b>{formatNaira(slide.product.price)}</b>
                      </span>
                    </span>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="lux-thumbs" role="tablist" aria-label="Choose a collection">
            {slides.map((item, index) => (
              <button type="button" role="tab" key={item.image} aria-selected={active === index} aria-label={`Show ${item.kicker}`}className={active === index ? "active" : ""} onClick={() => go(index)}>
                <ResponsiveImage src={item.image} alt="" loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lux-tabs">
        {slides.map((item, index) => (
          <button type="button" key={item.tab} className={active === index ? "active" : ""} onClick={() => go(index)} aria-label={`Show ${item.kicker}`}>
            <span className="lux-tab-label"><em>{String(index + 1).padStart(2, "0")}</em>{item.tab}</span>
            <span className="lux-tab-track">
              {active === index && <span className="lux-tab-fill" />}
            </span>
          </button>
        ))}
      </div>

      <div className="lux-marquee" aria-hidden="true">
        <div>
          {[0, 1].map((copy) => (
            <span key={copy}>{marquee.map((item) => <span key={item}>{item}<i>&#10022;</i></span>)}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
