import "./home-styles/route.css";
import Link from "next/link";
import { CategoryShowcase } from "@/components/category-showcase";
import { HeroShowcase } from "@/components/hero-showcase";
import { JournalBento } from "@/components/journal-bento";
import { type Look, ShopEdit } from "@/components/shop-edit";
import { StackedEdits } from "@/components/stacked-edits";
import { getAllProducts } from "@/lib/products";

const services = [
  { icon: "truck", title: "Delivery across Nigeria", text: "Carefully packed, from Lagos to every state" },
  { icon: "shield", title: "Secure ordering", text: "Personal confirmation on WhatsApp" },
  { icon: "return", title: "Easy support", text: "Friendly help before and after ordering" },
  { icon: "chat", title: "Styling assistance", text: "A personal touch when you need it" },
];

function ServiceIcon({ name }: { name: string }) {
  if (name === "truck") return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 8h17v15H3zM20 13h5l4 5v5h-9zM8 27a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM24 27a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /></svg>;
  if (name === "shield") return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3 27 7v8c0 7-4 12-11 14C9 27 5 22 5 15V7l11-4Z" /><path d="m11 16 3 3 7-8" /></svg>;
  if (name === "return") return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 10h15a7 7 0 0 1 0 14H9" /><path d="m11 5-5 5 5 5" /></svg>;
  return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M27 15c0 7-5 12-11 12H5l3-5A11 11 0 1 1 27 15Z" /><path d="M11 14h10M11 18h7" /></svg>;
}

export default function HomePage() {
  const products = getAllProducts();
  const shopLooks = products
    .flatMap((product) => product.images.map((image, imageIndex) => ({ product, image, imageIndex })))
    .sort((x, y) => x.imageIndex - y.imageIndex)
    .map(({ product, image }, index) => ({ product, image, look: index + 1 }));
  const looks: Look[] = shopLooks.map(({ product, image, look }) => ({
    look,
    slug: product.slug,
    name: product.name,
    category: product.category,
    price: product.price,
    image,
    altImage: product.images.find((src) => src !== image) ?? image,
    colors: product.colors,
    soldOut: product.soldOut,
  }));

  return (
    <div className="premium-home">
      <div className="premium-announcement">
        <span>NEW SEASON ARRIVALS</span>
        <strong>Complimentary styling support on WhatsApp</strong>
        <Link href="/collections">Shop now &#8599;</Link>
      </div>

      <div className="premium-container">
        <HeroShowcase />

        <section className="premium-services" aria-label="Our services">
          {services.map((service) => <div key={service.title}><ServiceIcon name={service.icon} /><span><strong>{service.title}</strong><small>{service.text}</small></span></div>)}
        </section>

        <CategoryShowcase />

        <StackedEdits />

        <ShopEdit looks={looks} />

        <JournalBento picks={products.slice(0, 3).map((product) => ({ slug: product.slug, name: product.name, category: product.category, price: product.price, image: product.images[0], soldOut: product.soldOut }))} />
      </div>
    </div>
  );
}
