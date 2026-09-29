"use client";

import { ResponsiveImage } from "@/components/responsive-image";


import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const MANIFESTO = "We believe fashion should feel personal, feminine and unforgettable — woven from texture, craftsmanship and a deep connection to African identity.";
const GOLD_WORDS = new Set(["personal,", "feminine", "unforgettable", "African", "identity."]);

const VALUES = [
  { icon: "M16 3 27 9v14L16 29 5 23V9l11-6Z M5 9l11 6 11-6 M16 15v14", title: "Heritage craft", text: "Rich colour stories and textile traditions, reimagined for the modern wardrobe." },
  { icon: "M16 4c4 4 6 8 6 12a6 6 0 0 1-12 0c0-4 2-8 6-12Z M10 26h12", title: "Sculpted silhouettes", text: "Refined tailoring that feels expressive without ever becoming loud." },
  { icon: "M27 15c0 7-5 12-11 12H5l3-5A11 11 0 1 1 27 15Z M11 14h10 M11 18h7", title: "Personal styling", text: "One-to-one guidance on WhatsApp, before and after you order." },
];

const STEPS = [
  { title: "Inspiration", text: "Every edit begins with a feeling — a memory of home, a colour, a celebration." },
  { title: "Design", text: "Silhouettes are sketched and refined to flatter, move and last." },
  { title: "Craft", text: "Pieces are finished with care, detail by detail." },
  { title: "Your story", text: "Packed beautifully and delivered to you, ready for your moment." },
];

const HERO_COLS = [[7, 13, 10, 14], [5, 9, 15, 3], [12, 8, 6, 11]];

const STRIP =[3, 13, 10, 14, 9, 15, 12, 5, 6, 8].map((n) => `/images/toyin/toyinimg-${n}.webp`);

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return <motion.span style={{ opacity }} className={GOLD_WORDS.has(word) ? "st-gold" : undefined}>{word} </motion.span>;
}

export function StoryPage() {
  const reduced = useReducedMotion();
  const manifestoRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: manifesto } = useScroll({ target: manifestoRef, offset: ["start 80%", "end 45%"] });
  const { scrollYProgress: steps } = useScroll({ target: stepsRef, offset: ["start 75%", "end 55%"] });
  const lineScale = useTransform(steps, [0, 1], [0, 1]);
  const words = MANIFESTO.split(" ");

  const rise = (delay = 0) => ({
    initial: reduced ? false : { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: .3 },
    transition: { duration: .9, delay, ease },
  });

  return (
    <div className="st">
      {/* Hero */}
      <section className="st-hero">
        <div className="st-hero-copy">
          <motion.span className="st-kicker" {...rise(0)} initial={false}><i aria-hidden="true" />Our story</motion.span>
          <motion.h1 {...rise(.08)} initial={false}>Crafted with <em>African heart</em> and European elegance.</motion.h1>
          <motion.p {...rise(.16)} initial={false}>RTW by Elegant Moi is a luxury African ready-to-wear label shaped by the rhythm of home, the confidence of the everyday and the grace of elevated dressing.</motion.p>
          <motion.div className="st-hero-actions" {...rise(.24)}>
            <Link prefetch={false} href="/collections" className="st-btn st-btn-light">Explore the collection <b aria-hidden="true">&#8594;</b></Link>
            <a href="#st-heritage" className="st-btn st-btn-ghost">Read our story</a>
          </motion.div>
        </div>
        <motion.div className="st-hero-visual" initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease }}>
          <div className="st-cols" aria-hidden="true">
            {HERO_COLS.map((col, colIndex) => (
              <div key={colIndex} className={`st-col st-col-${colIndex + 1}`}>
                <div className="st-col-track">
                  {[...col, ...col].map((n, index) => (
                    <span key={index} className={index % 3 === 1 ? "st-tile st-tile-arch" : "st-tile"}><ResponsiveImage src={`/images/toyin/toyinimg-${n}.webp`} alt="" sizes="(max-width: 640px) 30vw, 180px" loading={index < 2 ? "eager" : "lazy"} /></span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <span className="st-stamp" aria-hidden="true">
            <svg viewBox="0 0 100 100"><defs><path id="st-stamp-path" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" /></defs><text><textPath href="#st-stamp-path">WEAR YOUR OWN STORY &#8226; ELEGANT MOI &#8226; </textPath></text></svg>
            <em>&#10022;</em>
          </span>
        </motion.div>
      </section>

      {/* Manifesto */}
      <section className="st-manifesto" ref={manifestoRef}>
        <span className="st-quote" aria-hidden="true">&ldquo;</span>
        <p aria-label={MANIFESTO}>
          {reduced
            ? words.map((word, index) => <span key={index} className={GOLD_WORDS.has(word) ? "st-gold" : undefined}>{word} </span>)
            : words.map((word, index) => <Word key={index} word={word} progress={manifesto} range={[index / words.length, (index + 1) / words.length]} />)}
        </p>
        <span className="st-sign">— RTW by Elegant Moi</span>
      </section>

      {/* Heritage */}
      <section className="st-heritage" id="st-heritage">
        <div className="st-collage">
          <motion.span className="st-collage-a" {...rise(0)}><ResponsiveImage src="/images/toyin/toyinimg-13.webp" alt="Heritage print gown with sculpted sleeves" loading="lazy" /></motion.span>
          <motion.span className="st-collage-b" {...rise(.15)}><ResponsiveImage src="/images/toyin/toyinimg-10.webp" alt="Lace evening gown" loading="lazy" /></motion.span>
          <motion.span className="st-collage-tag" {...rise(.3)}><b>&#10022;</b>Heritage meets the everyday</motion.span>
        </div>
        <div className="st-heritage-copy">
          <motion.span className="st-kicker st-kicker-dark" {...rise(0)}><i aria-hidden="true" />Heritage meets the everyday</motion.span>
          <motion.h2 {...rise(.08)}>Made to feel <em>like you.</em></motion.h2>
          <motion.p {...rise(.16)}>Our collections are built around sculpted silhouettes, rich colour stories and refined tailoring that feels expressive without ever becoming loud.</motion.p>
          <motion.p {...rise(.22)}>Every piece is intended to move beautifully between special occasions and a more modern, considered wardrobe — so you can wear your story, wherever the day takes you.</motion.p>
          <motion.div className="st-pills" {...rise(.3)}>
            <span>Dresses</span><span>Sets</span><span>Tops</span><span>Skirts</span><span>Evening</span>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="st-values">
        <motion.div className="st-head" {...rise(0)}>
          <span className="st-kicker st-kicker-dark"><i aria-hidden="true" />What we stand for</span>
          <h2>Three things we <em>never compromise.</em></h2>
        </motion.div>
        <div className="st-value-grid">
          {VALUES.map((value, index) => (
            <motion.article key={value.title} className="st-value" {...rise(index * .12)}>
              <span className="st-value-num">{String(index + 1).padStart(2, "0")}</span>
              <svg viewBox="0 0 32 32" aria-hidden="true"><path d={value.icon} /></svg>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="st-process" ref={stepsRef}>
        <motion.div className="st-head st-head-light" {...rise(0)}>
          <span className="st-kicker"><i aria-hidden="true" />The journey</span>
          <h2>From inspiration <em>to you.</em></h2>
        </motion.div>
        <div className="st-steps">
          <span className="st-line" aria-hidden="true"><motion.span style={{ scaleX: reduced ? 1 : lineScale, scaleY: reduced ? 1 : lineScale }} /></span>
          {STEPS.map((step, index) => (
            <motion.div key={step.title} className="st-step" {...rise(index * .12)}>
              <span className="st-dot">{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Photo strip */}
      <section className="st-strip" aria-label="Moments from our collections">
        <div className="st-strip-track">
          {[...STRIP, ...STRIP].map((src, index) => <span key={index}><ResponsiveImage src={src} alt="" loading="lazy" /></span>)}
        </div>
      </section>

      {/* CTA */}
      <motion.section className="st-cta" {...rise(0)}>
        <span className="st-cta-spark" aria-hidden="true">&#10022;</span>
        <h2>Ready to wear <em>your own story?</em></h2>
        <p>Discover the collection, or talk to us for personal styling help.</p>
        <div className="st-hero-actions">
          <Link prefetch={false} href="/collections" className="st-btn st-btn-light">Shop the collection <b aria-hidden="true">&#8594;</b></Link>
          <a href="https://wa.me/916305615898" target="_blank" rel="noreferrer" className="st-btn st-btn-ghost">Chat on WhatsApp</a>
        </div>
      </motion.section>
    </div>
  );
}
