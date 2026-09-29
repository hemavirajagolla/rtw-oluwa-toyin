import type { Metadata } from "next";
import { ContactPage } from "@/components/contact-page";

export const metadata: Metadata = {
  title: "Contact | RTW by Elegant Moi",
  description: "Talk to the RTW by Elegant Moi team on WhatsApp, email or Instagram for sizing, styling and order help.",
};

export default function Contact() {
  return (
    <div className="page-shell">
      <ContactPage />
    </div>
  );
}
