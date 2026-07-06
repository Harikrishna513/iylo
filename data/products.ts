import {
  Product,
  Bundle,
  Workshop,
  Announcement,
  Testimonial,
  GalleryItem,
  GiftingOption,
} from "@/types";
import { ProductImages as img } from "@/lib/product-images";
import { GALLERY_IMAGES as galleryImg } from "@/lib/gallery-images";

import { catalogProducts } from "@/data/catalog-products";
import { NAV_CATEGORIES } from "@/data/nav-categories";
import {
  BRAND_STORY,
  GOOGLE_MAPS_URL,
  PICKUP_HOURS,
  PICKUP_MESSAGE,
  STORE_ADDRESS,
  STORE_HOURS,
  STORE_LANDMARK,
} from "@/data/site-content";

export const categories = NAV_CATEGORIES;
export const products: Product[] = catalogProducts;

export const todaysSpecials: Product[] = [
  {
    id: "today-burnt-basque",
    name: "Burnt Basque Cheesecake",
    description: "Caramelised top, creamy centre, berry compote",
    price: 680,
    category: "desserts",
    image: img.nyCheesecake,
    badge: "Today's Special",
    isAvailableToday: true,
    isLimited: true,
    preparationTime: "Only 12 portions daily",
    rating: 5.0,
    reviewCount: 134,
    ingredients: ["Cream cheese", "Farm eggs", "Fresh berries"],
    allergens: ["Dairy", "Eggs", "Gluten"],
    storageInstructions: "Refrigerate and consume within 48 hours.",
  },
  {
    id: "today-cardamom-bun",
    name: "Cardamom Morning Bun",
    description: "Kerala cardamom, orange zest, pearl sugar",
    price: 260,
    category: "pastries",
    image: img.cinnamonSwirl,
    badge: "Fresh Today",
    isAvailableToday: true,
    preparationTime: "Baked at 7 AM",
    rating: 4.9,
    reviewCount: 87,
    ingredients: ["Kerala cardamom", "Orange zest", "Pearl sugar", "French butter"],
    allergens: ["Gluten", "Dairy", "Eggs"],
    storageInstructions: "Best enjoyed warm on the day of purchase.",
  },
  {
    id: "today-filter-coffee-tart",
    name: "Filter Coffee Tart",
    description: "Coorg coffee ganache, jaggery caramel, cocoa nib",
    price: 340,
    category: "desserts",
    image: img.cappuccinoCake,
    badge: "Bangalore Exclusive",
    isAvailableToday: true,
    isLimited: true,
    preparationTime: "Only 8 portions daily",
    rating: 4.9,
    reviewCount: 56,
    ingredients: ["Coorg coffee", "Jaggery caramel", "Cocoa nibs", "Butter pastry"],
    allergens: ["Gluten", "Dairy", "Eggs"],
    storageInstructions: "Refrigerate and consume within 24 hours.",
  },
];

export const weekendSpecials: Product[] = [
  {
    id: "weekend-cinnamon-roll",
    name: "Weekend Cinnamon Roll",
    description: "Brown butter, cream cheese glaze, pecan crumble",
    price: 280,
    category: "pastries",
    image: img.cinnamonSwirl,
    badge: "Weekend Only",
    isLimited: true,
    isPreOrder: true,
    isAvailableToday: false,
    preparationTime: "Pre-order by Friday 6 PM",
    rating: 4.9,
    reviewCount: 203,
    ingredients: ["Brown butter", "Cinnamon", "Cream cheese", "Pecans"],
    allergens: ["Gluten", "Dairy", "Nuts", "Eggs"],
    storageInstructions: "Best enjoyed warm. Reheat at 160°C for 5 minutes.",
  },
  {
    id: "weekend-focaccia",
    name: "Rosemary Sea Salt Focaccia",
    description: "Olive oil, fresh rosemary, Maldon salt",
    price: 380,
    category: "breads",
    image: img.multigrainLoaf,
    badge: "Saturday Special",
    isLimited: true,
    isAvailableToday: false,
    preparationTime: "Available Saturday mornings",
    rating: 4.8,
    reviewCount: 87,
    ingredients: ["Olive oil", "Fresh rosemary", "Maldon salt", "Sourdough base"],
    allergens: ["Gluten"],
    storageInstructions: "Best within 2 days. Excellent for sandwiches.",
  },
  {
    id: "weekend-brunch-box",
    name: "Jayanagar Brunch Box",
    description: "Sourdough, pastries, granola, house jam",
    price: 2200,
    category: "weekend-boxes",
    image: img.indulgenceHamper,
    badge: "Weekend Box",
    isPreOrder: true,
    preparationTime: "Pre-order by Friday 8 PM",
    rating: 5.0,
    reviewCount: 67,
    relatedProductIds: ["sourdough-boule", "almond-croissant"],
    frequentlyBoughtWith: ["artisan-granola"],
  },
];

export const bundles: Bundle[] = [
  {
    id: "breakfast-box",
    name: "Breakfast Box",
    description: "Start your Bangalore morning with artisan breads, pastries, and house-made preserves",
    price: 1800,
    originalPrice: 2200,
    image: img.luxuryGiftHamper,
    items: ["Sourdough Boule", "Croissant x2", "Granola Jar", "Seasonal Jam"],
    badge: "Most Popular",
  },
  {
    id: "celebration-box",
    name: "Celebration Box",
    description: "Perfect for birthdays, anniversaries, and special moments across Bangalore",
    price: 4500,
    originalPrice: 5200,
    image: img.dutchTruffleCake,
    items: ["Chocolate Layer Cake", "Macarons x6", "Champagne Truffles", "Gift Card"],
    badge: "Premium",
  },
  {
    id: "gifting-box",
    name: "Gifting Box",
    description: "Elegantly packaged for corporate and personal gifting",
    price: 3200,
    originalPrice: 3800,
    image: img.luxuryGiftHamper,
    items: ["Assorted Cookies", "Shortbread Tin", "Artisan Tea", "Branded Ribbon"],
  },
  {
    id: "family-box",
    name: "Family Box",
    description: "A generous spread for Sunday brunches in Jayanagar and beyond",
    price: 2800,
    originalPrice: 3400,
    image: img.indulgenceHamper,
    items: ["Brioche Loaf", "Pastries x4", "Brownies x6", "Fresh Fruit Tart"],
  },
];

export const retailProducts: Product[] = products.filter((p) => p.shipsPanIndia);

export const giftingOptions: GiftingOption[] = [
  {
    id: "corporate",
    title: "Corporate Gifting",
    description:
      "Elevate your brand with bespoke hampers, branded packaging, GST invoices, and bulk ordering for Bangalore teams and clients.",
    image: img.giftingCorporate,
    cta: "Enquire for Corporate",
    scrollTo: "corporate",
    inquiryType: "corporate",
  },
  // {
  //   id: "festive",
  //   title: "Festival Hampers",
  //   description:
  //     "Curated seasonal collections for Diwali, Christmas, Ugadi, and every celebration across Karnataka.",
  //   image: img.giftingFestive,
  //   cta: "Explore Festive",
  // },
  {
    id: "celebration",
    title: "Birthday & Wedding",
    description:
      "Birthdays, weddings, baby showers — handcrafted gifts that speak from the heart.",
    image: img.giftingCelebration,
    cta: "Shop Celebrations",
    scrollTo: "menu",
  },
  {
    id: "custom",
    title: "Custom Packaging",
    description:
      "Personalised ribbons, message cards, and premium boxes tailored to your occasion.",
    image: img.giftingCustom,
    cta: "Request Custom",
    scrollTo: "corporate",
    inquiryType: "custom",
  },
];

export const workshops: Workshop[] = [
  {
    id: "sourdough-masterclass",
    title: "Sourdough Masterclass",
    description:
      "Learn the art of sourdough from starter to scoring. Take home your own starter and a freshly baked loaf.",
    date: "June 28, 2026",
    time: "10:00 AM – 2:00 PM",
    location: "IYLO Bake House Studio, Jayanagar",
    price: 3500,
    spots: 3,
    capacity: 8,
    image: img.sourdoughLoaf,
    gallery: [img.sourdoughLoaf, img.briocheLoaf],
  },
  {
    id: "pastry-fundamentals",
    title: "Pastry Fundamentals",
    description: "Master laminated dough, croissants, and danishes with our head pastry chef.",
    date: "July 5, 2026",
    time: "9:00 AM – 1:00 PM",
    location: "IYLO Bake House Studio, Jayanagar",
    price: 4200,
    spots: 2,
    capacity: 6,
    image: img.butterCroissant,
  },
  {
    id: "cake-decorating",
    title: "Cake Decorating Workshop",
    description: "Buttercream techniques, piping, and modern minimalist cake design.",
    date: "July 12, 2026",
    time: "11:00 AM – 3:00 PM",
    location: "IYLO Bake House Studio, Jayanagar",
    price: 3800,
    spots: 5,
    capacity: 10,
    image: img.dutchTruffleCake,
  },
];

export const announcements: Announcement[] = [
  {
    id: "weekend-preorder",
    title: "Weekend Boxes — Pre-order Now",
    description: "Order by Friday 8 PM for Saturday pickup or Sunday delivery across Bangalore.",
    date: "Every Week",
    image: img.luxuryGiftHamper,
    tag: "Weekend Special",
    type: "banner",
  },
  {
    id: "monsoon-launch",
    title: "Monsoon Collection Launch",
    description: "Warm spices, filter coffee bakes, and comfort desserts for Bangalore's rainy days.",
    date: "August 1, 2026",
    image: img.mangoCreamCake,
    tag: "Seasonal Launch",
    type: "popup",
  },
  {
    id: "third-wave-collab",
    title: "Collaboration with Third Wave Coffee",
    description: "Exclusive coffee-pastry pairing menu at our Jayanagar studio.",
    date: "Ongoing",
    image: img.cappuccino,
    tag: "Collaboration",
    type: "event",
  },
  {
    id: "ganesh-chaturthi",
    title: "Ganesh Chaturthi Pre-Orders Open",
    description: "Modak-inspired pastries and festive hampers. Pre-order by August 25.",
    date: "September 2026",
    image: img.mothersDayHamper,
    tag: "Festival Menu",
    type: "banner",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Priya Sharma",
    role: "Food Blogger, Bangalore",
    content:
      "IYLO has redefined what artisan baking means in Bangalore. Every bite tells a story of patience, passion, and perfection.",
    rating: 5,
    image: img.categoryDelicacies,
    source: "google",
  },
  {
    id: "2",
    name: "Arjun Mehta",
    role: "Corporate Client, Koramangala",
    content:
      "We've been ordering corporate hampers for three years. The presentation and quality never fail to impress our clients across Bangalore.",
    rating: 5,
    image: img.categoryHamperGifting,
    source: "google",
  },
  {
    id: "3",
    name: "Ananya Reddy",
    role: "Regular Customer, Jayanagar",
    content:
      "The sourdough boule is life-changing. I cycle across Jayanagar every Saturday just for their weekend specials.",
    rating: 5,
    image: img.sourdoughLoaf,
    source: "customer",
  },
  {
    id: "4",
    name: "Rahul Kapoor",
    role: "Event Planner, Whitefield",
    content:
      "Their celebration cakes are showstoppers. I've featured IYLO at over a dozen weddings in Bangalore — always flawless.",
    rating: 5,
    image: img.tieredCake,
    source: "google",
  },
];

export const galleryItems: GalleryItem[] = [
  { id: "1", type: "image", src: galleryImg.sourdoughLoaf, alt: "Fresh bread from our Jayanagar oven", span: "tall", category: "bread" },
  { id: "2", type: "image", src: galleryImg.butterCroissant, alt: "Laminated croissants", span: "normal", category: "kitchen" },
  { id: "3", type: "image", src: galleryImg.dutchTruffleCake, alt: "Chocolate layer cake decoration", span: "wide", category: "cake" },
  { id: "4", type: "image", src: galleryImg.multigrainLoaf, alt: "Weekend pastries", span: "normal", category: "bread" },
  { id: "5", type: "image", src: galleryImg.cinnamonSwirl, alt: "Cinnamon rolls", span: "normal", category: "kitchen" },
  { id: "6", type: "image", src: galleryImg.strawberryTart, alt: "Raspberry tart finishing", span: "tall", category: "cake" },
  { id: "7", type: "image", src: galleryImg.giftHamper, alt: "Gift box packaging", span: "normal", category: "events" },
  { id: "8", type: "image", src: galleryImg.chocolateChipCookie, alt: "Cookie assortment", span: "wide", category: "kitchen" },
];

export const videoGallery = [
  {
    id: "v1",
    title: "Morning Bake",
    src: img.bannerHomeDesktop,
    thumbnail: img.bannerHomeMobile,
    category: "kitchen" as const,
  },
  {
    id: "v2",
    title: "Sourdough Scoring",
    src: img.sourdoughLoaf,
    thumbnail: img.sourdoughLoafAlt,
    category: "bread" as const,
  },
  {
    id: "v3",
    title: "Cake Decoration",
    src: img.dutchTruffleCake,
    thumbnail: img.dutchTruffleCakeAlt,
    category: "cake" as const,
  },
];

export const instagramPosts = [
  { id: "ig1", image: img.butterCroissant, alt: "Fresh croissants" },
  { id: "ig2", image: img.dutchTruffleCake, alt: "Chocolate cake" },
  { id: "ig3", image: img.sourdoughLoaf, alt: "Artisan bread" },
  { id: "ig4", image: img.lemonTart, alt: "Fruit tart" },
  { id: "ig5", image: img.premiumGiftHamper, alt: "Gift packaging" },
  { id: "ig6", image: img.assortedBrownies6, alt: "Weekend special" },
];

export const popularSearches = [
  "Sourdough",
  "Birthday cake",
  "Corporate gifting",
  "Weekend box",
  "Almond croissant",
  "Gift hamper",
];

export const timelineEvents = [
  {
    year: "Origins",
    title: "A Grandmother's Kitchen",
    description: BRAND_STORY.origin,
  },
  {
    year: "Today",
    title: "What Makes Us Different",
    description: BRAND_STORY.differentiator,
  },
  {
    year: "Vision",
    title: "Community Through Food",
    description: BRAND_STORY.values,
  },
];

export const founderMessage = {
  name: "Founder, IYLO Bakehouse",
  title: "Baker & Dreamer",
  image: img.iyloHouse,
  quote: BRAND_STORY.origin,
};

export const contactInfo = {
  phone: "+91 81057 60776",
  whatsapp: "+918105760776",
  email: "",
  instagram: "",
  address: STORE_ADDRESS,
  landmark: STORE_LANDMARK,
  storeHours: STORE_HOURS,
  pickupHours: PICKUP_HOURS,
  pickupMessage: PICKUP_MESSAGE,
  mapLink: GOOGLE_MAPS_URL,
  timings: {
    weekdays: "Wed–Fri: 11:00 AM – 8:00 PM",
    weekends: "Sat–Sun: 10:00 AM – 8:00 PM · Mon–Tue: Closed",
  },
  mapEmbed: GOOGLE_MAPS_URL,
};

export function getProductById(id: string): Product | undefined {
  return [...products, ...todaysSpecials, ...weekendSpecials, ...retailProducts].find(
    (p) => p.id === id
  );
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getAllProducts(): Product[] {
  const seen = new Set<string>();
  return [...products, ...todaysSpecials, ...weekendSpecials].filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return getAllProducts().filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.replace("-", " ").includes(q)
  );
}
