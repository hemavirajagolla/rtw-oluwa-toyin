import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CollectionsClient } from "@/components/collections-client";
import { CollectionsHero } from "@/components/collections-hero";
import { getAllProducts, getCategoryList, getProductsByCategory } from "@/lib/products";

const COPY: Record<string, { accent: string; text: string }> = {
  Bubu: { accent: "flowing and regal.", text: "Floor-length bubus and kaftans with generous sleeves, rich fabrics and beautiful beadwork." },
  Dresses: { accent: "that move with you.", text: "Sculpted, fluid silhouettes made for memorable entrances, from day to evening." },
  Sets: { accent: "made better together.", text: "Polished two-piece edits that make dressing feel effortless." },
  Tops: { accent: "for everyday polish.", text: "Considered tops with clean lines and a softly tailored shape." },
  Skirts: { accent: "in heritage prints.", text: "Dramatic pleats and modern textile geometry, rooted in African craft." },
  Evening: { accent: "after dark.", text: "Shimmer, drama and quiet poise for the moments that matter most." },
  Jumpsuits: { accent: "in one effortless piece.", text: "Tailored and fluid jumpsuits that take you from the day to the dinner." },
  "Co-ords": { accent: "perfectly matched.", text: "Coordinated tops and bottoms that make getting dressed easy." },
  Gowns: { accent: "for grand occasions.", text: "Statement gowns for weddings, owambe and every celebration worth dressing up for." },
  Trousers: { accent: "with a clean line.", text: "Wide-leg, palazzo and tailored trousers cut for comfort and polish." },
};

export function generateStaticParams() {
  // Every listed category gets a page, even before its first product is added.
  return getCategoryList().map((category) => ({ category: category.toLowerCase() }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const slug = decodeURIComponent(category).toLowerCase();
  // Match the real category name so hyphenated ones like "Co-ords" resolve correctly.
  const categoryName = getCategoryList().find((name) => name.toLowerCase() === slug);

  if (!categoryName) {
    notFound();
  }

  const inCategory = getProductsByCategory(categoryName);

  const copy = COPY[categoryName] ?? { accent: "edit.", text: "Explore every piece in this edit." };
  const images = [...new Set(inCategory.flatMap((product) => product.images))];
  // The header needs three photos: top up from other products, then from fixed brand photos (never loops).
  const fallback = ["/images/toyin/toyinimg-13.webp", "/images/toyin/toyinimg-3.webp", "/images/toyin/toyinimg-14.webp"];
  for (const src of [...getAllProducts().map((product) => product.images[0]), ...fallback]) {
    if (images.length >= 3) break;
    if (src && !images.includes(src)) images.push(src);
  }

  return (
    <div className="page-shell col-page">
      <CollectionsHero
        kicker="Collection"
        title={categoryName}
        accent={copy.accent}
        text={copy.text}
        images={images}
        count={inCategory.length}
        crumb={categoryName}
      />
      <Suspense>
        <CollectionsClient products={getAllProducts()} initialCategory={categoryName} />
      </Suspense>
    </div>
  );
}
