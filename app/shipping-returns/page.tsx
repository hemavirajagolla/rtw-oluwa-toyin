import { formatNaira } from "@/lib/currency";
import { SHIPPING_ZONES } from "@/lib/shipping";

export default function ShippingReturnsPage() {
  return (
    <div className="page-shell">
      <div className="page-intro">
        <p className="section-kicker">Shipping & returns</p>
        <h1>Delivered with care.</h1>
      </div>

      <div className="policy-body">
        <p>
          We ship carefully packed orders within Nigeria only. Choose your delivery zone at checkout. Delivery timelines vary by location and will be confirmed through WhatsApp once your order is placed.
        </p>
        <ul>
          {SHIPPING_ZONES.map((zone) => (
            <li key={zone.id}>{zone.label}: <strong>{formatNaira(zone.fee)}</strong></li>
          ))}
        </ul>
        <p>
          If your item arrives damaged or incorrect, please contact us immediately and we will help resolve the issue promptly.
        </p>
      </div>
    </div>
  );
}
