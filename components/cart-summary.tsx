"use client";

import { ResponsiveImage } from "@/components/responsive-image";


import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCart } from "@/components/cart-context";
import { formatNaira } from "@/lib/currency";
import { LOWEST_SHIPPING_FEE } from "@/lib/shipping";

type Suggestion = { slug: string; name: string; category: string; price: number; image: string };

const ease = [0.22, 1, 0.36, 1] as const;

export function CartSummary({ suggestions = [] }: { suggestions?: Suggestion[] }) {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const reduced = useReducedMotion();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const picks = suggestions.filter((item) => !items.some((cartItem) => cartItem.slug === item.slug)).slice(0, 4);

  if (items.length === 0) {
    return (
      <section className="co-empty">
        <span aria-hidden="true">&#10022;</span>
        <p className="co-kicker"><i aria-hidden="true" />Your bag</p>
        <h1>Your bag is <em>empty.</em></h1>
        <p>Discover something made to feel like you.</p>
        <Link prefetch={false} href="/collections" className="co-submit">Continue shopping <b aria-hidden="true">&#8594;</b></Link>
      </section>
    );
  }

  return (
    <div className="co cart">
      <header className="co-head">
        <div>
          <span className="co-kicker"><i aria-hidden="true" />Your bag</span>
          <h1>Ready when <em>you are.</em></h1>
        </div>
        <ol className="co-steps" aria-label="Checkout progress">
          <li className="current"><span>1</span>Bag</li>
          <li><span>2</span>Your details</li>
          <li><span>3</span>Confirm on WhatsApp</li>
        </ol>
      </header>

      <div className="co-layout">
        <div className="co-main">
          <div className="cart-list-head">
            <p><b>{count}</b> {count === 1 ? "piece" : "pieces"} in your bag</p>
            <Link prefetch={false} href="/collections" className="co-edit-text">Continue shopping</Link>
          </div>

          <ul className="cart-list">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.li
                  key={`${item.slug}-${item.size}`}
                  layout={!reduced}
                  className="cart-item"
                  initial={reduced ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, transition: { duration: .3 } }}
                  transition={{ duration: .5, ease }}
                >
                  <Link prefetch={false} href={`/products/${item.slug}`} className="cart-item-img"><ResponsiveImage src={item.image} alt={item.name} /></Link>
                  <div className="cart-item-body">
                    <small>{item.category}</small>
                    <Link prefetch={false} href={`/products/${item.slug}`} className="cart-item-name">{item.name}</Link>
                    <span className="cart-item-meta"><em>Size {item.size}</em><em>{formatNaira(item.price)} each</em></span>
                    <div className="cart-item-controls">
                      <div className="cart-qty" role="group" aria-label={`Quantity for ${item.name}`}>
                        <button type="button" onClick={() => updateQuantity(item.slug, item.size, -1)} aria-label="Decrease quantity" disabled={item.quantity <= 1}>&minus;</button>
                        <motion.span key={item.quantity} initial={reduced ? false : { y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{item.quantity}</motion.span>
                        <button type="button" onClick={() => updateQuantity(item.slug, item.size, 1)} aria-label="Increase quantity">+</button>
                      </div>
                      <button type="button" className="cart-remove" onClick={() => removeItem(item.slug, item.size)}>
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" /></svg>
                        Remove
                      </button>
                    </div>
                  </div>
                  <b className="cart-item-total">{formatNaira(item.price * item.quantity)}</b>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <div className="cart-help">
            <span aria-hidden="true">&#10022;</span>
            <p><strong>Not sure about your size?</strong> Our stylists will help before you order.</p>
            <a href="https://wa.me/916305615898" target="_blank" rel="noreferrer">Ask on WhatsApp &#8599;</a>
          </div>
        </div>

        <aside className="co-aside" aria-label="Order summary">
          <div className="co-sum">
            <div className="co-sum-head"><h2>Summary</h2></div>
            <div className="co-sum-rows cart-sum-rows">
              <div><span>Subtotal · {count} {count === 1 ? "piece" : "pieces"}</span><strong>{formatNaira(subtotal)}</strong></div>
              <div><span>Delivery</span><strong className="co-muted">From {formatNaira(LOWEST_SHIPPING_FEE)}, chosen at checkout</strong></div>
              <div className="co-sum-total"><span>Total <small>before delivery</small></span><strong>{formatNaira(subtotal)}</strong></div>
            </div>
            <Link prefetch={false} href="/checkout" className="co-submit">Continue to checkout <span aria-hidden="true">&#8594;</span></Link>
            <p className="co-sum-note">You’ll add your details next, then confirm your order personally with us on WhatsApp.</p>
            <ul className="co-trust">
              <li><span>&#128274;</span>No payment taken on this site</li>
              <li><span>&#10022;</span>Personal confirmation</li>
              <li><span>&#128666;</span>Delivery across Nigeria</li>
            </ul>
          </div>
        </aside>
      </div>

      {picks.length ? (
        <section className="cart-picks" aria-labelledby="cart-picks-title">
          <div className="cart-picks-head">
            <span className="co-kicker cart-kicker-dark"><i aria-hidden="true" />Complete the look</span>
            <h2 id="cart-picks-title">You may <em>also love.</em></h2>
          </div>
          <div className="cart-picks-grid">
            {picks.map((pick, index) => (
              <motion.div key={pick.slug} initial={reduced ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .7, delay: index * .08, ease }}>
                <Link prefetch={false} href={`/products/${pick.slug}`} className="cart-pick">
                  <span className="cart-pick-img"><ResponsiveImage src={pick.image} alt="" loading="lazy" /><i aria-hidden="true">&#8599;</i></span>
                  <small>{pick.category}</small>
                  <strong>{pick.name}</strong>
                  <b>{formatNaira(pick.price)}</b>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="co-bar">
        <div><small>Total</small><strong>{formatNaira(subtotal)}</strong></div>
        <Link prefetch={false} href="/checkout" className="co-submit">Checkout <span aria-hidden="true">&#8594;</span></Link>
      </div>
    </div>
  );
}
