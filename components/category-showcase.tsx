"use client";

import Link from "next/link";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { responsiveImage } from "@/lib/responsive-image";
import type { PointerEvent } from "react";

const categories = [
  { name: "Dresses", note: "Sculpted & fluid", image: "/images/toyin/toyinimg-15.webp" },
  { name: "Sets", note: "Two-piece ease", image: "/images/toyin/toyinimg-12.webp" },
  { name: "Tops", note: "Everyday polish", image: "/images/toyin/toyinimg-9.webp" },
  { name: "Skirts", note: "Heritage prints", image: "/images/toyin/toyinimg-13.webp" },
  { name: "Evening", note: "After-dark glamour", image: "/images/toyin/toyinimg-3.webp" },
];


export function CategoryShowcase() {
  const reduced = useReducedMotion();

  function tilt(event: PointerEvent<HTMLAnchorElement>) {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    event.currentTarget.style.setProperty("--rx", `${(y - .5) * -10}deg`);
    event.currentTarget.style.setProperty("--ry", `${(x - .5) * 12}deg`);
    event.currentTarget.style.setProperty("--gx", `${x * 100}%`);
  }

  function untilt(event: PointerEvent<HTMLAnchorElement>) {
    event.currentTarget.style.setProperty("--rx", "0deg");
    event.currentTarget.style.setProperty("--ry", "0deg");
  }

  return (
    <section className="cat-showcase" aria-labelledby="cat-showcase-title">
      <div className="cat-head">
        <div data-reveal>
          <span className="cat-kicker"><i aria-hidden="true" />Shop your way</span>
          <h2 id="cat-showcase-title">Explore by <em>category</em></h2>
        </div>
        <p data-reveal>
          Five curated edits, each crafted to celebrate a different side of your story.
          <Link prefetch={false} href="/collections">View all collections <span aria-hidden="true">&#8594;</span></Link>
        </p>
      </div>

      <div className="cat-rail">
        {categories.map((category, index) => (
          <div
            key={category.name}
            className="cat-item"
           
            data-reveal
           
           
          >
            <Link prefetch={false} href={`/collections/${category.name.toLowerCase()}`} className="cat-card" onPointerMove={tilt} onPointerLeave={untilt}>
              <span className="cat-frame">
                <img {...responsiveImage(category.image, "(max-width: 640px) 31vw, (max-width: 1000px) 32vw, 19vw")} alt="" loading="lazy" data-reveal />
                <span className="cat-shade" aria-hidden="true" />
                <span className="cat-glare" aria-hidden="true" />
                <span className="cat-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span className="cat-info">
                  <small>{category.note}</small>
                  <strong>{category.name}</strong>
                  <span className="cat-cta">Explore <i aria-hidden="true">&#8599;</i></span>
                </span>
              </span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
