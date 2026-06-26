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

import {
  BRAND_STORY,
  GOOGLE_MAPS_URL,
  PICKUP_HOURS,
  PICKUP_MESSAGE,
  PRODUCT_CATEGORIES,
  STORE_ADDRESS,
  STORE_HOURS,
  STORE_LANDMARK,
} from "@/data/site-content";

export const categories = PRODUCT_CATEGORIES;

const baseIngredients = {
  bread: ["Organic stone-ground flour", "Filtered water", "Himalayan pink salt", "Wild yeast starter"],
  cake: ["Valrhona chocolate", "French butter", "Farm eggs", "Madagascar vanilla"],
};

export const products: Product[] = [
  {
    id: "sourdough-boule",
    name: "Heritage Sourdough Boule",
    description: "48-hour fermented, crackling crust, open crumb",
    longDescription:
      "Our signature sourdough begins with a 12-year-old starter, fed daily with organic stone-ground flour from a Karnataka mill. Each boule undergoes a 48-hour cold fermentation for depth of flavour and that perfect, crackling crust — the kind that echoes through Jayanagar on Saturday mornings.",
    price: 450,
    category: "breads",
    image: img.sourdoughLoaf,
    images: [img.sourdoughLoaf, img.sourdoughLoafAlt],
    badge: "Bestseller",
    isBestSeller: true,
    isAvailableToday: true,
    preparationTime: "Baked fresh daily by 7 AM",
    rating: 4.9,
    reviewCount: 128,
    ingredients: baseIngredients.bread,
    allergens: ["Gluten"],
    storageInstructions: "Store in a bread bag at room temperature for 3 days. Slice and freeze for up to 2 weeks.",
    relatedProductIds: ["brioche-loaf", "almond-croissant"],
    frequentlyBoughtWith: ["artisan-granola", "lavender-shortbread"],
  },
  {
    id: "chocolate-layer-cake",
    name: "Midnight Chocolate Layer Cake",
    description: "Valrhona dark chocolate, salted caramel, gold leaf",
    longDescription:
      "Six layers of Valrhona Guanaja dark chocolate sponge, filled with salted caramel ganache and finished with edible gold leaf. A celebration centrepiece crafted for Bangalore's finest occasions.",
    price: 2800,
    category: "cakes",
    image: img.dutchTruffleCake,
    badge: "Signature",
    isAvailableToday: true,
    preparationTime: "24 hours advance notice",
    rating: 5.0,
    reviewCount: 89,
    ingredients: [...baseIngredients.cake, "Edible gold leaf", "Sea salt caramel"],
    allergens: ["Gluten", "Dairy", "Eggs"],
    storageInstructions: "Refrigerate and consume within 48 hours. Bring to room temperature before serving.",
    relatedProductIds: ["red-velvet-cupcake", "celebration-gift-box"],
    frequentlyBoughtWith: ["tiramisu-jar", "raspberry-tart"],
  },
  {
    id: "almond-croissant",
    name: "Almond Croissant",
    description: "Twice-baked, frangipane, toasted almonds",
    longDescription:
      "Laminated with French butter over three days, twice-baked with house-made frangipane and finished with toasted almonds. A morning ritual for our Jayanagar regulars.",
    price: 320,
    category: "pastries",
    image: img.butterCroissant,
    isAvailableToday: true,
    preparationTime: "Ready by 8 AM",
    rating: 4.8,
    reviewCount: 256,
    ingredients: ["French butter", "Almond flour", "Toasted almonds", "Frangipane"],
    allergens: ["Gluten", "Dairy", "Nuts", "Eggs"],
    storageInstructions: "Best enjoyed fresh. Store at room temperature for up to 24 hours.",
    relatedProductIds: ["raspberry-tart", "matcha-financier"],
    frequentlyBoughtWith: ["sourdough-boule"],
  },
  {
    id: "lavender-shortbread",
    name: "Lavender Shortbread",
    description: "French butter, dried lavender, raw sugar",
    price: 580,
    category: "cookies",
    image: img.butterCookies,
    isNew: true,
    badge: "New",
    isAvailableToday: true,
    preparationTime: "Ready by 9 AM",
    rating: 4.7,
    reviewCount: 64,
    ingredients: ["French butter", "Dried lavender", "Raw sugar", "Organic flour"],
    allergens: ["Gluten", "Dairy"],
    storageInstructions: "Store in an airtight tin for up to 2 weeks.",
    relatedProductIds: ["matcha-financier", "artisan-granola"],
    frequentlyBoughtWith: ["tiramisu-jar"],
  },
  {
    id: "tiramisu-jar",
    name: "Artisan Tiramisu Jar",
    description: "Mascarpone, espresso-soaked ladyfingers, cocoa",
    price: 420,
    category: "desserts",
    image: img.tiramisuCup,
    isAvailableToday: true,
    preparationTime: "Made fresh daily",
    rating: 4.9,
    reviewCount: 112,
    ingredients: ["Mascarpone", "Espresso", "Ladyfingers", "Dutch cocoa"],
    allergens: ["Gluten", "Dairy", "Eggs"],
    storageInstructions: "Refrigerate and consume within 3 days.",
    relatedProductIds: ["matcha-financier", "red-velvet-cupcake"],
    frequentlyBoughtWith: ["lavender-shortbread"],
  },
  {
    id: "celebration-gift-box",
    name: "Celebration Gift Box",
    description: "Curated selection of our finest bakes",
    price: 3500,
    category: "gift-boxes",
    image: img.luxuryGiftHamper,
    badge: "Gift Favorite",
    isAvailableToday: true,
    preparationTime: "24 hours advance notice",
    rating: 5.0,
    reviewCount: 45,
    relatedProductIds: ["chocolate-layer-cake", "artisan-granola"],
    frequentlyBoughtWith: ["lavender-shortbread", "matcha-financier"],
  },
  {
    id: "artisan-granola",
    name: "House-Made Artisan Granola",
    description: "Maple, pecans, dried cranberries, coconut",
    price: 680,
    category: "retail",
    image: img.almondRocks,
    badge: "PAN India",
    shipsPanIndia: true,
    preparationTime: "Ships in 2–4 business days",
    rating: 4.6,
    reviewCount: 38,
    ingredients: ["Rolled oats", "Maple syrup", "Pecans", "Dried cranberries", "Coconut"],
    allergens: ["Nuts", "Gluten"],
    storageInstructions: "Store in a cool, dry place for up to 6 weeks.",
    relatedProductIds: ["lavender-shortbread", "matcha-financier"],
    frequentlyBoughtWith: ["sourdough-boule"],
  },
  {
    id: "festive-stollen",
    name: "Monsoon Spice Stollen",
    description: "Marzipan-filled, aged rum, candied citrus",
    price: 1200,
    category: "seasonal",
    image: img.carrotCake,
    badge: "Limited Edition",
    isLimited: true,
    isPreOrder: true,
    preparationTime: "Pre-order 48 hours ahead",
    rating: 4.9,
    reviewCount: 27,
    ingredients: ["Marzipan", "Aged rum", "Candied citrus", "Warm spices"],
    allergens: ["Gluten", "Dairy", "Nuts", "Eggs"],
    storageInstructions: "Wrap tightly and store for up to 2 weeks. Flavours deepen with age.",
    relatedProductIds: ["celebration-gift-box"],
    frequentlyBoughtWith: ["lavender-shortbread"],
  },
  {
    id: "brioche-loaf",
    name: "Golden Brioche Loaf",
    description: "Enriched with French butter and farm eggs",
    price: 520,
    category: "breads",
    image: img.briocheLoaf,
    isAvailableToday: true,
    preparationTime: "Baked fresh daily",
    rating: 4.8,
    reviewCount: 94,
    ingredients: ["French butter", "Farm eggs", "Organic flour", "Milk"],
    allergens: ["Gluten", "Dairy", "Eggs"],
    storageInstructions: "Best within 2 days. Excellent for French toast when slightly stale.",
    relatedProductIds: ["sourdough-boule"],
    frequentlyBoughtWith: ["almond-croissant"],
  },
  {
    id: "raspberry-tart",
    name: "Raspberry Frangipane Tart",
    description: "Almond cream, fresh raspberries, pistachio",
    price: 380,
    category: "pastries",
    image: img.strawberryTart,
    isAvailableToday: true,
    preparationTime: "Ready by 10 AM",
    rating: 4.9,
    reviewCount: 73,
    ingredients: ["Almond cream", "Fresh raspberries", "Pistachio", "Butter pastry"],
    allergens: ["Gluten", "Dairy", "Nuts", "Eggs"],
    storageInstructions: "Refrigerate and consume within 24 hours.",
    relatedProductIds: ["almond-croissant", "tiramisu-jar"],
    frequentlyBoughtWith: ["matcha-financier"],
  },
  {
    id: "red-velvet-cupcake",
    name: "Red Velvet Cupcake",
    description: "Cream cheese frosting, Madagascar vanilla",
    price: 180,
    category: "cakes",
    image: img.redVelvetCupcake,
    isBestSeller: true,
    isAvailableToday: true,
    preparationTime: "Ready by 9 AM",
    rating: 4.7,
    reviewCount: 156,
    ingredients: ["Cocoa", "Buttermilk", "Cream cheese", "Madagascar vanilla"],
    allergens: ["Gluten", "Dairy", "Eggs"],
    storageInstructions: "Refrigerate and consume within 48 hours.",
    relatedProductIds: ["chocolate-layer-cake"],
    frequentlyBoughtWith: ["tiramisu-jar"],
  },
  {
    id: "matcha-financier",
    name: "Matcha Financier",
    description: "Uji matcha, brown butter, almond flour",
    price: 240,
    category: "cookies",
    image: img.egglessHazelnutCookies,
    isNew: true,
    badge: "New",
    isAvailableToday: true,
    preparationTime: "Ready by 9 AM",
    rating: 4.8,
    reviewCount: 42,
    ingredients: ["Uji matcha", "Brown butter", "Almond flour", "Egg whites"],
    allergens: ["Nuts", "Dairy", "Eggs", "Gluten"],
    storageInstructions: "Store in an airtight container for up to 5 days.",
    relatedProductIds: ["lavender-shortbread", "tiramisu-jar"],
    frequentlyBoughtWith: ["artisan-granola"],
  },
];

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
    image: img.luxuryGiftHamper,
    cta: "Enquire for Corporate",
  },
  {
    id: "festive",
    title: "Festival Hampers",
    description:
      "Curated seasonal collections for Diwali, Christmas, Ugadi, and every celebration across Karnataka.",
    image: img.carrotCake,
    cta: "Explore Festive",
  },
  {
    id: "celebration",
    title: "Birthday & Wedding",
    description:
      "Birthdays, weddings, baby showers — handcrafted gifts that speak from the heart.",
    image: img.tieredCake,
    cta: "Shop Celebrations",
  },
  {
    id: "custom",
    title: "Custom Packaging",
    description:
      "Personalised ribbons, message cards, and premium boxes tailored to your occasion.",
    image: img.premiumGiftHamper,
    cta: "Request Custom",
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
  { id: "1", type: "image", src: img.sourdoughLoaf, alt: "Fresh bread from our Jayanagar oven", span: "tall", category: "bread" },
  { id: "2", type: "image", src: img.butterCroissant, alt: "Laminated croissants", span: "normal", category: "kitchen" },
  { id: "3", type: "image", src: img.dutchTruffleCake, alt: "Chocolate layer cake decoration", span: "wide", category: "cake" },
  { id: "4", type: "image", src: img.multigrainLoaf, alt: "Weekend pastries", span: "normal", category: "bread" },
  { id: "5", type: "image", src: img.cinnamonSwirl, alt: "Cinnamon rolls", span: "normal", category: "kitchen" },
  { id: "6", type: "image", src: img.strawberryTart, alt: "Raspberry tart finishing", span: "tall", category: "cake" },
  { id: "7", type: "image", src: img.luxuryGiftHamper, alt: "Gift box packaging", span: "normal", category: "events" },
  { id: "8", type: "image", src: img.chocolateChipCookie, alt: "Cookie assortment", span: "wide", category: "kitchen" },
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
  image: img.heroHome,
  quote: BRAND_STORY.origin,
};

export const contactInfo = {
  phone: "",
  whatsapp: "",
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
