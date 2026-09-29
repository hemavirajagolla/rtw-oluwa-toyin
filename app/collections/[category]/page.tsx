import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CollectionsClient } from "@/components/collections-client";
import { CollectionsHero } from "@/components/collections-hero";
import { getAllProducts, getCategoryList, getProductsByCategory } from "@/lib/products";

const COPY: Record<string, { accent: string; text: string }> = {
  Dresses: { accent: "that move with you.", text: "Sculpted, fluid silhouettes made for memorable entrances, from day to evening." },
  Sets: { accent: "made better together.", text: "Polished two-piece edits that make dressing feel effortless." },
  Tops: { accent: "for everyday polish.", text: "Considered tops with clean lines and a softly tailored shape." },
  Skirts: { accent: "in heritage prints.", text: "Dramatic pleats and modern textile geometry, rooted in African craft." },
  Evening: { accent: "after dark.", text: "Shimmer, drama and quiet poise for the moments that matter most." },
};

export function generateStaticParams() {
  return getCategoryList().map((category) => ({ category: category.toLowerCase() }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categoryName = decodeURIComponent(category)
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  const inCategory = getProductsByCategory(categoryName);

  if (!inCategory.length) {
    notFound();
  }

  const copy = COPY[categoryName] ?? { accent: "edit.", text: "Explore every piece in this edit." };
  const images = [...new Set(inCategory.flatMap((product) => product.images))];
  while (images.length < 3) images.push(...getAllProducts().map((product) => product.images[0]).filter((src) => !images.includes(src)).slice(0, 3 - images.length));

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
