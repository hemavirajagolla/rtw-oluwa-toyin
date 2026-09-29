import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// Demo builds set SITE_NOINDEX=1 so search engines skip the test address.
const noindex = process.env.SITE_NOINDEX === "1";

export default function robots(): MetadataRoute.Robots {
  if (noindex) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://www.oluwatowin.com/sitemap.xml",
  };
}
