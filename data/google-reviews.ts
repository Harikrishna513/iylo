import { ProductImages as img } from "@/lib/product-images";
import { STORE_ADDRESS, GOOGLE_MAPS_URL } from "@/data/site-content";

export interface GoogleReview {
  id: string;
  authorName: string;
  authorUrl?: string;
  profilePhotoUrl?: string;
  rating: number;
  text: string;
  relativeTime: string;
}

export interface GoogleBusinessInfo {
  name: string;
  rating: number;
  totalReviews: number;
  address: string;
  phone?: string;
  mapsUrl: string;
  reviewUrl: string;
  placeId?: string;
  profileImage?: string;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export const googleBusiness: GoogleBusinessInfo = {
  name: "IYLO Bakehouse",
  rating: 4.9,
  totalReviews: 186,
  address: STORE_ADDRESS,
  mapsUrl: GOOGLE_MAPS_URL,
  reviewUrl: GOOGLE_MAPS_URL,
  profileImage: img.iyloHouse,
  ratingDistribution: {
    5: 162,
    4: 18,
    3: 4,
    2: 1,
    1: 1,
  },
};

export const googleReviews: GoogleReview[] = [
  {
    id: "gr-1",
    authorName: "Priya Sharma",
    rating: 5,
    text: "IYLO has redefined what artisan eggless baking means in Bangalore. The flavours feel familiar yet beautifully reconstructed — every visit to their Jayanagar studio is a treat.",
    relativeTime: "2 weeks ago",
  },
  {
    id: "gr-2",
    authorName: "Arjun Mehta",
    rating: 5,
    text: "We've been ordering corporate hampers for gifting. The presentation and quality never fail to impress our clients. GST invoices and on-time delivery every single time.",
    relativeTime: "1 month ago",
  },
  {
    id: "gr-3",
    authorName: "Ananya Reddy",
    rating: 5,
    text: "The celebration cakes are outstanding. I visit every weekend for their specials — the eggless bakes are genuinely premium and full of flavour.",
    relativeTime: "3 weeks ago",
  },
  {
    id: "gr-4",
    authorName: "Rahul Kapoor",
    rating: 5,
    text: "Their celebration cakes are showstoppers. I've featured IYLO at over a dozen events in Bangalore — always flawless delivery, always breathtaking presentation.",
    relativeTime: "1 month ago",
  },
  {
    id: "gr-5",
    authorName: "Meera Krishnan",
    rating: 5,
    text: "Ordered a custom eggless cake for my husband's birthday. Delivered on time, tasted incredible, and felt truly premium. Will order again.",
    relativeTime: "2 months ago",
  },
  {
    id: "gr-6",
    authorName: "Vikram Joshi",
    rating: 4,
    text: "Excellent gourmet desserts and a lovely pickup experience at Jayanagar. Only wish they had more seating.",
    relativeTime: "3 weeks ago",
  },
  {
    id: "gr-7",
    authorName: "Sneha Patel",
    rating: 5,
    text: "The gifting hampers are perfect for festivals. Everything feels handcrafted with real care and intent.",
    relativeTime: "1 week ago",
  },
  {
    id: "gr-8",
    authorName: "Karthik Nair",
    rating: 5,
    text: "Love the community feel at IYLO — you can tell they bake with purpose. The eggless cookies and viennoiserie are my favourites.",
    relativeTime: "2 months ago",
  },
];
