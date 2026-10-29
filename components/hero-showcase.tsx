"use client";

import { ResponsiveImage } from "@/components/responsive-image";


import Link from "next/link";
import { responsiveImage } from "@/lib/responsive-image";
import { type CSSProperties, useRef, useState } from "react";
import { formatNaira } from "@/lib/currency";
import type { HeroSlide } from "@/lib/hero-slides";


const marquee = ["Luxury African ready-to-wear", "Delivery across Nigeria", "Styling on WhatsApp", "Made to be remembered", "New season now live"];

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  return <>{to}{suffix}</>;
}

function Words({ text, delay, className }: { text: string; delay: number; className?: string }) {
  return (
    <span className={className}>
      {text.split(" ").map((word, index) => (
        <span className="lux-word" key={`${word}-${index}`}>
          <span style={{ animationDelay: `${delay + index * .07}s` }}>{word}</span>
        </span>
      ))}
    </span>
  );
}

export function HeroShowcase({ slides, pieceCount }: { slides: HeroSlide[]; pieceCount: number }) {
  const [active, setActive] = useState(0);
  const [changed, setChanged] = useState(false);
  const [previous, setPrevious] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);
  const slide = slides[active];

  const go = (index: number) => {
    const next = (index + slides.length) % slides.length;
    if (next === active) return;
    setChanged(true);
    setPrevious(active);
    setActive(next);
  };

  if (!slide) return null;

  return (
    <section
      className={`lux-hero${changed ? " lux-animate" : ""}`}
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
          <div className="lux-eyebrow">
            <span className="lux-pulse" />
            <span key={slide.kicker} className="lux-in-fade">{slide.kicker}</span>
            <b>{String(active + 1).padStart(2, "0")} <i>/ {String(slides.length).padStart(2, "0")}</i></b>
          </div>

          <p className="lux-quote">
            <span aria-hidden="true">&ldquo;</span>Design for a woman who owns every moment.<span aria-hidden="true">&rdquo;</span>
          </p>

          <div key={slide.title} className="lux-copy-swap">
              <h1>
                <Words text={slide.title} delay={.05} />
                <Words text={slide.accent} delay={.2} className="lux-accent" />
              </h1>
              <p className="lux-in-rise">{slide.copy}</p>
          </div>

          <div className="lux-actions">
            <Link prefetch={false} href={slide.href} className="lux-btn lux-btn-primary">Discover the edit <span aria-hidden="true">&#8594;</span></Link>
            <Link prefetch={false} href="/collections" className="lux-btn lux-btn-ghost">Shop all</Link>
          </div>

          <div className="lux-proof">
            <span className="lux-proof-faces" aria-hidden="true">{slides.slice(0, 3).map((item) => <ResponsiveImage key={item.product.slug} src={item.image} alt="" sizes="36px" />)}</span>
            <span><strong><CountUp to={10} suffix="K+" /></strong> clients styled worldwide</span>
          </div>

          <dl className="lux-stats">
            <div><dt>Happy clients</dt><dd><CountUp to={10} suffix="K+" /></dd></div>
            <div><dt>{pieceCount === 1 ? "Curated piece" : "Curated pieces"}</dt><dd><CountUp to={pieceCount} /></dd></div>
            <div><dt>Ships to</dt><dd><CountUp to={30} suffix="+" /><small>countries</small></dd></div>
          </dl>
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
            <span key={active} className="lux-bignum lux-in-rise" aria-hidden="true">{String(active + 1).padStart(2, "0")}</span>
            <div className="lux-arch">
              {previous !== null ? <img key={`prev-${slides[previous].image}`} {...responsiveImage(slides[previous].image, "(max-width: 560px) 270px, (max-width: 900px) 440px, 36vw")} alt="" aria-hidden="true" className="lux-arch-img lux-arch-prev" style={slides[previous].focus ? { objectPosition: slides[previous].focus } : undefined} /> : null}
              <img
                  key={slide.image}
                  {...responsiveImage(slide.image, "(max-width: 560px) 270px, (max-width: 900px) 440px, 36vw")}
                  alt={`${slide.kicker}: ${slide.title} ${slide.accent}`}
                  style={slide.focus ? { objectPosition: slide.focus } : undefined}
                  loading={active === 0 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={active === 0 ? "high" : "auto"}
                  className="lux-arch-img"
                />
              <span className="lux-arch-shine" aria-hidden="true" />
                <div key={slide.product.slug} className="lux-hotspot lux-in-pop" style={{ left: `${slide.spot.x}%`, top: `${slide.spot.y}%` }}>
                  <Link prefetch={false} href={`/products/${slide.product.slug}`} aria-label={`Shop ${slide.product.name}`}>
                    <i aria-hidden="true" />
                    <span>{slide.product.name}<b>{slide.product.soldOut ? "Sold out" : formatNaira(slide.product.price)}</b></span>
                  </Link>
                </div>
            </div>

            <svg className="lux-badge" viewBox="0 0 120 120" aria-hidden="true">
              <defs><path id="lux-badge-circle" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" /></defs>
              <text><textPath href="#lux-badge-circle">WEAR YOUR OWN STORY &#8226; RTW ATELIER &#8226; </textPath></text>
              <circle cx="60" cy="60" r="20" />
              <path d="M52 68 68 52M56 52h12v12" />
            </svg>

            <div className="lux-look-wrap">
                <div key={slide.product.slug} className="lux-look-tilt lux-in-card">
                  <Link prefetch={false} href={`/products/${slide.product.slug}`} className="lux-look">
                    <span className="lux-look-img">
                      <ResponsiveImage src={slide.product.image} sizes="120px" alt="" loading="lazy" decoding="async" />
                      <em>{slide.product.soldOut ? "Sold out" : "Shop the look"}</em>
                    </span>
                    <span className="lux-look-info">
                      <strong>{slide.product.name}</strong>
                      <span className="lux-look-meta">
                        <span className="lux-swatches">
                          {slide.product.colors.map(([name, hex]) => <i key={hex} title={name} style={{ background: hex }} />)}
                        </span>
                        <b>{slide.product.soldOut ? "Sold out" : formatNaira(slide.product.price)}</b>
                      </span>
                    </span>
                  </Link>
                </div>
            </div>
          </div>

          <div className="lux-thumbs" role="tablist" aria-label="Choose a collection">
            {slides.map((item, index) => (
              <button type="button" role="tab" key={item.product.slug} aria-selected={active === index} aria-label={`Show ${item.kicker}`}className={active === index ? "active" : ""} onClick={() => go(index)}>
                <ResponsiveImage src={item.image} alt="" sizes="60px" loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lux-tabs">
        {slides.map((item, index) => (
          <button type="button" key={item.product.slug} className={active === index ? "active" : ""} onClick={() => go(index)} aria-label={`Show ${item.kicker}`}>
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
