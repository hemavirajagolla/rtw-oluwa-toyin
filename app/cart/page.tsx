import { CartSummary } from "@/components/cart-summary";
import { getAllProducts } from "@/lib/products";

export default function CartPage() {
  const suggestions = getAllProducts().map((product) => ({
    slug: product.slug,
    name: product.name,
    category: product.category,
    price: product.price,
    image: product.images[0],
  }));

  return (
    <div className="page-shell">
      <CartSummary suggestions={suggestions} />
    </div>
  );
}
