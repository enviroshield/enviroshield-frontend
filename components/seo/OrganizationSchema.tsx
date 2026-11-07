import { siteUrl } from "@/lib/site-url";

export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": [
          "Organization",
          "LocalBusiness",
          "HomeAndConstructionBusiness",
        ],
        "@id": `${siteUrl}/#organization`,
        name: "Enviro Shield Pvt. Ltd.",
        alternateName: "Enviroshield",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          "@id": `${siteUrl}/#logo`,
          url: `${siteUrl}/images/logo.png`,
          contentUrl: `${siteUrl}/images/logo.png`,
          caption: "Enviro Shield Pvt. Ltd.",
        },
        image: `${siteUrl}/images/logo.png`,
        description:
          "Waterproofing, industrial flooring, and protective construction solutions provider in Bangladesh.",
        telephone: "+8801613220101",
        email: "enviroshield.bd@gmail.com",
        address: {
          "@type": "PostalAddress",
          streetAddress:
            "House No: 22/13-15, Block-B, Bauniabad R/A, Mirpur 11",
          addressLocality: "Pallabi, Dhaka",
          postalCode: "1216",
          addressCountry: "BD",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+8801613220101",
            contactType: "customer service",
            areaServed: "BD",
            availableLanguage: ["en", "bn"],
          },
        ],
        sameAs: [
          "https://www.facebook.com/",
          "https://www.linkedin.com/",
          "https://www.instagram.com/",
        ],
        priceRange: "৳৳",
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Enviro Shield",
        description:
          "Waterproofing, industrial flooring, and protective construction solutions provider in Bangladesh.",
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}
