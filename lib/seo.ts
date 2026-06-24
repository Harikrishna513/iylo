import { Product } from "@/types";
import { contactInfo } from "@/data/products";
import { ProductImages as img } from "@/lib/product-images";

export function getProductSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.longDescription ?? product.description,
    image: product.image,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: product.isPreOrder
        ? "https://schema.org/PreOrder"
        : "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "IYLO Bake House",
      },
    },
    aggregateRating: product.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewCount ?? 1,
        }
      : undefined,
  };
}

export const bakerySchema = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: "IYLO Bake House",
  description:
    "Premium artisan bakery in Indiranagar, Bangalore. Handcrafted breads, pastries, cakes, and desserts.",
  url: "https://iylobakehouse.com",
  telephone: contactInfo.phone,
  email: contactInfo.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "42, 12th Main Road, Indiranagar",
    addressLocality: "Bangalore",
    postalCode: "560038",
    addressRegion: "Karnataka",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 12.9716,
    longitude: 77.6412,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "07:00",
      closes: "21:00",
    },
  ],
  priceRange: "₹₹₹",
  servesCuisine: "Bakery",
  image: img.bannerHomeDesktop1200,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.9,
    reviewCount: 186,
    bestRating: 5,
  },
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do you deliver across Bangalore?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we deliver across Indiranagar, Koramangala, HSR, Whitefield, Jayanagar, and central Bangalore. Retail products ship PAN India.",
      },
    },
    {
      "@type": "Question",
      name: "Can I pre-order for weekends?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Weekend boxes and limited items are available for pre-order. Place your order before the cutoff time for same-weekend delivery or pickup.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer corporate gifting?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we create bespoke corporate hampers with branded packaging, GST invoices, and bulk delivery across Bangalore.",
      },
    },
  ],
};
