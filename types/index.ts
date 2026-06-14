export type Category =
  | "cakes"
  | "breads"
  | "cookies"
  | "pastries"
  | "desserts"
  | "gift-boxes"
  | "retail"
  | "seasonal";

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  category: Category;
  image: string;
  images?: string[];
  badge?: string;
  isLimited?: boolean;
  isPreOrder?: boolean;
  rating?: number;
  reviewCount?: number;
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
  image: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  tag: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

export interface GalleryItem {
  id: string;
  type: "image" | "video";
  src: string;
  alt: string;
  span?: "wide" | "tall" | "normal";
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface GiftingOption {
  id: string;
  title: string;
  description: string;
  image: string;
  cta: string;
}
