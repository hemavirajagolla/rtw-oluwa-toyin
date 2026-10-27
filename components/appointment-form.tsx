"use client";

import { type FormEvent, useState } from "react";

const WHATSAPP = "916305615898";
const EMAIL = "hello@oluwatowin.com";

// Edit these lists to change the dropdown options.
const LOCATIONS = ["Lagos Studio", "Abuja Studio", "Virtual Consultation", "Home Visit"];
const SERVICES = [
  "Personal Styling",
  "Size & Fit Consultation",
  "Wardrobe Review",
  "Bridal & Occasion Wear",
  "Custom Order",
  "Order Pickup",
  "Alterations",
];

export function AppointmentForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [service, setService] = useState("");

  const composed = `Hello RTW by Elegant Moi,\n\nI would like to book an appointment.\n\nName: ${name.trim()}\nPhone: ${phone.trim()}\nEmail: ${email.trim()}\nLocation: ${location}\nService: ${service}`;
  const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(composed)}`;
  const mailLink = `mailto:${EMAIL}?subject=${encodeURIComponent("Appointment request — RTW")}&body=${encodeURIComponent(composed)}`;

  function submit(event: FormEvent) {
    event.preventDefault();
    window.open(waLink, "_blank", "noopener,noreferrer");
  }

  return (
    <section className="ct-book" id="book-appointment">
      <form className="ct-book-form" onSubmit={submit}>
        <span className="ct-kicker ct-kicker-dark"><i aria-hidden="true" />Appointments</span>
        <h2>Book your <em>appointment</em> here</h2>

        <div className="ct-book-grid">
          <label className="ct-field">
            <span>Name</span>
            <input required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </label>
          <label className="ct-field">
            <span>Phone Number</span>
            <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" inputMode="tel" />
          </label>
          <label className="ct-field">
            <span>Email</span>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </label>
          <label className="ct-field">
            <span>Location</span>
            <select value={location} onChange={(e) => setLocation(e.target.value)}>
              {LOCATIONS.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="ct-field ct-book-wide">
            <span>Select Service</span>
            <select required value={service} onChange={(e) => setService(e.target.value)}>
              <option value="" disabled>-Select Service-</option>
              {SERVICES.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>

        <div className="ct-send">
          <button type="submit" className="ct-btn ct-btn-dark">Send</button>
          <a href={mailLink} className="ct-btn ct-btn-outline">Send by email</a>
        </div>
        <p className="ct-note">Your request opens ready to send in WhatsApp or your email app — nothing is stored on this site.</p>
      </form>
    </section>
  );
}
