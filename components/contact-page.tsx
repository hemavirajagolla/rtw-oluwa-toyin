"use client";

import { ResponsiveImage } from "@/components/responsive-image";


import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { type FormEvent, useEffect, useState } from "react";

const WHATSAPP = "916305615898";
const EMAIL = "hello@oluwatowin.com";
const INSTAGRAM = "https://www.instagram.com/oluwatowin/";
const ease = [0.22, 1, 0.36, 1] as const;

const TOPICS = ["Sizing help", "Styling advice", "Order update", "Something else"];

const CHAT = [
  { from: "you", text: "Hi! Which size should I take in the Emerald Ruched Dress?" },
  { from: "us", text: "Happy to help ✨ Could you share your usual size and height?" },
  { from: "you", text: "Usually an M, and I’m 1.68 m." },
  { from: "us", text: "Then M will be a beautiful fit. Shall I reserve it for you?" },
];

const FAQS = [
  { q: "How do I find my size?", a: "Our size guide lists every measurement. If you are between sizes, message us and we will recommend the best fit for the piece you love.", href: "/size-guide", link: "Open the size guide" },
  { q: "How do I place an order?", a: "Add your pieces to the bag and check out. We confirm every order personally on WhatsApp before it is prepared.", href: "/collections", link: "Browse the collection" },
  { q: "Where do you deliver?", a: "We deliver anywhere in Nigeria, from Lagos Island to every state. Fees and return details are on our shipping page.", href: "/shipping-returns", link: "Shipping & returns" },
  { q: "Can you help me style a full look?", a: "Of course. Send us the occasion and a few pieces you like, and we will suggest a complete look.", href: "https://wa.me/916305615898", link: "Chat with a stylist" },
];

function Icon({ name }: { name: "wa" | "mail" | "ig" | "ruler" }) {
  if (name === "wa") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.5 4.1 1.6 5.9L0 24l6.5-1.7a12 12 0 0 0 5.6 1.4h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.2-3.5-8.4Zm-8.3 18.2h-.1c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.8 9.8 0 1 1 8.5 4.7Zm5.4-7.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2s-.8 1-1 1.2c-.2.2-.4.2-.7.1-1.8-.9-3-1.6-4.2-3.7-.3-.6.3-.5.9-1.8.1-.2 0-.4 0-.6l-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.9 5.2 2.2.9 3 .9 4.1.8.7-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.2-.3-.4-.4-.7-.5Z" /></svg>;
  if (name === "mail") return <svg viewBox="0 0 24 24" aria-hidden="true" className="ct-stroke"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></svg>;
  if (name === "ig") return <svg viewBox="0 0 24 24" aria-hidden="true" className="ct-stroke"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r=".6" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="ct-stroke"><path d="M3 16 16 3l5 5L8 21Z" /><path d="m7 12 2 2M10 9l2 2M13 6l2 2" /></svg>;
}

function ChatLoop() {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(reduced ? CHAT.length : 0);

  useEffect(() => {
    if (reduced) return;
    const timer = window.setTimeout(() => setShown((value) => (value >= CHAT.length + 2 ? 0 : value + 1)), shown === 0 ? 700 : 1800);
    return () => window.clearTimeout(timer);
  }, [shown, reduced]);

  const visible = CHAT.slice(0, Math.min(shown, CHAT.length));
  const typing = !reduced && shown < CHAT.length && shown > 0;

  return (
    <div className="ct-chat" aria-hidden="true">
      <div className="ct-chat-head">
        <span className="ct-avatar"><ResponsiveImage src="/images/toyin/toyinimg-7.webp" alt="" sizes="64px" /></span>
        <span><strong>RTW Stylist</strong><small><i />Personal styling</small></span>
      </div>
      <div className="ct-chat-body">
        <AnimatePresence initial={false}>
          {visible.map((line, index) => (
            <motion.p key={index} className={`ct-bubble ct-bubble-${line.from}`} initial={{ opacity: 0, y: 12, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .4, ease }}>
              {line.text}
            </motion.p>
          ))}
          {typing ? (
            <motion.span key="typing" className={`ct-typing ct-bubble-${CHAT[shown].from}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <i /><i /><i />
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function ContactPage() {
  const reduced = useReducedMotion();
  const [topic, setTopic] = useState(TOPICS[0]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

  const composed = `Hello RTW by Elegant Moi,\n\nTopic: ${topic}${name.trim() ? `\nName: ${name.trim()}` : ""}\n\n${message.trim() || "I would love some help."}`;
  const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(composed)}`;
  const mailLink = `mailto:${EMAIL}?subject=${encodeURIComponent(`${topic} — RTW enquiry`)}&body=${encodeURIComponent(composed)}`;

  function sendWhatsApp(event: FormEvent) {
    event.preventDefault();
    window.open(waLink, "_blank", "noopener,noreferrer");
  }

  const rise = (delay = 0) => ({
    initial: reduced ? false : { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: .25 },
    transition: { duration: .85, delay, ease },
  });

  return (
    <div className="ct">
      {/* Hero */}
      <section className="ct-hero">
        <div className="ct-hero-copy">
          <motion.span className="ct-kicker" initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease }}><i aria-hidden="true" />The RTW concierge</motion.span>
          <motion.h1 initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .08, ease }}>Let’s talk <em>style.</em></motion.h1>
          <motion.p initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .16, ease }}>A second opinion on a silhouette, help with your size, or an update on your order — a real person from our team will answer you personally.</motion.p>
          <motion.div className="ct-hero-actions" initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .24, ease }}>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="ct-btn ct-btn-light"><Icon name="wa" />Chat on WhatsApp</a>
            <a href="#ct-write" className="ct-btn ct-btn-ghost">Write to us <span aria-hidden="true">&#8595;</span></a>
          </motion.div>
          <motion.ul className="ct-promise" initial={false} animate={{ opacity: 1 }} transition={{ duration: .8, delay: .4 }}>
            <li><b>1:1</b>personal replies</li>
            <li><b>&#10022;</b>styling advice</li>
            <li><b>&#8599;</b>delivery across Nigeria</li>
          </motion.ul>
        </div>

        <motion.div className="ct-hero-visual" initial={false} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease }}>
          <span className="ct-arch"><ResponsiveImage src="/images/toyin/toyinimg-10.webp" alt="" sizes="(max-width: 640px) 80vw, 40vw" loading="eager" /></span>
          <ChatLoop />
          <span className="ct-ring" aria-hidden="true" />
        </motion.div>
      </section>

      {/* Composer + channels */}
      <section className="ct-main" id="ct-write">
        <motion.form className="ct-form" onSubmit={sendWhatsApp} {...rise(0)}>
          <span className="ct-kicker ct-kicker-dark"><i aria-hidden="true" />Write to us</span>
          <h2>How can we <em>help you?</em></h2>

          <fieldset className="ct-topics">
            <legend>Choose a topic</legend>
            {TOPICS.map((item) => (
              <label key={item} className={topic === item ? "active" : ""}>
                <input type="radio" name="topic" value={item} checked={topic === item} onChange={() => setTopic(item)} />
                {item}
              </label>
            ))}
          </fieldset>

          <label className="ct-field">
            <span>Your name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Amara" autoComplete="name" />
          </label>
          <label className="ct-field">
            <span>Your message</span>
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Tell us about the piece, the occasion or your order…" rows={4} />
          </label>

          <div className="ct-send">
            <button type="submit" className="ct-btn ct-btn-dark"><Icon name="wa" />Send on WhatsApp</button>
            <a href={mailLink} className="ct-btn ct-btn-outline"><Icon name="mail" />Send by email</a>
          </div>
          <p className="ct-note">Your message opens ready to send in WhatsApp or your email app — nothing is stored on this site.</p>
        </motion.form>

        <div className="ct-channels">
          <motion.a className="ct-channel ct-channel-wa" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" {...rise(.08)}>
            <span className="ct-channel-icon"><Icon name="wa" /></span>
            <span><small>WhatsApp</small><strong>+91 63056 15898</strong><em>Fastest for sizing & orders</em></span>
            <i aria-hidden="true">&#8599;</i>
          </motion.a>
          <motion.a className="ct-channel" href={`mailto:${EMAIL}`} {...rise(.14)}>
            <span className="ct-channel-icon"><Icon name="mail" /></span>
            <span><small>Email</small><strong>{EMAIL}</strong><em>For detailed enquiries</em></span>
            <i aria-hidden="true">&#8599;</i>
          </motion.a>
          <motion.a className="ct-channel ct-channel-ig" href={INSTAGRAM} target="_blank" rel="noreferrer" {...rise(.2)}>
            <span className="ct-channel-icon"><Icon name="ig" /></span>
            <span><small>Instagram</small><strong>@oluwatowin</strong><em>New looks & behind the scenes</em></span>
            <i aria-hidden="true">&#8599;</i>
          </motion.a>
          <motion.div {...rise(.26)}>
            <Link prefetch={false} className="ct-channel ct-channel-fit" href="/size-guide">
              <span className="ct-channel-icon"><Icon name="ruler" /></span>
              <span><small>Before you choose</small><strong>Find your perfect fit</strong><em>Open the size guide</em></span>
              <i aria-hidden="true">&#8599;</i>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="ct-faq">
        <motion.div className="ct-faq-head" {...rise(0)}>
          <span className="ct-kicker ct-kicker-dark"><i aria-hidden="true" />Quick answers</span>
          <h2>Before you <em>ask.</em></h2>
          <p>The questions we hear most often. Still curious?</p>
          <Link prefetch={false} href="/faq" className="ct-textlink">See all FAQs <span aria-hidden="true">&#8594;</span></Link>
        </motion.div>
        <div className="ct-faq-list">
          {FAQS.map((item, index) => {
            const open = openFaq === index;
            return (
              <motion.div key={item.q} className={`ct-faq-item${open ? " open" : ""}`} {...rise(index * .06)}>
                <button type="button" aria-expanded={open} onClick={() => setOpenFaq(open ? -1 : index)}>
                  <em>{String(index + 1).padStart(2, "0")}</em>
                  <span>{item.q}</span>
                  <i aria-hidden="true" />
                </button>
                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.div className="ct-faq-a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .4, ease }}>
                      <p>{item.a}</p>
                      {item.href.startsWith("http")
                        ? <a href={item.href} target="_blank" rel="noreferrer">{item.link} &#8599;</a>
                        : <Link prefetch={false} href={item.href}>{item.link} &#8599;</Link>}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
