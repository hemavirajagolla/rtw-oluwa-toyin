import Link from "next/link";

// Site-wide footer. Rendered once by SiteShell, so it appears on every page except /admin.
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="simple-footer-main">
        <div className="simple-footer-brand">
          <Link prefetch={false} href="/" aria-label="RTW by Elegant Moi home"><span className="simple-footer-monogram">RTW</span></Link>
          <p>Expressive ready-to-wear, thoughtfully made for your story.</p>
        </div>
        <nav className="simple-footer-nav" aria-label="Footer menu">
          <Link prefetch={false} href="/collections">Shop</Link><Link prefetch={false} href="/about">Our story</Link><Link prefetch={false} href="/lookbook">Lookbook</Link><Link prefetch={false} href="/contact">Contact</Link>
        </nav>
        <div className="simple-footer-contact">
          <p>Need styling help?</p>
          <a href="https://wa.me/916305615898" target="_blank" rel="noreferrer">Chat with us <span aria-hidden="true">&#8599;</span></a>
        </div>
      </div>
      <div className="simple-footer-bottom">
        <span>&copy; {new Date().getFullYear()} RTW by Elegant Moi</span>
        <p className="footer-credits">
          Designed By <a href="https://www.isigntech.com/" target="_blank" rel="noopener noreferrer">iSignTech</a>
          <span aria-hidden="true"> | </span>
          Powered By <a href="https://www.n-visionsoft.com/" target="_blank" rel="noopener noreferrer">NvisionSoft</a>
        </p>
        <div className="footer-links">
          <Link prefetch={false} href="/faq">FAQ</Link><Link prefetch={false} href="/size-guide">Size guide</Link><Link prefetch={false} href="/shipping-returns">Shipping</Link><Link prefetch={false} href="/privacy-policy">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
