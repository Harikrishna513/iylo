import { ProductImages as img } from "@/lib/product-images";



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

  phone: string;

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

  name: "IYLO Bake House",

  rating: 4.9,

  totalReviews: 186,

  address: "42, 12th Main Road, Indiranagar, Bangalore 560038",

  phone: "+91 98765 43210",

  mapsUrl: "https://maps.google.com/?q=IYLO+Bake+House+Indiranagar+Bangalore",

  reviewUrl: "https://g.page/iylobakehouse/review",

  profileImage: img.heroHome,

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

    text: "IYLO has redefined what artisan baking means in Bangalore. The sourdough is exceptional — crackling crust, open crumb, and that warm aroma the moment you walk into their Indiranagar studio.",

    relativeTime: "2 weeks ago",

  },

  {

    id: "gr-2",

    authorName: "Arjun Mehta",

    rating: 5,

    text: "We've been ordering corporate hampers for three years. The presentation and quality never fail to impress our clients across Koramangala and Whitefield. GST invoices and on-time delivery every single time.",

    relativeTime: "1 month ago",

  },

  {

    id: "gr-3",

    authorName: "Ananya Reddy",

    rating: 5,

    text: "The sourdough boule is life-changing. I cycle across Indiranagar every Saturday just for their weekend specials. The almond croissant alone is worth the trip.",

    relativeTime: "3 weeks ago",

  },

  {

    id: "gr-4",

    authorName: "Rahul Kapoor",

    rating: 5,

    text: "Their celebration cakes are showstoppers. I've featured IYLO at over a dozen weddings in Bangalore — always flawless delivery, always breathtaking presentation.",

    relativeTime: "1 month ago",

  },

  {

    id: "gr-5",

    authorName: "Meera Krishnan",

    rating: 5,

    text: "Ordered the midnight chocolate layer cake for my husband's birthday. Delivered on time, tasted incredible, and the gold leaf detail made it feel truly premium. Will order again.",

    relativeTime: "2 months ago",

  },

  {

    id: "gr-6",

    authorName: "Vikram Joshi",

    rating: 4,

    text: "Excellent filter coffee tart — a Bangalore exclusive that actually delivers. Pickup from the bake house is a lovely experience. Only wish they had more seating.",

    relativeTime: "3 weeks ago",

  },

  {

    id: "gr-7",

    authorName: "Sneha Patel",

    rating: 5,

    text: "The weekend brunch box is perfect for Sunday mornings. Fresh sourdough, flaky pastries, and their house jam — everything feels handcrafted with real care.",

    relativeTime: "1 week ago",

  },

  {

    id: "gr-8",

    authorName: "Karthik Nair",

    rating: 5,

    text: "Attended the sourdough masterclass — learned so much and took home my own starter. Ananya and the team are passionate, patient, and incredibly skilled.",

    relativeTime: "2 months ago",

  },

];

