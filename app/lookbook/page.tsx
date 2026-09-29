import type { Metadata } from "next";
import { LookbookPage } from "@/components/lookbook-page";

export const metadata: Metadata = {
  title: "Lookbook | RTW by Elegant Moi",
  description: "Editorial frames and fabric stories from RTW by Elegant Moi.",
};

export default function Lookbook() {
  return (
    <div className="page-shell">
      <LookbookPage />
    </div>
  );
}
