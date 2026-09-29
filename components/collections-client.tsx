"use client";

import { ResponsiveImage } from "@/components/responsive-image";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type CSSProperties, Suspense, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import { formatNaira } from "@/lib/currency";

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
const PRICE_STEP = 1000; // price slider moves in ₦1,000 steps
const SWATCHES: Record<string, string> = {
  Onyx: "#1d1d1f", Black: "#1d1d1f", "Deep Green": "#1f4d3a", Emerald: "#0f6b4f", Ivory: "#f1e9da",
  Gold: "#c9a24a", Sand: "#d8c3a0", Saffron: "#e3a13a", Terracotta: "#c0582f",
};
const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
  { value: "name", label: "Name A–Z" },
];

type Props = { products: Product[]; initialCategory?: string };

function CollectionQuery({ onChange }: { onChange: (query: string) => void }) {
  const params = useSearchParams();
  const query = params.get("q") ?? "";
  useEffect(() => { onChange(query); }, [query, onChange]);
  return null;
}

export function CollectionsClient({ products, initialCategory = "All" }: Props) {

  const bounds = useMemo(() => {
    const prices = products.map((product) => product.price);
    return { min: Math.floor(Math.min(...prices) / PRICE_STEP) * PRICE_STEP, max: Math.ceil(Math.max(...prices) / PRICE_STEP) * PRICE_STEP };
  }, [products]);

  const categories = useMemo(() => ["All", ...new Set(products.map((product) => product.category))], [products]);
  const sizes = useMemo(() => SIZE_ORDER.filter((size) => products.some((product) => product.sizes.includes(size))), [products]);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [picked, setPicked] = useState<{ sizes: string[] }>({ sizes: [] });
  const [maxPrice, setMaxPrice] = useState(bounds.max);
  const [inStock, setInStock] = useState(false);
  const [newOnly, setNewOnly] = useState(false);
  const [sort, setSort] = useState("featured");
  const [cols, setCols] = useState<4 | 5>(4);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawer]);

  const toggle = (key: "sizes", value: string) =>
    setPicked((prev) => ({ ...prev, [key]: prev[key].includes(value) ? prev[key].filter((item) => item !== value) : [...prev[key], value] }));

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    const list = products.filter((product) =>
      (category === "All" || product.category === category) &&
      (!picked.sizes.length || picked.sizes.some((size) => product.sizes.includes(size))) &&
      product.price <= maxPrice &&
      (!inStock || !product.soldOut) &&
      (!newOnly || product.newArrival) &&
      (!term || [product.name, product.category, product.shortDescription, ...product.colors].join(" ").toLowerCase().includes(term)),
    );
    return list.sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "newest") return Number(b.newArrival) - Number(a.newArrival) || b.displayOrder - a.displayOrder;
      return a.displayOrder - b.displayOrder;
    });
  }, [products, query, category, picked, maxPrice, inStock, newOnly, sort]);

  const chips = [
    ...(query.trim() ? [{ label: `“${query.trim()}”`, clear: () => setQuery("") }] : []),
    ...(category !== "All" ? [{ label: category, clear: () => setCategory("All") }] : []),
    ...picked.sizes.map((size) => ({ label: `Size ${size}`, clear: () => toggle("sizes", size) })),
    ...(maxPrice < bounds.max ? [{ label: `Under ${formatNaira(maxPrice)}`, clear: () => setMaxPrice(bounds.max) }] : []),
    ...(inStock ? [{ label: "In stock", clear: () => setInStock(false) }] : []),
    ...(newOnly ? [{ label: "New arrivals", clear: () => setNewOnly(false) }] : []),
  ];

  const clearAll = () => {
    setQuery(""); setCategory("All"); setPicked({ sizes: [] }); setMaxPrice(bounds.max); setInStock(false); setNewOnly(false);
  };

  const countFor = (name: string) => (name === "All" ? products.length : products.filter((product) => product.category === name).length);
  const pricePct = ((maxPrice - bounds.min) / Math.max(bounds.max - bounds.min, 1)) * 100;

  const filters = (
    <>
      <div className="col-group">
        <h3>Category</h3>
        <div className="col-cats">
          {categories.map((item) => (
            <button type="button" key={item} className={category === item ? "active" : ""} aria-pressed={category === item} onClick={() => setCategory(item)}>
              <span>{item}</span><em>{countFor(item)}</em>
            </button>
          ))}
        </div>
      </div>

      <div className="col-group">
        <h3>Size</h3>
        <div className="col-sizes">
          {sizes.map((size) => (
            <button type="button" key={size} className={picked.sizes.includes(size) ? "active" : ""} aria-pressed={picked.sizes.includes(size)} onClick={() => toggle("sizes", size)}>{size}</button>
          ))}
        </div>
      </div>

      <div className="col-group">
        <h3>Price <span>up to <b>{formatNaira(maxPrice)}</b></span></h3>
        <input
          className="col-range"
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={PRICE_STEP}
          value={maxPrice}
          style={{ "--pct": `${pricePct}%` } as CSSProperties}
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          aria-label="Maximum price"
        />
        <div className="col-range-labels"><span>{formatNaira(bounds.min)}</span><span>{formatNaira(bounds.max)}</span></div>
      </div>

      <div className="col-group">
        <h3>Availability</h3>
        <label className="col-switch"><input type="checkbox" checked={inStock} onChange={(event) => setInStock(event.target.checked)} /><span />In stock only</label>
        <label className="col-switch"><input type="checkbox" checked={newOnly} onChange={(event) => setNewOnly(event.target.checked)} /><span />New arrivals</label>
      </div>
    </>
  );

  return (
    <div className="col-shell">
      <Suspense fallback={null}><CollectionQuery onChange={setQuery} /></Suspense>
      <div className="col-toolbar">
        <button type="button" className="col-filter-btn" onClick={() => setDrawer(true)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
          Filters{chips.length ? <b>{chips.length}</b> : null}
        </button>
        <p className="col-count"><b>{visible.length}</b> {visible.length === 1 ? "piece" : "pieces"}</p>
        <div className="col-toolbar-right">
          <label className="col-sort">
            <span>Sort</span>
            <select aria-label="Sort products" value={sort} onChange={(event) => setSort(event.target.value)}>
              {SORTS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
          <div className="col-density" role="group" aria-label="Grid density">
            {([4, 5] as const).map((value) => (
              <button type="button" key={value} className={cols === value ? "active" : ""} aria-pressed={cols === value} onClick={() => setCols(value)} aria-label={`${value} per row`}>
                <span style={{ gridTemplateColumns: `repeat(${value}, 1fr)` }}>{Array.from({ length: value }, (_, index) => <i key={index} />)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="col-layout">
        <aside className="col-sidebar" aria-label="Filters">
          <div className="col-sidebar-head"><h2>Refine</h2>{chips.length ? <button type="button" onClick={clearAll}>Clear all</button> : null}</div>
          {filters}
        </aside>

        <div className="col-main">
          {chips.length ? <div className="col-status">
            <>
              {chips.map((chip) => (
                <button type="button" key={chip.label} className="col-chip" onClick={chip.clear}>
                  {chip.label}<span aria-hidden="true">&times;</span>
                </button>
              ))}
            </>
            {chips.length > 1 ? <button type="button" className="col-clear" onClick={clearAll}>Clear all</button> : null}
          </div> : null}

          <div className={`col-grid col-grid-${cols}`}>
            <>
              {visible.map((product, index) => (
                <div key={product.slug}>
                  <Link prefetch={false} href={`/products/${product.slug}`} className="col-card">
                    <span className="col-card-media">
                      <ResponsiveImage portrait src={product.images[0]} alt={product.name} sizes={cols === 5 ? "(max-width: 640px) 45vw, (max-width: 1024px) 28vw, 16vw" : "(max-width: 640px) 45vw, (max-width: 1024px) 28vw, 20vw"} loading={index < 4 ? "eager" : "lazy"} decoding="async" />
                      {product.newArrival ? <span className="col-badge">New</span> : null}
                      {product.soldOut ? <span className="col-badge col-badge-sold">Sold out</span> : null}
                      <span className="col-card-sizes">{product.sizes.join(" · ")}</span>
                      <span className="col-card-cta">View piece <i aria-hidden="true">&#8599;</i></span>
                    </span>
                    <span className="col-card-info">
                      <span>
                        <small>{product.category}</small>
                        <strong>{product.name}</strong>
                        <span className="col-card-swatches">
                          {product.colors.map((color) => <i key={color} title={color} style={{ background: SWATCHES[color] ?? "#bbb" }} />)}
                        </span>
                      </span>
                      <b>{formatNaira(product.price)}</b>
                    </span>
                  </Link>
                </div>
              ))}
            </>
          </div>

          {!visible.length ? (
            <div className="col-empty">
              <span aria-hidden="true">&#10022;</span>
              <h3>No pieces match those filters</h3>
              <p>Try removing a filter, or browse the full collection.</p>
              <button type="button" onClick={clearAll}>Reset filters</button>
            </div>
          ) : null}
        </div>
      </div>

      <>
        {drawer ? (
          <>
            <div className="col-drawer-backdrop"    onClick={() => setDrawer(false)} />
            <aside className="col-drawer" role="dialog" aria-modal="true" aria-label="Filters" >
              <div className="col-sidebar-head"><h2>Refine</h2><button type="button" onClick={() => setDrawer(false)} aria-label="Close filters">&times;</button></div>
              <div className="col-drawer-body">{filters}</div>
              <div className="col-drawer-foot">
                <button type="button" onClick={clearAll}>Clear all</button>
                <button type="button" onClick={() => setDrawer(false)}>Show {visible.length} {visible.length === 1 ? "piece" : "pieces"}</button>
              </div>
            </aside>
          </>
        ) : null}
      </>
    </div>
  );
}
