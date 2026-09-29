import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/product-detail-client";
import { getAllProducts, getProductBySlug } from "@/lib/products";

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found",
    };
  }

  return {
    title: `${product.name} | RTW by Elegant Moi`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getAllProducts()
    .filter((item) => item.slug !== product.slug)
    .slice(0, 4)
    .map((item) => ({ slug: item.slug, name: item.name, category: item.category, price: item.price, image: item.images[0] }));

  return (
    <div className="page-shell">
      <ProductDetailClient product={product} related={related} />
    </div>
  );
}
