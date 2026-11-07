import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        // Private auth and account pages
        "/dashboard/",
        "/api/",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/verify-email",

        // Transactional and customer utility pages
        "/cart",
        "/checkout",
        "/checkout/",
        "/checkout/success",
        "/services/booking-success",

        // Internal query parameters and duplicate crawl traps
        "/*?*search=*",
        "/*?*filter=*",
        "/*?*sort=*",
      ],
    },

    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
