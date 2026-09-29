// The cart page shares its styles (cart list, order summary) with checkout.
import "../checkout/route.css";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) { return children; }
