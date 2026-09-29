"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ThankYouPage() {
  const [order, setOrder] = useState<{ reference?: string; name?: string }>({});

  useEffect(() => {
    const stored = window.sessionStorage.getItem("rtw-last-order");
    if (!stored) return;
    try {
      const value = JSON.parse(stored) as { reference?: string; name?: string };
      queueMicrotask(() => setOrder(value));
    } catch {
      window.sessionStorage.removeItem("rtw-last-order");
    }
  }, []);

  return (
    <div className="page-shell order-confirmation-page">
      <section className="order-confirmation" aria-live="polite">
        <div className="confirmation-mark" aria-hidden="true"><span>&#10003;</span></div>
        <p className="section-kicker">Order received</p>
        <h1>Thank you{order.name ? `, ${order.name}` : ""}.</h1>
        <p className="confirmation-lead">We’ve received your order and are delighted you chose RTW by Elegant Moi.</p>
        {order.reference ? <p className="confirmation-reference">Order reference <strong>{order.reference}</strong></p> : null}
        <div className="confirmation-next"><span>01</span><p><strong>Check WhatsApp</strong>Send the prepared order message so our team can confirm availability.</p><span>02</span><p><strong>Receive payment details</strong>We’ll reply with your delivery charge and secure payment instructions.</p><span>03</span><p><strong>Your order is prepared</strong>We’ll keep you updated until your pieces reach you.</p></div>
        <div className="confirmation-actions"><Link href="/collections" className="primary-button">Shop more <span aria-hidden="true">&#8594;</span></Link><Link href="/" className="secondary-button">Return home</Link></div>
        <p className="confirmation-help">Need help? <a href="https://wa.me/916305615898">Chat with us on WhatsApp</a></p>
      </section>
    </div>
  );
}
