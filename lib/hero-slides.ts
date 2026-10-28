import type { Product } from "@/lib/products";

export type HeroSlide = {
  tab: string;
  kicker: string;
  title: string;
  accent: string;
  copy: string;
  image: string;
  href: string;
  glow: string;
  spot: { x: number; y: number };
  focus: string;
  product: { name: string; price: number; slug: string; image: string; colors: [string, string][]; soldOut: boolean };
};

// Headlines are not tied to any one category, so they stay true whatever products are added.
const headlines = [
  ["Arrive with", "confidence."],
  ["Made for", "the spotlight."],
  ["Wear your", "own story."],
  ["Dressed to", "be remembered."],
];
const glows = ["#d9a24a", "#e0842c", "#6fc2ba", "#d8434f"];
const spots = [{ x: 56, y: 50 }, { x: 52, y: 46 }, { x: 58, y: 52 }, { x: 54, y: 48 }];

const swatches: [string, string][] = [
  ["emerald", "#0d5a47"], ["green", "#2e7d4f"], ["pink", "#d9739a"], ["red", "#b3262b"], ["blue", "#3d4a9e"],
  ["violet", "#6a5acd"], ["purple", "#6b3fa0"], ["navy", "#1c2541"], ["black", "#1a1a1a"], ["white", "#f4efe6"],
  ["ivory", "#f1e9da"], ["cream", "#f3ead7"], ["gold", "#c9a24a"], ["yellow", "#e3b53a"], ["orange", "#e07b2c"],
  ["brown", "#7b4a2d"], ["grey", "#8a8a8a"], ["gray", "#8a8a8a"], ["silver", "#c0c0c0"], ["teal", "#146c6c"],
  ["burgundy", "#681c36"], ["wine", "#681c36"], ["peach", "#f1b79a"], ["lilac", "#b9a4d8"], ["nude", "#d8b8a0"],
];

function colorSwatches(colors: string[]): [string, string][] {
  const found: [string, string][] = [];
  for (const color of colors) {
    for (const part of color.toLowerCase().split(/[^a-z]+/)) {
      const match = swatches.find(([word]) => word === part);
      if (match && !found.some(([, hex]) => hex === match[1])) found.push([color, match[1]]);
    }
  }
  return found.slice(0, 4);
}

// Admin "Photo focus" choice -> which part of the tall photo the arch keeps. Empty keeps the default crop.
const focusPositions: Record<string, string> = { Top: "center 0%", Center: "center 50%", Bottom: "center 100%" };

// "Zainab Bubu – Checkered Satin…" reads better as just "Zainab Bubu" on small cards.
export function shortName(name: string) {
  return name.split(/\s[–—-]\s/)[0].trim();
}

function firstSentence(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  const end = clean.search(/[.!?](\s|$)/);
  const sentence = end > 0 ? clean.slice(0, end + 1) : clean;
  return sentence.length > 150 ? `${sentence.slice(0, 147).trimEnd()}…` : sentence;
}

export function buildHeroSlides(products: Product[]): HeroSlide[] {
  const withPhotos = products.filter((product) => product.images.length > 0);
  // Featured pieces lead, then new arrivals, then everything else; sold-out pieces go last.
  const ranked = [...withPhotos].sort((a, b) =>
    Number(a.soldOut) - Number(b.soldOut) ||
    Number(b.featured) - Number(a.featured) ||
    Number(b.newArrival) - Number(a.newArrival) ||
    a.displayOrder - b.displayOrder);

  return ranked.slice(0, 4).map((product, index) => ({
    tab: product.category,
    kicker: product.newArrival ? `New in · ${product.category}` : product.category,
    title: headlines[index % headlines.length][0],
    accent: headlines[index % headlines.length][1],
    copy: firstSentence(product.shortDescription) || `Discover the ${shortName(product.name)}.`,
    image: product.images[0],
    href: `/collections/${product.category.toLowerCase()}`,
    glow: glows[index % glows.length],
    spot: spots[index % spots.length],
    focus: focusPositions[product.heroFocus] ?? "",
    product: {
      name: shortName(product.name),
      price: product.price,
      slug: product.slug,
      image: product.images[1] ?? product.images[0],
      colors: colorSwatches(product.colors),
      soldOut: product.soldOut,
    },
  }));
}
