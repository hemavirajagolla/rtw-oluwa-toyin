import { ResponsiveImage } from "@/components/responsive-image";
import Link from "next/link";

type Props = {
  kicker: string;
  title: string;
  accent: string;
  text: string;
  images: string[];
  count: number;
  crumb?: string;
};

export function CollectionsHero({ kicker, title, accent, text, images, count, crumb }: Props) {
  return (
    <header className="colh">
      <div className="colh-copy">
        <nav className="colh-crumbs" aria-label="Breadcrumb">
          <Link prefetch={false} href="/">Home</Link><span aria-hidden="true">/</span>
          {crumb ? <><Link prefetch={false} href="/collections">Collections</Link><span aria-hidden="true">/</span><b>{crumb}</b></> : <b>Collections</b>}
        </nav>
        <span className="colh-kicker"><i aria-hidden="true" />{kicker}</span>
        <h1>{title} <em>{accent}</em></h1>
        <p>{text}</p>
        <div className="colh-meta">
          <span><b>{count}</b> pieces</span>
          <span><b>EU</b> delivery</span>
          <span><b>1:1</b> styling</span>
        </div>
      </div>
      <div className="colh-orbit" aria-hidden="true">
        <span className="colh-ring colh-ring-outer" />
        <span className="colh-ring colh-ring-inner" />
        <span className="colh-core">
          <svg viewBox="0 0 100 100"><defs><path id="colh-core-path" d="M50 50m-36 0a36 36 0 1 1 72 0a36 36 0 1 1-72 0" /></defs><text><textPath href="#colh-core-path">WEAR YOUR OWN STORY &#8226; RTW &#8226; </textPath></text></svg>
          <em>&#10022;</em>
        </span>
        <span className="colh-spin">
          {images.slice(0, 3).map((src, index) => (
            <span key={src} className="colh-arm" style={{ transform: `rotate(${index * 120}deg)` }}>
              <span className="colh-photo" style={{ transform: `rotate(${index * -120}deg)` }}>
                <span className="colh-photo-inner"><ResponsiveImage src={src} alt="" sizes="(max-width: 640px) 96px, 144px" loading="eager" /></span>
              </span>
            </span>
          ))}
        </span>
        <span className="colh-spark">&#10022;</span>
      </div>
    </header>
  );
}
