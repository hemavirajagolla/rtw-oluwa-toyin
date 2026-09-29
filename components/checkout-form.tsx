"use client";

import { ResponsiveImage } from "@/components/responsive-image";


import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useCart } from "@/components/cart-context";
import { formatNaira } from "@/lib/currency";
import { DEFAULT_SHIPPING_ZONE, SHIPPING_ZONES, getShippingZone } from "@/lib/shipping";

const WHATSAPP_NUMBER = "+916305615898";

const initialForm = {
  email: "",
  emailOffers: false,
  firstName: "",
  lastName: "",
  company: "",
  address: "",
  apartment: "",
  city: "",
  state: "",
  postcode: "",
  country: "Nigeria",
  phone: "",
  saveInformation: false,
  textOffers: false,
  shippingMethod: DEFAULT_SHIPPING_ZONE as string,
  paymentMethod: "bank-transfer",
  billingAddress: "same",
  billingAddressLine: "",
  billingCity: "",
  billingState: "",
  billingPostcode: "",
  note: "",
};

type CheckoutFormState = typeof initialForm;

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState<CheckoutFormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const stored = window.localStorage.getItem("rtw-checkout-details");
    if (!stored) return;
    try {
      const saved = JSON.parse(stored) as Partial<CheckoutFormState>;
      // Older saved details may hold a non-Nigerian country or a retired shipping option, so reset both.
      queueMicrotask(() => setForm((current) => ({ ...current, ...saved, country: "Nigeria", shippingMethod: getShippingZone(saved.shippingMethod ?? "").id, saveInformation: true })));
    } catch {
      window.localStorage.removeItem("rtw-checkout-details");
    }
  }, []);

  const orderReference = useMemo(() => {
    const now = new Date();
    const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
    return `RTW-${stamp}`;
  }, []);

  const shipping = getShippingZone(form.shippingMethod);
  const total = subtotal + shipping.fee;

  if (items.length === 0) {
    return <section className="co-empty"><span aria-hidden="true">&#10022;</span><p className="co-kicker"><i aria-hidden="true" />Your bag</p><h1>Your bag is <em>empty.</em></h1><p>Discover something made to feel like you.</p><Link prefetch={false} href="/collections" className="co-submit">Continue shopping <b aria-hidden="true">&#8594;</b></Link></section>;
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Enter a valid email address.";
    if (!form.firstName.trim()) nextErrors.firstName = "Enter a first name.";
    if (!form.lastName.trim()) nextErrors.lastName = "Enter a last name.";
    if (!form.address.trim()) nextErrors.address = "Enter an address.";
    if (!form.city.trim()) nextErrors.city = "Enter a city.";
    if (!form.state.trim()) nextErrors.state = "Enter a state.";
    if (!form.postcode.trim()) nextErrors.postcode = "Enter a postal code.";
    if (!form.phone.trim()) nextErrors.phone = "Enter a phone number.";
    if (form.billingAddress === "different") {
      if (!form.billingAddressLine.trim()) nextErrors.billingAddressLine = "Enter a billing address.";
      if (!form.billingCity.trim()) nextErrors.billingCity = "Enter a billing city.";
      if (!form.billingState.trim()) nextErrors.billingState = "Enter a billing state.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      window.setTimeout(() => document.querySelector<HTMLElement>(".field-error")?.closest("label")?.querySelector("input, select")?.scrollIntoView({ behavior: "smooth", block: "center" }), 0);
      return;
    }

    const paymentLabel = "Bank deposit";
    const address = [form.address, form.apartment, form.city, form.state, form.postcode, form.country].filter(Boolean).join(", ");
    const messageLines = [
      "Hello RTW by Elegant Moi! I would like to place this order.",
      "",
      `Order reference: ${orderReference}`,
      "",
      ...items.map((item, index) => `${index + 1}. ${item.name} — Size ${item.size} × ${item.quantity} — ${formatNaira(item.price * item.quantity)}`),
      "",
      `Subtotal: ${formatNaira(subtotal)}`,
      `Delivery (${shipping.label}): ${formatNaira(shipping.fee)}`,
      `Order total: ${formatNaira(total)}`,
      "",
      `Customer: ${form.firstName} ${form.lastName}`,
      `Company: ${form.company || "Not provided"}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Delivery address: ${address}`,
      `Payment: ${paymentLabel}`,
      `Billing: ${form.billingAddress === "same" ? "Same as delivery address" : `${form.billingAddressLine}, ${form.billingCity}, ${form.billingState}, ${form.billingPostcode}`}`,
      `Order note: ${form.note || "No note"}`,
      "",
      "Please confirm my order and send the bank details for payment. Thank you.",
    ];

    if (form.saveInformation) {
      const saved = { ...form, shippingMethod: DEFAULT_SHIPPING_ZONE, paymentMethod: "bank-transfer", billingAddress: "same", billingAddressLine: "", billingCity: "", billingState: "", billingPostcode: "", note: "" };
      window.localStorage.setItem("rtw-checkout-details", JSON.stringify(saved));
    } else {
      window.localStorage.removeItem("rtw-checkout-details");
    }

    window.sessionStorage.setItem("rtw-last-order", JSON.stringify({ reference: orderReference, name: form.firstName }));
    const whatsappText = encodeURIComponent(messageLines.join("\n"));
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${whatsappText}`, "_blank", "noopener,noreferrer");
    clearCart();
    router.push("/thank-you");
  };

  const onChange = <Field extends keyof CheckoutFormState>(field: Field, value: CheckoutFormState[Field]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const error = (field: string) => errors[field] ? <small className="field-error">{errors[field]}</small> : null;
  const req = <b className="co-req" aria-hidden="true">*</b>;

  const required: (keyof CheckoutFormState)[] = ["email", "firstName", "lastName", "address", "city", "state", "postcode", "phone"];
  const done = required.filter((field) => String(form[field]).trim()).length;
  const pct = Math.round((done / required.length) * 100);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const editBag = (
    <Link prefetch={false} href="/cart" className="co-edit" aria-label="Edit bag" title="Edit bag">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4Z" /><path d="m13.5 6.5 4 4" /></svg>
    </Link>
  );

  const summary = (
    <>
      <div className="co-sum-items">
        {items.map((item) => (
          <div key={`${item.slug}-${item.size}`} className="co-sum-item">
            <span className="co-sum-img"><ResponsiveImage src={item.image} alt="" sizes="80px" /></span>
            <span className="co-sum-text">
              <strong>{item.name}</strong>
              <small>Size {item.size} · Qty {item.quantity}</small>
            </span>
            <span className="co-sum-price">
              <b>{formatNaira(item.price * item.quantity)}</b>
              {item.quantity > 1 ? <small>{formatNaira(item.price)} each</small> : null}
            </span>
          </div>
        ))}
      </div>
      <div className="co-sum-rows">
        <div><span>Subtotal · {count} {count === 1 ? "piece" : "pieces"}</span><strong>{formatNaira(subtotal)}</strong></div>
        <div><span>Delivery</span><strong>{formatNaira(shipping.fee)}</strong></div>
        <div className="co-sum-total"><span>Total</span><strong>{formatNaira(total)}</strong></div>
      </div>
    </>
  );

  return (
    <form className="co" onSubmit={handleSubmit} noValidate>
      <header className="co-head">
        <div>
          <span className="co-kicker"><i aria-hidden="true" />Secure checkout</span>
          <h1>Complete your <em>order.</em></h1>
        </div>
        <ol className="co-steps" aria-label="Checkout progress">
          <li className="done"><span>&#10003;</span>Bag</li>
          <li className="current"><span>2</span>Your details</li>
          <li><span>3</span>Confirm on WhatsApp</li>
        </ol>
        <div className="co-progress" aria-label={`Details ${pct}% complete`}><span style={{ width: `${pct}%` }} /><small>{pct}% complete</small></div>
      </header>

      <div className="co-layout">
        <div className="co-main">
          <details className="co-mobile-sum">
            <summary><span>Order summary · {count} {count === 1 ? "piece" : "pieces"}</span><strong>{formatNaira(total)}</strong></summary>
            <div className="co-mobile-sum-body">{summary}<Link prefetch={false} href="/cart" className="co-edit-text">Edit bag</Link></div>
          </details>

          <section className="co-card co-card-compact">
            <div className="co-card-head"><span className="co-num">01</span><div><h2>Contact</h2><p>Fields marked <b className="co-req">*</b> are required.</p></div></div>
            <div className="co-contact-row">
              <label className="checkout-field co-field"><span>Email{req}</span><input type="email" required autoComplete="email" value={form.email} onChange={(event) => onChange("email", event.target.value)} placeholder="you@example.com" aria-invalid={!!errors.email} />{error("email")}</label>
              <label className="co-check"><input type="checkbox" checked={form.emailOffers} onChange={(event) => onChange("emailOffers", event.target.checked)} /><i aria-hidden="true" /><span>Email me new collections and offers</span></label>
            </div>
          </section>

          <section className="co-card">
            <div className="co-card-head"><span className="co-num">02</span><div><h2>Delivery</h2><p>We deliver within Nigeria only.</p></div></div>
            <div className="co-grid">
              <label className="checkout-field co-field"><span>First name{req}</span><input autoComplete="given-name" required value={form.firstName} onChange={(event) => onChange("firstName", event.target.value)} placeholder="First name" aria-invalid={!!errors.firstName} />{error("firstName")}</label>
              <label className="checkout-field co-field"><span>Last name{req}</span><input autoComplete="family-name" required value={form.lastName} onChange={(event) => onChange("lastName", event.target.value)} placeholder="Last name" aria-invalid={!!errors.lastName} />{error("lastName")}</label>
              <label className="checkout-field co-field full"><span>Address{req}</span><input autoComplete="address-line1" required value={form.address} onChange={(event) => onChange("address", event.target.value)} placeholder="Street and house number" aria-invalid={!!errors.address} />{error("address")}</label>
              <label className="checkout-field co-field"><span>Apartment, suite <i>optional</i></span><input autoComplete="address-line2" value={form.apartment} onChange={(event) => onChange("apartment", event.target.value)} placeholder="Apartment, suite, landmark" /></label>
              <label className="checkout-field co-field"><span>Postal code{req}</span><input autoComplete="postal-code" required value={form.postcode} onChange={(event) => onChange("postcode", event.target.value)} placeholder="Postal code" aria-invalid={!!errors.postcode} />{error("postcode")}</label>
              <label className="checkout-field co-field"><span>City{req}</span><input autoComplete="address-level2" required value={form.city} onChange={(event) => onChange("city", event.target.value)} placeholder="City" aria-invalid={!!errors.city} />{error("city")}</label>
              <label className="checkout-field co-field"><span>State{req}</span><input autoComplete="address-level1" required value={form.state} onChange={(event) => onChange("state", event.target.value)} placeholder="e.g. Lagos" aria-invalid={!!errors.state} />{error("state")}</label>
              <label className="checkout-field co-field"><span>Phone{req}</span><input type="tel" autoComplete="tel" required value={form.phone} onChange={(event) => onChange("phone", event.target.value)} placeholder="+234 800 000 0000" aria-invalid={!!errors.phone} />{error("phone")}</label>
              <label className="checkout-field co-field"><span>Company <i>optional</i></span><input autoComplete="organization" value={form.company} onChange={(event) => onChange("company", event.target.value)} placeholder="Company" /></label>
            </div>
            <div className="co-checks">
              <label className="co-check"><input type="checkbox" checked={form.saveInformation} onChange={(event) => onChange("saveInformation", event.target.checked)} /><i aria-hidden="true" /><span>Save this information for next time</span></label>
              <label className="co-check"><input type="checkbox" checked={form.textOffers} onChange={(event) => onChange("textOffers", event.target.checked)} /><i aria-hidden="true" /><span>Text me with new collections and offers</span></label>
            </div>
          </section>

          <section className="co-card">
            <div className="co-card-head"><span className="co-num">03</span><div><h2>Shipping & payment</h2><p>Bank details are sent on WhatsApp once we confirm your order.</p></div></div>
            <p className="co-sublabel">Shipping method</p>
            <div className="co-ship" role="radiogroup" aria-label="Shipping method">
              {SHIPPING_ZONES.map((zone) => (
                <label key={zone.id} className={`co-ship-row${form.shippingMethod === zone.id ? " selected" : ""}`}>
                  <input type="radio" name="shipping" checked={form.shippingMethod === zone.id} onChange={() => onChange("shippingMethod", zone.id)} />
                  <i className="co-radio" aria-hidden="true" />
                  <span>{zone.label}</span>
                  <b>{formatNaira(zone.fee)}</b>
                </label>
              ))}
            </div>
            <p className="co-sublabel">Payment</p>
            <div className="co-pay"><span aria-hidden="true">&#x1F3E6;</span><strong>Bank deposit</strong><small>Verified bank details sent on WhatsApp</small></div>
          </section>

          <section className="co-card co-card-compact">
            <div className="co-card-head"><span className="co-num">04</span><div><h2>Billing & note</h2><p>Almost done.</p></div></div>
            <label className="co-check co-check-flush"><input type="checkbox" checked={form.billingAddress === "different"} onChange={(event) => onChange("billingAddress", event.target.checked ? "different" : "same")} /><i aria-hidden="true" /><span>Use a different billing address</span></label>
            {form.billingAddress === "different" ? (
              <div className="co-grid co-billing">
                <label className="checkout-field co-field full"><span>Billing address{req}</span><input required value={form.billingAddressLine} onChange={(event) => onChange("billingAddressLine", event.target.value)} aria-invalid={!!errors.billingAddressLine} />{error("billingAddressLine")}</label>
                <label className="checkout-field co-field"><span>City{req}</span><input required value={form.billingCity} onChange={(event) => onChange("billingCity", event.target.value)} aria-invalid={!!errors.billingCity} />{error("billingCity")}</label>
                <label className="checkout-field co-field"><span>State{req}</span><input required value={form.billingState} onChange={(event) => onChange("billingState", event.target.value)} aria-invalid={!!errors.billingState} />{error("billingState")}</label>
                <label className="checkout-field co-field full"><span>Postal code <i>optional</i></span><input value={form.billingPostcode} onChange={(event) => onChange("billingPostcode", event.target.value)} /></label>
              </div>
            ) : null}
            <label className="checkout-field co-field co-note"><span>Order note <i>optional</i></span><textarea value={form.note} onChange={(event) => onChange("note", event.target.value)} placeholder="Sizing, styling or delivery instructions" rows={1} /></label>
          </section>
        </div>

        <aside className="co-aside" aria-label="Order summary">
          <div className="co-sum">
            <div className="co-sum-head"><h2>Your order <small>{count} {count === 1 ? "piece" : "pieces"}</small></h2>{editBag}</div>
            {summary}
            <button type="submit" className="co-submit">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.5 4.1 1.6 5.9L0 24l6.5-1.7a12 12 0 0 0 5.6 1.4h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.2-3.5-8.4Z" /></svg>
              Confirm order on WhatsApp
            </button>
            <p className="co-sum-note">Your order opens as a ready-written WhatsApp message. Press send, and we confirm availability and send bank details personally.</p>
            <ul className="co-trust">
              <li><span>&#128274;</span>No payment taken on this site</li>
              <li><span>&#10022;</span>Personal confirmation</li>
              <li><span>&#8634;</span>Easy support after ordering</li>
            </ul>
          </div>
        </aside>
      </div>

      <div className="co-bar">
        <div><small>Total</small><strong>{formatNaira(total)}</strong></div>
        <button type="submit" className="co-submit">Confirm order</button>
      </div>
    </form>
  );
}
