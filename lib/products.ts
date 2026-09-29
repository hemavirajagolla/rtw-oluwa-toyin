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

function parseProduct(fileName: string): Product {
  const filePath = path.join(productsDirectory, fileName);
  const source = fs.readFileSync(filePath, "utf8");
  const { data } = matter(source);

  return {
    slug: data.slug,
    name: data.name,
    price: Number(data.price),
    category: data.category,
    sizes: Array.isArray(data.sizes) ? data.sizes : [],
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
