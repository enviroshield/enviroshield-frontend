/**
 * URL Redirects Mapping Configuration
 *
 * Maps legacy, alternate, and alias URL conventions to their canonical destinations.
 * Used by next.config.ts for server-side HTTP 308 (permanent) redirects.
 */

export type UrlRedirectRule = {
  source: string;
  destination: string;
  permanent: boolean;
  reason: string;
  evidence: string;
  status: "active" | "pending";
};

export const urlRedirects: UrlRedirectRule[] = [
  {
    source: "/about-us",
    destination: "/about",
    permanent: true,
    reason: "Alternate common path matching navigation label 'About Us'",
    evidence: "Navigation label in Header component and common legacy backlink pattern",
    status: "active",
  },
  {
    source: "/contact-us",
    destination: "/contact",
    permanent: true,
    reason: "Alternate common path matching navigation label 'Contact Us'",
    evidence: "Navigation label in Header component and common legacy backlink pattern",
    status: "active",
  },
  {
    source: "/service",
    destination: "/services",
    permanent: true,
    reason: "Singular alias for services listing route",
    evidence: "Backend API module convention /service mapped to frontend /services",
    status: "active",
  },
  {
    source: "/service/:slug*",
    destination: "/services/:slug*",
    permanent: true,
    reason: "Legacy WordPress service permalink",
    evidence: "Migration mapping",
    status: "active",
  },
  {
    source: "/project",
    destination: "/projects",
    permanent: true,
    reason: "Singular alias for projects listing route",
    evidence: "Backend API module convention /project mapped to frontend /projects",
    status: "active",
  },
  {
    source: "/project/:slug*",
    destination: "/projects/:slug*",
    permanent: true,
    reason: "Legacy WordPress project permalink",
    evidence: "Migration mapping",
    status: "active",
  },
  {
    source: "/product",
    destination: "/products",
    permanent: true,
    reason: "Singular alias for products catalog route",
    evidence: "Backend API module convention /product mapped to frontend /products",
    status: "active",
  },
  {
    source: "/product/:slug*",
    destination: "/products/:slug*",
    permanent: true,
    reason: "Legacy WordPress product permalink",
    evidence: "Migration mapping",
    status: "active",
  },
  {
    source: "/blogs",
    destination: "/blog",
    permanent: true,
    reason: "Plural alias for blog journal route",
    evidence: "Backend API module convention /blogs mapped to frontend /blog",
    status: "active",
  },
  {
    source: "/blogs/:slug*",
    destination: "/blog/:slug*",
    permanent: true,
    reason: "Legacy blog permalink alias",
    evidence: "Migration mapping",
    status: "active",
  },
];
