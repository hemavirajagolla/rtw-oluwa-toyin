import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "./atelier.css";
import "./premium.css";
import "./checkout.css";
import "./search.css";
import "./responsive.css";
import { CartProvider } from "@/components/cart-context";
import { SiteShell } from "@/components/site-shell";
import { getAllProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "RTW by Elegant Moi | Wear Your Story",
  description:
    "Luxury African ready-to-wear for customers across Nigeria, with a refined editorial shopping experience.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const searchIndex = getAllProducts().map((product) => ({
    slug: product.slug,
    name: product.name,
    category: product.category,
    price: product.price,
    image: product.images[0],
    colors: product.colors,
    text: product.shortDescription,
    soldOut: product.soldOut,
  }));

  return (
    <html lang="en">
      <body>
        <CartProvider>
          <SiteShell searchIndex={searchIndex}>{children}</SiteShell>
        </CartProvider>
      </body>
    </html>
  );
}
