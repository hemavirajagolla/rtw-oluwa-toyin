import { Suspense } from "react";
import { CollectionsClient } from "@/components/collections-client";
import { CollectionsHero } from "@/components/collections-hero";
import { getAllProducts } from "@/lib/products";

export default function CollectionsPage() {
  const products = getAllProducts();

  return (
    <div className="page-shell col-page">
      <CollectionsHero
        kicker="The collection"
        title="Curated for the"
        accent="modern wardrobe."
        text="Silhouettes designed to speak softly and leave a lasting impression. Filter by category, size and price to find your piece."
        images={["/images/toyin/toyinimg-13.webp", "/images/toyin/toyinimg-3.webp", "/images/toyin/toyinimg-14.webp"]}
        count={products.length}
      />
      <Suspense>
        <CollectionsClient products={products} />
      </Suspense>
    </div>
  );
}
