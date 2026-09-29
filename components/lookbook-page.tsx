"use client";

import { ResponsiveImage } from "@/components/responsive-image";


import Link from "next/link";
import { fullResolutionImage } from "@/lib/responsive-image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

type Shot = { n: number; title: string; mood: string; note: string; wide?: boolean };

const SHOTS: Shot[] = [
  { n: 13, title: "Heritage bloom", mood: "Occasion", note: "Sculpted sleeves in a rich heritage print." },
  { n: 3, title: "Ember", mood: "Evening", note: "Sequins that catch every light in the room." },
  { n: 8, title: "Coastline", mood: "Resort", note: "Soft lace and a wide brim by the sea." },
  { n: 1, title: "Golden hour tailoring", mood: "Everyday", note: "A printed two-piece made for easy elegance.", wide: true },
  { n: 10, title: "Silver lace", mood: "Occasion", note: "Delicate lace and a crowning gele." },
  { n: 15, title: "Sunset silhouette", mood: "Evening", note: "One sweep of colour, from shoulder to train." },
  { n: 6, title: "Palm avenue", mood: "Resort", note: "Satin panels in emerald and midnight." },
  { n: 9, title: "Primary colour", mood: "Everyday", note: "Tailored blue against a bold backdrop." },
  { n: 11, title: "Noir ribbon", mood: "Evening", note: "A dramatic bow in black and ivory." },
  { n: 14, title: "Sea breeze", mood: "Resort", note: "An airy kaftan that moves with the waves." },
  { n: 2, title: "Street poetry", mood: "Everyday", note: "Denim structure meets city warmth.", wide: true },
  { n: 5, title: "Spotlight", mood: "Evening", note: "Made for the moment all eyes turn." },
  { n: 7, title: "Power & poise", mood: "Everyday", note: "Tailoring that means business, softly." },
  { n: 12, title: "Ribbon study", mood: "Occasion", note: "Movement, captured in satin." },
  { n: 4, title: "Riviera", mood: "Resort", note: "Florals, sunshine and golden hour." },
];

const SKYLINE = [14, 10, 13, 3, 8];
const MOODS = ["All", "Evening", "Occasion", "Resort", "Everyday"];
const src = (n: number) => `/images/toyin/toyinimg-${n}.webp`;
const ease = [0.22, 1, 0.36, 1] as const;

function Lightbox({ list, index, onClose, onMove }: { list: Shot[]; index: number; onClose: () => void; onMove: (step: number) => void }) {
  const shot = list[index];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onMove(1);
      if (event.key === "ArrowLeft") onMove(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [onClose, onMove]);

  return (
    <motion.div className="lb-box" role="dialog" aria-modal="true" aria-label={shot.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <div className="lb-box-inner" onClick={(event) => event.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.img key={shot.n} src={fullResolutionImage(src(shot.n))} alt={shot.title} initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .98 }} transition={{ duration: .35, ease }} />
        </AnimatePresence>
        <div className="lb-box-cap">
          <small>{shot.mood} · {String(index + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}</small>
          <strong>{shot.title}</strong>
          <p>{shot.note}</p>
          <Link prefetch={false} href="/collections" onClick={onClose}>Shop the collection <span aria-hidden="true">&#8599;</span></Link>
        </div>
      </div>
      <button type="button" className="lb-box-btn lb-box-prev" onClick={(event) => { event.stopPropagation(); onMove(-1); }} aria-label="Previous photo">&#8592;</button>
      <button type="button" className="lb-box-btn lb-box-next" onClick={(event) => { event.stopPropagation(); onMove(1); }} aria-label="Next photo">&#8594;</button>
      <button type="button" className="lb-box-close" onClick={onClose} aria-label="Close">&times;</button>
    </motion.div>
  );
}

export function LookbookPage() {
  const reduced = useReducedMotion();
  const [mood, setMood] = useState("All");
  const [viewer, setViewer] = useState<{ list: Shot[]; index: number } | null>(null);
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const gallery = mood === "All" ? SHOTS : SHOTS.filter((shot) => shot.mood === mood);
  const close = useCallback(() => setViewer(null), []);
  const move = useCallback((step: number) => setViewer((value) => (value ? { ...value, index: (value.index + step + value.list.length) % value.list.length } : value)), []);

  const rise = (delay = 0) => ({
    initial: reduced ? false : { opacity: 0, y: 36 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: .3 },
    transition: { duration: .9, delay, ease },
  });

  return (
    <div className="lb">
      {/* Cover */}
      <section className="lb-cover">
        <motion.div className="lb-cover-top" initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, ease }}>
          <span className="lb-kicker"><i aria-hidden="true" />Season 01 · 2026</span>
          <h1>The <em>Lookbook</em></h1>
          <p>Editorial frames and fabric stories — fifteen moments that capture how our pieces live, move and shine.</p>
        </motion.div>
        <div className="lb-skyline" aria-hidden="true">
          {SKYLINE.map((n, index) => (
            <motion.span key={n} className={`lb-sky lb-sky-${index + 1}`} initial={false} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.1, delay: .2 + Math.abs(index - 2) * .12, ease }}>
              <ResponsiveImage src={src(n)} alt="" loading="eager" sizes="(max-width: 640px) 30vw, 20vw" />
            </motion.span>
          ))}
        </div>
        <span className="lb-scroll" aria-hidden="true">Scroll <i /></span>
      </section>

      {/* Mosaic gallery */}
      <section className="lb-gallery">
        <motion.div className="lb-gallery-head" {...rise(0)}>
          <div>
            <span className="lb-kicker lb-kicker-dark"><i aria-hidden="true" />The gallery</span>
            <h2>Every <em>mood,</em> every moment.</h2>
          </div>
          <div className="lb-moods" role="tablist" aria-label="Filter by mood">
            {MOODS.map((item) => (
              <button type="button" role="tab" key={item} aria-selected={mood === item} className={mood === item ? "active" : ""} onClick={() => setMood(item)}>
                {mood === item && <motion.span layoutId="lb-mood-pill" className="lb-mood-pill" transition={{ duration: reduced ? 0 : .4, ease }} />}
                <span>{item}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div layout={!reduced} className="lb-mosaic">
          <AnimatePresence mode="popLayout" initial={false}>
            {gallery.map((shot, index) => (
              <motion.button
                layout={!reduced}
                type="button"
                key={shot.n}
                className={`lb-tile${shot.wide ? " lb-tile-wide" : ""}${index % 5 === 1 ? " lb-tile-tall" : ""}`}
                onClick={() => setViewer({ list: gallery, index })}
                aria-label={`View ${shot.title}`}
                initial={reduced ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: .92, transition: { duration: .25 } }}
                viewport={{ once: true, amount: .15 }}
                transition={{ duration: .7, delay: (index % 4) * .06, ease }}
              >
                <ResponsiveImage src={src(shot.n)} alt="" loading="lazy" />
                <span className="lb-tile-cap">
                  <small>{shot.mood}</small>
                  <strong>{shot.title}</strong>
                </span>
                <i aria-hidden="true">&#10530;</i>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Closing */}
      <motion.section className="lb-end" {...rise(0)}>
        <div className="lb-end-imgs" aria-hidden="true">
          <ResponsiveImage src={src(7)} alt="" loading="lazy" />
          <ResponsiveImage src={src(5)} alt="" loading="lazy" />
        </div>
        <div className="lb-end-copy">
          <span className="lb-kicker"><i aria-hidden="true" />Your turn</span>
          <h2>Found a look <em>you love?</em></h2>
          <p>Every frame is available to shop, with personal styling help on WhatsApp.</p>
          <div className="lb-end-actions">
            <Link prefetch={false} href="/collections" className="lb-btn lb-btn-light">Shop the collection <b aria-hidden="true">&#8594;</b></Link>
            <a href="https://wa.me/916305615898" target="_blank" rel="noreferrer" className="lb-btn lb-btn-ghost">Ask a stylist</a>
          </div>
        </div>
      </motion.section>

      {mounted ? createPortal(
        <AnimatePresence>
          {viewer ? <Lightbox list={viewer.list} index={viewer.index} onClose={close} onMove={move} /> : null}
        </AnimatePresence>,
        document.body,
      ) : null}
    </div>
  );
}
