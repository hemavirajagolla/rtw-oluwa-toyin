"use client";

import { ResponsiveImage } from "@/components/responsive-image";


import Link from "next/link";
import { fullResolutionImage, responsiveImage } from "@/lib/responsive-image";
import { type PointerEvent, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCart } from "@/components/cart-context";
import type { Product } from "@/lib/products";
import { formatNaira } from "@/lib/currency";

type Related = { slug: string; name: string; category: string; price: number; image: string; soldOut?: boolean };

const SWATCHES: Record<string, string> = {
  Onyx: "#1d1d1f", Black: "#1d1d1f", "Deep Green": "#1f4d3a", Emerald: "#0f6b4f", Ivory: "#f1e9da",
  Gold: "#c9a24a", Sand: "#d8c3a0", Saffron: "#e3a13a", Terracotta: "#c0582f",
};
const ease = [0.22, 1, 0.36, 1] as const;

export function ProductDetailClient({ product, related = [] }: { product: Product; related?: Related[] }) {
  const { addToCart } = useCart();
  const reduced = useReducedMotion();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "One Size");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [openInfo, setOpenInfo] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);

  const handleAddToCart = () => {
    if (product.soldOut) return;
    addToCart({ slug: product.slug, name: product.name, price: product.price, size: selectedSize, quantity, image: product.images[0], category: product.category });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2600);
  };

  const handleWhatsAppOrder = () => {
    if (product.soldOut) return;
    const message = encodeURIComponent([
      "Hi RTW by Elegant Moi! I would like to order this piece.",
      "",
      `Product: ${product.name}`,
      `Size: ${selectedSize}`,
      ...(selectedColor ? [`Colour: ${selectedColor}`] : []),
      `Quantity: ${quantity}`,
      `Total: ${formatNaira(product.price * quantity)}`,
      "",
      "Please confirm availability and send me the payment details. Thank you!",
    ].join("\n"));
    window.open(`https://wa.me/916305615898?text=${message}`, "_blank", "noopener,noreferrer");
  };

  function onZoomMove(event: PointerEvent<HTMLDivElement>) {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    setZoom({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 });
  }

  function goTo(index: number) {
    const next = (index + product.images.length) % product.images.length;
    setActiveImage(next);
    const rail = railRef.current;
    if (rail && rail.scrollWidth > rail.clientWidth) rail.scrollTo({ left: next * rail.clientWidth, behavior: reduced ? "auto" : "smooth" });
  }

  const info = [
    { title: "Description", body: product.fullDescription || product.shortDescription },
    { title: "Fabric & care", body: product.fabricCare },
    { title: "Delivery & returns", body: "We deliver across Nigeria. Delivery starts from ₦3,000 in Lekki 1, Ikoyi & Victoria Island, and you choose your zone at checkout.", link: { href: "/shipping-returns", label: "Shipping & returns" } },
    { title: "Sizing help", body: "Between sizes or unsure? Message us your usual size and height and we will recommend the best fit.", link: { href: "/size-guide", label: "Open the size guide" } },
  ].filter((item) => item.body);

  const cta = product.soldOut ? "Sold out" : added ? "Added to bag" : "Add to bag";

  return (
    <div className="pd">
      <nav className="pd-crumbs" aria-label="Breadcrumb">
        <Link prefetch={false} href="/">Home</Link><span aria-hidden="true">/</span>
        <Link prefetch={false} href="/collections">Collections</Link><span aria-hidden="true">/</span>
        <Link prefetch={false} href={`/collections/${product.category.toLowerCase()}`}>{product.category}</Link><span aria-hidden="true">/</span>
        <b>{product.name}</b>
      </nav>

      <div className="pd-layout">
        {/* Gallery */}
        <div className="pd-gallery">
          <div className="pd-thumbs" aria-label="Product photos">
            {product.images.map((image, index) => (
              <button key={image} type="button" aria-label={`Show photo ${index + 1}`} aria-pressed={activeImage === index} className={activeImage === index ? "active" : ""} onClick={() => goTo(index)}>
                <ResponsiveImage src={image} alt="" sizes="80px" />
              </button>
            ))}
          </div>

          <div className="pd-stage">
            <div className="pd-main" onPointerMove={onZoomMove} onPointerLeave={() => setZoom(null)}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={activeImage}
                  {...responsiveImage(product.images[activeImage], "(max-width: 760px) 100vw, 50vw")}
                  {...(zoom ? { src: fullResolutionImage(product.images[activeImage]), srcSet: undefined } : {})}
                  loading="lazy"
                  decoding="async"
                  alt={`${product.name}, view ${activeImage + 1}`}
                  initial={reduced ? false : { opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: zoom ? 1.9 : 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: zoom ? .25 : .5, ease }}
                  style={zoom ? { transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
                />
              </AnimatePresence>
              {product.newArrival ? <span className="pd-badge">New in</span> : null}
              {product.soldOut ? <span className="pd-badge pd-badge-sold">Sold out</span> : null}
              <span className="pd-zoom-hint" aria-hidden="true">Hover to zoom</span>
              {product.images.length > 1 ? (
                <>
                  <button type="button" className="pd-arrow pd-arrow-prev" onClick={() => goTo(activeImage - 1)} aria-label="Previous photo">&#8592;</button>
                  <button type="button" className="pd-arrow pd-arrow-next" onClick={() => goTo(activeImage + 1)} aria-label="Next photo">&#8594;</button>
                  <span className="pd-count">{String(activeImage + 1).padStart(2, "0")} / {String(product.images.length).padStart(2, "0")}</span>
                </>
              ) : null}
            </div>

            <div className="pd-rail" ref={railRef} onScroll={(event) => { const el = event.currentTarget; const index = Math.round(el.scrollLeft / el.clientWidth); if (index !== activeImage) setActiveImage(index); }}>
              {product.images.map((image, index) => <ResponsiveImage key={image} src={image} alt={`${product.name}, view ${index + 1}`} portrait sizes="100vw" fetchPriority={index === 0 ? "high" : "auto"} loading={index === 0 ? "eager" : "lazy"} />)}
            </div>
            <div className="pd-dots" aria-hidden="true">
              {product.images.map((image, index) => <span key={image} className={activeImage === index ? "active" : ""} />)}
            </div>
          </div>
        </div>

        {/* Details */}
        <motion.aside className="pd-panel" initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease }}>
          <span className="pd-kicker"><i aria-hidden="true" />{product.category}</span>
          <h1>{product.name}</h1>
          <div className="pd-price-row">
            <span className="pd-price">{formatNaira(product.price)}</span>
            <span className={`pd-stock${product.soldOut ? " out" : ""}`}><i />{product.soldOut ? "Sold out" : "Available to order"}</span>
          </div>
          <p className="pd-lead">{product.shortDescription}</p>

          {product.colors.length ? (
            <div className="pd-opt">
              <div className="pd-opt-head"><span>Colour</span><b>{selectedColor}</b></div>
              <div className="pd-colors">
                {product.colors.map((color) => (
                  <button key={color} type="button" aria-label={color} aria-pressed={selectedColor === color} className={selectedColor === color ? "active" : ""} onClick={() => setSelectedColor(color)}>
                    <i style={{ background: SWATCHES[color] ?? "#bbb" }} />
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="pd-opt">
            <div className="pd-opt-head"><span>Size</span><Link prefetch={false} href="/size-guide">Size guide &#8599;</Link></div>
            <div className="pd-sizes">
              {product.sizes.map((size) => (
                <button key={size} type="button" aria-pressed={selectedSize === size} className={selectedSize === size ? "active" : ""} onClick={() => setSelectedSize(size)}>{size}</button>
              ))}
            </div>
          </div>

          <div className="pd-buy">
            <div className="pd-qty" role="group" aria-label="Quantity">
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity <= 1} aria-label="Decrease quantity">&minus;</button>
              <motion.span key={quantity} initial={reduced ? false : { y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{quantity}</motion.span>
              <button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label="Increase quantity">+</button>
            </div>
            <button type="button" className={`pd-add${added ? " added" : ""}`} onClick={handleAddToCart} disabled={product.soldOut}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={cta} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: .25 }}>
                  {added ? "✓ " : ""}{cta}{!added && !product.soldOut ? ` · ${formatNaira(product.price * quantity)}` : ""}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
          <div className="pd-secondary">
            <button type="button" className="pd-wa" onClick={handleWhatsAppOrder} disabled={product.soldOut}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.5 4.1 1.6 5.9L0 24l6.5-1.7a12 12 0 0 0 5.6 1.4h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.2-3.5-8.4Z" /></svg>
              Order on WhatsApp
            </button>
            <AnimatePresence>
              {added ? (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  <Link prefetch={false} href="/cart" className="pd-viewbag">View bag &#8594;</Link>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <ul className="pd-perks">
            <li><span>&#128666;</span>Delivery across Nigeria</li>
            <li><span>&#10022;</span>Personal styling help</li>
            <li><span>&#128274;</span>Confirmed with you on WhatsApp</li>
          </ul>

          <div className="pd-info">
            {info.map((item, index) => {
              const open = openInfo === index;
              return (
                <div key={item.title} className={`pd-info-item${open ? " open" : ""}`}>
                  <button type="button" aria-expanded={open} onClick={() => setOpenInfo(open ? -1 : index)}>
                    <span>{item.title}</span><i aria-hidden="true" />
                  </button>
                  <AnimatePresence initial={false}>
                    {open ? (
                      <motion.div className="pd-info-body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .35, ease }}>
                        <p>{item.body}</p>
                        {item.link ? <Link prefetch={false} href={item.link.href}>{item.link.label} &#8599;</Link> : null}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.aside>
      </div>

      {related.length ? (
        <section className="pd-related" aria-labelledby="pd-related-title">
          <div className="pd-related-head">
            <div>
              <span className="pd-kicker pd-kicker-dark"><i aria-hidden="true" />Complete the look</span>
              <h2 id="pd-related-title">You may <em>also love.</em></h2>
            </div>
            <Link prefetch={false} href="/collections" className="pd-textlink">View all &#8594;</Link>
          </div>
          <div className="pd-related-grid">
            {related.map((item, index) => (
              <motion.div key={item.slug} initial={reduced ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .7, delay: index * .08, ease }}>
                <Link prefetch={false} href={`/products/${item.slug}`} className="cart-pick">
                  <span className="cart-pick-img"><ResponsiveImage src={item.image} alt="" loading="lazy" />{item.soldOut ? <span className="sold-tag">Sold out</span> : null}<i aria-hidden="true">&#8599;</i></span>
                  <small>{item.category}</small>
                  <strong>{item.name}</strong>
                  <b>{formatNaira(item.price)}</b>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="pd-bar">
        <div><small>{product.name}</small><strong>{formatNaira(product.price * quantity)}</strong></div>
        <button type="button" className={`pd-add${added ? " added" : ""}`} onClick={handleAddToCart} disabled={product.soldOut}>{added ? "✓ Added" : product.soldOut ? "Sold out" : `Add · ${selectedSize}`}</button>
      </div>
    </div>
  );
}
