import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell">
      <div className="checkout-empty">
        <div>
          <p className="section-kicker">404</p>
          <h2>This page is not available.</h2>
          <Link href="/" className="primary-button">
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
