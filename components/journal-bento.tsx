"use client";

import { ResponsiveImage } from "@/components/responsive-image";


import Link from "next/link";
import { formatNaira } from "@/lib/currency";

type Pick = { slug: string; name: string; category: string; price: number; image: string; soldOut?: boolean };

const links = [
  { href: "/collections/evening", kicker: "After dark", title: "Evening", text: "Shimmer, drama and quiet poise.", image: "/images/toyin/toyinimg-10.webp" },
  { href: "/about", kicker: "Behind the label", title: "Our story", text: "The women and craft behind RTW.", image: "/images/toyin/toyinimg-7.webp" },
];


export function JournalBento({ picks }: { picks: Pick[] }) {

  return (
    <section className="journal" aria-labelledby="journal-title">
      <div className="journal-feature-wrap" data-reveal>
        <Link prefetch={false} href="/lookbook" className="journal-feature">
          <ResponsiveImage src="/images/toyin/toyinimg-8.webp" alt="RTW editorial portrait" loading="lazy" decoding="async" />
          <span className="journal-feature-shade" aria-hidden="true" />
          <span className="journal-feature-copy">
            <span className="journal-kicker"><i aria-hidden="true" />The RTW journal</span>
            <h2 id="journal-title">Details that <em>complete you.</em></h2>
            <span className="journal-feature-text">Discover the stories, styling and inspiration behind every edit.</span>
            <span className="journal-btn">Enter the lookbook <b aria-hidden="true">&#8594;</b></span>
          </span>
          <span className="journal-stamp" aria-hidden="true">
            <svg viewBox="0 0 100 100"><defs><path id="journal-circle" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" /></defs><text><textPath href="#journal-circle">STORIES &#8226; STYLING &#8226; INSPIRATION &#8226; </textPath></text></svg>
            <em>&#10022;</em>
          </span>
        </Link>
      </div>

      {links.map((link, index) => (
        <div key={link.href} className="journal-link-wrap" data-reveal>
          <Link prefetch={false} href={link.href} className="journal-link">
            <ResponsiveImage src={link.image} alt="" loading="lazy" decoding="async" />
            <span className="journal-link-shade" aria-hidden="true" />
            <span className="journal-link-copy">
              <small>{link.kicker}</small>
              <strong>{link.title}</strong>
              <span>{link.text}</span>
            </span>
            <i aria-hidden="true">&#8599;</i>
          </Link>
        </div>
      ))}

      <div className="journal-trending" data-reveal>
        <div className="journal-trending-head">
          <span><span className="journal-live" aria-hidden="true" />Trending now</span>
          <Link prefetch={false} href="/collections">Shop all <span aria-hidden="true">&#8594;</span></Link>
        </div>
        <div className="journal-trending-list">
          {picks.map((pick, index) => (
            <div key={pick.slug} data-reveal>
              <Link prefetch={false} href={`/products/${pick.slug}`} className="journal-pick">
                <span className="journal-pick-img"><ResponsiveImage src={pick.image} alt="" loading="lazy" decoding="async" />{pick.soldOut ? <span className="sold-tag sold-tag-sm">Sold</span> : null}</span>
                <span className="journal-pick-info">
                  <small>{pick.category}</small>
                  <strong>{pick.name}</strong>
                  <b>{formatNaira(pick.price)}</b>
                </span>
                <i aria-hidden="true">&#8599;</i>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
