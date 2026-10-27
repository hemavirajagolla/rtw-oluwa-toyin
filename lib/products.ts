import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Product = {
  slug: string;
  name: string;
  price: number;
  category: string;
  sizes: string[];
  colors: string[];
  images: string[];
  shortDescription: string;
  fullDescription: string;
  fabricCare: string;
  featured: boolean;
  newArrival: boolean;
  soldOut: boolean;
  displayOrder: number;
};

const productsDirectory = path.join(process.cwd(), "content", "products");

// Web addresses typed in the admin panel are cleaned up ("Emerald_Ruched Dress" -> "emerald-ruched-dress") so links never break.
function toSlug(value: string) {
  return String(value).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// UK / Nigerian dress sizes are numbers (6, 8, 10…); keep them in size order with any word sizes last.
function sortSizes(sizes: string[]) {
  return [...new Set(sizes)].sort((a, b) => (Number(a) || 999) - (Number(b) || 999));
}

function parseProduct(fileName: string): Product {
  const filePath = path.join(productsDirectory, fileName);
  const source = fs.readFileSync(filePath, "utf8");
  const { data } = matter(source);

  return {
    slug: toSlug(data.slug || fileName.replace(/.md$/, "")),
    name: data.name,
    price: Number(data.price),
    category: data.category,
    sizes: Array.isArray(data.sizes) ? sortSizes(data.sizes.map(String)) : [],
    colors: Array.isArray(data.colors) ? data.colors : [],
    images: Array.isArray(data.images) ? data.images : [],
    shortDescription: data.shortDescription || "",
    fullDescription: data.fullDescription || "",
    fabricCare: data.fabricCare || "",
    featured: Boolean(data.featured),
    newArrival: Boolean(data.newArrival),
    soldOut: Boolean(data.soldOut),
    displayOrder: Number(data.displayOrder || 0),
  };
}

export function getAllProducts(): Product[] {
  if (!fs.existsSync(productsDirectory)) return [];

  return fs
    .readdirSync(productsDirectory)
    .filter((file) => file.endsWith(".md"))
    .map(parseProduct)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getFeaturedProducts(): Product[] {
  return getAllProducts().filter((product) => product.featured).slice(0, 4);
}

export function getNewArrivals(): Product[] {
  return getAllProducts().filter((product) => product.newArrival).slice(0, 4);
}

export function getProductsByCategory(category: string): Product[] {
  const normalized = category.toLowerCase();
  return getAllProducts().filter(
    (product) => product.category.toLowerCase() === normalized,
  );
}

export function getProductBySlug(slug: string): Product | undefined {
  return getAllProducts().find((product) => product.slug === slug);
}

export function getCategoryList(): string[] {
  return [
    "Dresses",
    "Sets",
    "Tops",
    "Skirts",
    "Evening",
  ];
}
