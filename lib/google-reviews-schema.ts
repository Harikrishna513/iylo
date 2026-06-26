import { googleBusiness, googleReviews } from "@/data/google-reviews";

export function getGoogleReviewsSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: googleBusiness.name,
    image: googleBusiness.profileImage,
    address: {
      "@type": "PostalAddress",
      streetAddress: "No. 476/65, 7th Main, 33rd Cross, 4th Block, Jayanagar",
      addressLocality: "Bangalore",
      postalCode: "560011",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    telephone: googleBusiness.phone,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: googleBusiness.rating,
      reviewCount: googleBusiness.totalReviews,
      bestRating: 5,
      worstRating: 1,
    },
    review: googleReviews.slice(0, 5).map((r) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: r.authorName,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
      },
      reviewBody: r.text,
    })),
  };
}
