"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
  category: string;
};

type CatalogEntry = { slug: string; name: string; price: number; image: string; category: string; soldOut: boolean };

type CartContextValue = {
  unavailable: string[];
  dismissUnavailable: () => void;
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  updateQuantity: (slug: string, size: string, change: number) => void;
  removeItem: (slug: string, size: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children, catalog = [] }: { children: ReactNode; catalog?: CatalogEntry[] }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [unavailable, setUnavailable] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem("oluwatowin-cart");
    let storedItems: CartItem[] = [];

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as CartItem[];
        storedItems = Array.isArray(parsed) ? parsed : [];
      } catch {
        window.localStorage.removeItem("oluwatowin-cart");
      }
    }

    // Schedule hydration after the effect body so React does not perform a
    // cascading synchronous render while reading the browser-only cart store.
    // A bag saved earlier may hold pieces that are now sold out or removed: drop them and refresh names, prices and photos.
    const gone: string[] = [];
    const current = storedItems.flatMap((item) => {
      const live = catalog.find((entry) => entry.slug === item.slug);
      if (!live || live.soldOut) {
        gone.push(item.name);
        return [];
      }
      return [{ ...item, name: live.name, price: live.price, image: live.image, category: live.category }];
    });

    queueMicrotask(() => {
      setItems(current);
      setUnavailable([...new Set(gone)]);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem("oluwatowin-cart", JSON.stringify(items));
    }
  }, [hydrated, items]);

  const addToCart = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    setItems((current) => {
      const nextItem = { ...item, quantity: item.quantity ?? 1 };
      const match = current.find(
        (entry) => entry.slug === nextItem.slug && entry.size === nextItem.size,
      );

      if (match) {
        return current.map((entry) =>
          entry.slug === nextItem.slug && entry.size === nextItem.size
            ? { ...entry, quantity: entry.quantity + nextItem.quantity }
            : entry,
        );
      }

      return [...current, nextItem];
    });
  };

  const updateQuantity = (slug: string, size: string, change: number) => {
    setItems((current) =>
      current
        .map((item) =>
          item.slug === slug && item.size === size
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (slug: string, size: string) => {
    setItems((current) =>
      current.filter((item) => !(item.slug === slug && item.size === size)),
    );
  };

  const clearCart = () => setItems([]);

  const cartCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{ unavailable, dismissUnavailable: () => setUnavailable([]), items, addToCart, updateQuantity, removeItem, clearCart, cartCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
