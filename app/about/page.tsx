import type { Metadata } from "next";
import { StoryPage } from "@/components/story-page";

export const metadata: Metadata = {
  title: "Our story | RTW by Elegant Moi",
  description: "Luxury African ready-to-wear crafted with African heart and European elegance.",
};

export default function AboutPage() {
  return (
    <div className="page-shell">
      <StoryPage />
    </div>
  );
}
