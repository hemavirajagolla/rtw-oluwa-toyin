"use client";

import { ResponsiveImage } from "@/components/responsive-image";


import Link from "next/link";
import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { useCart } from "@/components/cart-context";
import { useState } from "react";
import { PageMotion } from "@/components/page-motion";
import { type SearchProduct, SiteSearch } from "@/components/site-search";
import { Footer } from "@/components/footer";
import { formatNaira } from "@/lib/currency";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "Story" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/contact", label: "Contact" },
];

function FloatingSocials() {
  return (
    <div className="floating-socials"  aria-label="Social links">
      <a className="floating-social floating-social-whatsapp" href="https://wa.me/916305615898?text=Hello%20RTW%20by%20Elegant%20Moi" target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.5 4.1 1.6 5.9L0 24l6.5-1.7a12 12 0 0 0 5.6 1.4h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.2-3.5-8.4Zm-8.3 18.2h-.1c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.8 9.8 0 1 1 8.5 4.7Zm5.4-7.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2s-.8 1-1 1.2c-.2.2-.4.2-.7.1-1.8-.9-3-1.6-4.2-3.7-.3-.6.3-.5.9-1.8.1-.2 0-.4 0-.6l-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.9 5.2 2.2.9 3 .9 4.1.8.7-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.2-.3-.4-.4-.7-.5Z"/></svg>
        <span>WhatsApp</span>
      </a>
      <a className="floating-social floating-social-instagram" href="https://www.instagram.com/oluwatowin/" target="_blank" rel="noreferrer" aria-label="Follow us on Instagram">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.1 1.5a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6ZM12 7.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8Zm0 2a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8Z"/></svg>
        <span>Instagram</span>
      </a>
    </div>
  );
}

function CartDrawer() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const [open, setOpen] = useState(false);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <button type="button" className="cart-icon-btn" onClick={() => setOpen(true)} aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l2.3 11.2a1.5 1.5 0 0 0 1.5 1.2h8.7a1.5 1.5 0 0 0 1.5-1.1L21 8H6.3" /><circle cx="9.5" cy="20" r="1.3" /><circle cx="17.5" cy="20" r="1.3" /></svg>
        {count > 0 ? <span key={count} className="cart-icon-count">{count}</span> : null}
      </button>

      <>
        {open ? (
          <>
            <button
              type="button"
              aria-label="Close cart"
              className="cart-backdrop"



              onClick={() => setOpen(false)}
            />
            <aside




              className="cart-drawer"
              aria-label="Shopping bag"
         >
            <div className="cart-header">
              <h3>Your bag</h3>
              <button type="button" aria-label="Close cart" onClick={() => setOpen(false)}>
                ×
              </button>
            </div>

            {items.length === 0 ? (
              <div className="cart-empty">
                <p>Your cart is empty.</p>
                <Link prefetch={false} href="/collections" onClick={() => setOpen(false)}>
                  Continue shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {items.map((item) => (
                    <div key={`${item.slug}-${item.size}`} className="cart-item-row">
                      <ResponsiveImage src={item.image} alt={item.name} sizes="80px" />
                      <div>
                        <h4>{item.name}</h4>
                        <p>
                          {item.category} · Size {item.size}
                        </p>
                        <div className="quantity-control">
                          <button type="button" onClick={() => updateQuantity(item.slug, item.size, -1)}>
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.slug, item.size, 1)}>
                            +
                          </button>
                        </div>
                      </div>
                      <div className="cart-item-actions">
                        <strong>{formatNaira(item.price * item.quantity)}</strong>
                        <button type="button" onClick={() => removeItem(item.slug, item.size)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-footer">
                  <div className="totals-row">
                    <span>Subtotal</span>
                    <strong>{formatNaira(subtotal)}</strong>
                  </div>
                  <Link prefetch={false} href="/checkout" className="primary-button full-width" onClick={() => setOpen(false)}>
                    Checkout
                  </Link>
                  <Link prefetch={false} href="/cart" className="cart-view-link" onClick={() => setOpen(false)}>
                    View full bag
                  </Link>
                </div>
              </>
            )}
            </aside>
          </>
        ) : null}
      </>
    </>
  );
}

export function SiteShell({ children, searchIndex = [] }: { children: React.ReactNode; searchIndex?: SearchProduct[] }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = pathname?.startsWith("/admin");



  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="announcement-bar">
        <span>A little culture. A lot of you.</span>
        <Link prefetch={false} href="/collections">Discover the ready-to-wear edit <span aria-hidden="true">→</span></Link>
      </div>
      <header className="site-header">
        <div className="brand-lockup">
          <Link prefetch={false} href="/" className="brand-mark">
            <span className="logo-crop logo-rtw"><ResponsiveImage src="/brand-logo-rtw.webp" alt="RTW by Elegant Moi" width={320} height={232} loading="eager" fetchPriority="high" /></span>
          </Link>
        </div>

        <nav id="main-menu" aria-label="Main menu" className={menuOpen ? "main-nav open" : "main-nav"}>
          {NAV_ITEMS.map((item) => (
            <Link prefetch={false}
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "nav-link active" : "nav-link"}
              onClick={() => setMenuOpen(false)}
         >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="topbar-actions">
          <SiteSearch products={searchIndex} />
          <CartDrawer />
          <button
            type="button"
            className={menuOpen ? "nav-toggle nav-burger open" : "nav-toggle nav-burger"}
            aria-expanded={menuOpen}
            aria-controls="main-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
          </button>
        </div>
      </header>

      <main id="main-content"><PageMotion key={pathname}>{children}</PageMotion></main>

      <Footer />
      <FloatingSocials />
      </MotionConfig>

    </>
  );
}
