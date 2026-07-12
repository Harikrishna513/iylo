export type Category =
  | "celebration-cakes"
  | "viennoiserie"
  | "cake-slices"
  | "breads"
  | "tarts"
  | "cookies"
  | "cheesecakes"
  | "cakes"
  | "pastries"
  | "desserts"
  | "gift-boxes"
  | "retail"
  | "seasonal"
  | "weekend-boxes";

export type ProductBadge =
  | "New"
  | "Bestseller"
  | "Limited Edition"
  | "Signature"
  | "Gift Favorite"
  | "Weekend Only"
  | "Pre-Order"
  | "Saturday Special"
  | "Most Popular"
  | "Premium"
  | "PAN India";

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  offerPrice?: number;
}

export interface Product {
  id: string;
  dbId?: string;
  variantId?: string;
  variantName?: string;
  variants?: ProductVariant[];
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  category: Category;
  image: string;
  images?: string[];
  video?: string;
  badge?: ProductBadge | string;
  isLimited?: boolean;
  isPreOrder?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  isAvailableToday?: boolean;
  shipsPanIndia?: boolean;
  preparationTime?: string;
  rating?: number;
  reviewCount?: number;
  ingredients?: string[];
  allergens?: string[];
  storageInstructions?: string;
  relatedProductIds?: string[];
  frequentlyBoughtWith?: string[];
}

export interface Bundle {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  items: string[];
  badge?: string;
}

export interface Workshop {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  spots: number;
  capacity: number;
  image: string;
  gallery?: string[];
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  tag: string;
  type?: "popup" | "banner" | "closure" | "event";
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
  source?: "google" | "instagram" | "customer";
}

export interface GalleryItem {
  id: string;
  type: "image" | "video";
  src: string;
  alt: string;
  span?: "wide" | "tall" | "normal";
  category?: "kitchen" | "bread" | "cake" | "events" | "workshop";
}

export interface CartItem {
  product: Product;
  quantity: number;
  giftWrap?: boolean;
  variantId?: string;
}

export interface GiftingOption {
  id: string;
  title: string;
  description: string;
  image: string;
  cta: string;
  /** Section id to smooth-scroll to when CTA is clicked */
  scrollTo?: string;
  /** Pre-select enquiry form type when scrolling to corporate section */
  inquiryType?: "corporate" | "custom";
}

export interface DeliverySlot {
  date: string;
  label: string;
  slots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  label: string;
  available: boolean;
  cutoffHour: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  pincodes: string[];
  fee: number;
  estimatedMinutes: number;
}

export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  deliveryMethod: "delivery" | "pickup" | "retail-shipping";
  deliveryDate: string;
  deliverySlot: string;
  coupon: string;
  giftWrap: boolean;
  notes: string;
  company?: string;
  gst?: string;
}

export type CheckoutStep =
  | "cart"
  | "login"
  | "method"
  | "location"
  | "date"
  | "address"
  | "coupon"
  | "payment"
  | "confirmation";
