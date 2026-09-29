"use client";

import { ResponsiveImage } from "@/components/responsive-image";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { formatNaira } from "@/lib/currency";

export type SearchProduct = { slug: string; name: string; category: string; price: number; image: string; colors: string[]; text: string };

const PAGES = [
  { title: "Home", href: "/", text: "New season, featured edits and trending pieces", keywords: "home start main landing" },
  { title: "Collections", href: "/collections", text: "Shop every piece with filters", keywords: "shop all products store buy catalogue" },
  { title: "Dresses", href: "/collections/dresses", text: "Sculpted & fluid silhouettes", keywords: "dress gown category" },
  { title: "Sets", href: "/collections/sets", text: "Polished two-piece edits", keywords: "set two piece coord category" },
  { title: "Tops", href: "/collections/tops", text: "Everyday polish", keywords: "top blouse shirt category" },
  { title: "Skirts", href: "/collections/skirts", text: "Heritage prints", keywords: "skirt pleat category" },
  { title: "Evening", href: "/collections/evening", text: "After-dark glamour", keywords: "evening party night gown category" },
  { title: "Our story", href: "/about", text: "The label and the women behind it", keywords: "about story brand who we are" },
  { title: "Lookbook", href: "/lookbook", text: "Editorial stories and styling", keywords: "lookbook journal editorial inspiration photos" },
  { title: "Contact", href: "/contact", text: "Get in touch or chat on WhatsApp", keywords: "contact email whatsapp phone help support" },
  { title: "FAQ", href: "/faq", text: "Answers to common questions", keywords: "faq questions help order payment" },
  { title: "Size guide", href: "/size-guide", text: "Find your perfect fit", keywords: "size guide fit measurements chart" },
  { title: "Shipping & returns", href: "/shipping-returns", text: "Delivery times and return policy", keywords: "shipping delivery returns refund exchange" },
  { title: "Privacy policy", href: "/privacy-policy", text: "How we handle your data", keywords: "privacy policy data cookies gdpr" },
  { title: "Your bag", href: "/cart", text: "Review the pieces in your bag", keywords: "cart bag basket checkout" },
];

type Result = { kind: "product"; item: SearchProduct } | { kind: "page"; item: (typeof PAGES)[number] };

function score(haystack: string, terms: string[]) {
  const text = haystack.toLowerCase();
  let total = 0;
  for (const term of terms) {
    const index = text.indexOf(term);
    if (index < 0) return 0;
    total += index === 0 ? 3 : text.includes(` ${term}`) ? 2 : 1;
  }
  return total;
}

export function SiteSearch({ products }: { products: SearchProduct[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const typing = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      if ((event.key === "k" && (event.metaKey || event.ctrlKey)) || (event.key === "/" && !typing)) {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 60);
    const onDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) close();
    };
    document.addEventListener("mousedown", onDown);
    return () => { window.clearTimeout(timer); document.removeEventListener("mousedown", onDown); };
  }, [open]);

  const results = useMemo<Result[]>(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    const productHits = products
      .map((item) => ({ item, s: score(`${item.name} ${item.category} ${item.colors.join(" ")} ${item.text}`, terms) + score(item.name, terms) * 2 }))
      .filter((hit) => hit.s > 0).sort((a, b) => b.s - a.s).slice(0, 5)
      .map(({ item }) => ({ kind: "product" as const, item }));
    const pageHits = PAGES
      .map((item) => ({ item, s: score(`${item.title} ${item.text} ${item.keywords}`, terms) + score(item.title, terms) * 2 }))
      .filter((hit) => hit.s > 0).sort((a, b) => b.s - a.s).slice(0, 4)
      .map(({ item }) => ({ kind: "page" as const, item }));
    return [...productHits, ...pageHits];
  }, [query, products]);

  function close() { setOpen(false); setQuery(""); setCursor(0); }
  const hrefOf = (result: Result) => (result.kind === "product" ? `/products/${result.item.slug}` : result.item.href);
  const seeAll = `/collections?q=${encodeURIComponent(query.trim())}`;

  function onInputKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") { close(); return; }
    if (event.key === "ArrowDown") { event.preventDefault(); setCursor((value) => Math.min(value + 1, results.length - 1)); }
    if (event.key === "ArrowUp") { event.preventDefault(); setCursor((value) => Math.max(value - 1, 0)); }
    if (event.key === "Enter" && query.trim()) {
      event.preventDefault();
      router.push(results[cursor] ? hrefOf(results[cursor]) : seeAll);
      close();
    }
  }

  const productHits = results.filter((result) => result.kind === "product");
  const pageHits = results.filter((result) => result.kind === "page");
  const indexOf = (result: Result) => results.indexOf(result);
  const showDrop = open && query.trim().length > 0;

  return (
    <div ref={rootRef} className={`nav-search${open ? " open" : ""}`}>
      <div className="nav-search-bar">
        <button type="button" className="nav-search-icon" onClick={() => (open ? inputRef.current?.focus() : setOpen(true))} aria-label="Search the site">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        </button>
        <input
          ref={inputRef}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => { setQuery(event.target.value); setCursor(0); }}
          onKeyDown={onInputKey}
          placeholder="Search dresses, colours, pages…"
          aria-label="Search"
          role="combobox"
          aria-controls="nav-search-results"
          aria-expanded={showDrop}
          aria-activedescendant={showDrop && results[cursor] ? `search-opt-${cursor}` : undefined}
          tabIndex={open ? 0 : -1}
        />
        {open ? <button type="button" className="nav-search-close" onClick={close} aria-label="Close search">&times;</button> : null}
      </div>

      <>
        {showDrop ? (
          <div className="nav-search-drop" id="nav-search-results" role="listbox" >
            {!results.length ? (
              <p className="nav-search-none">No results for <b>“{query.trim()}”</b></p>
            ) : (
              <>
                {productHits.length ? <p className="nav-search-label">Products</p> : null}
                {productHits.map((result) => {
                  const item = result.item as SearchProduct;
                  const index = indexOf(result);
                  return (
                    <Link prefetch={false} key={item.slug} id={`search-opt-${index}`} role="option" aria-selected={cursor === index} href={`/products/${item.slug}`} className={`nav-search-row${cursor === index ? " active" : ""}`} onMouseEnter={() => setCursor(index)} onClick={close}>
                      <ResponsiveImage src={item.image} alt="" sizes="64px" />
                      <span><strong>{item.name}</strong><small>{item.category}</small></span>
                      <b>{formatNaira(item.price)}</b>
                    </Link>
                  );
                })}
                {pageHits.length ? <p className="nav-search-label">Pages</p> : null}
                {pageHits.map((result) => {
                  const item = result.item as (typeof PAGES)[number];
                  const index = indexOf(result);
                  return (
                    <Link prefetch={false} key={item.href} id={`search-opt-${index}`} role="option" aria-selected={cursor === index} href={item.href} className={`nav-search-row nav-search-page${cursor === index ? " active" : ""}`} onMouseEnter={() => setCursor(index)} onClick={close}>
                      <i aria-hidden="true">&#8599;</i>
                      <span><strong>{item.title}</strong><small>{item.text}</small></span>
                    </Link>
                  );
                })}
              </>
            )}
            <Link prefetch={false} href={seeAll} className="nav-search-all" onClick={close}>View all results <span aria-hidden="true">&#8594;</span></Link>
          </div>
        ) : null}
      </>
    </div>
  );
}
