/** Client-provided content from IYLO-Client-Content-Requirements.docx */

export const BRAND_NAME = "IYLO Bakehouse";

export const BUSINESS_DESCRIPTION =
  "A contemporary and premium bakehouse dedicated to modern baking and specialising in eggless creations, across sweet and savoury products.";

export const BRAND_STORY = {
  origin:
    "I have always had a passion for baking, and I started cooking and baking because of my grandmother. I always had a very special connection with her through food. I started this bakery as a way of living our combined dream of bringing people together through the love for food.",
  differentiator:
    "We want to try and bring to the people, flavours that they are familiar with, but in a new and reconstructed manner. We want to make an effort to make everyday special through the variations of products that we offer.",
  values:
    "Customers need to remember our values of bringing people together as a community through the medium of our products. We believe in serving customers with intent, and curating the best experience for them through our products.",
};

export const STORE_ADDRESS =
  "No. 476/65, 7th Main, 33rd Cross, 4th Block, Jayanagar, Bangalore – 560011";

export const STORE_LANDMARK = "Next to Ajfan Dates and Nuts, Jayanagar, 4th Block";

export const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/yJ5Ypo7Tm168wiHr7";

export const STORE_HOURS = [
  { label: "Monday – Tuesday", value: "Closed" },
  { label: "Wednesday – Friday", value: "11:00 AM – 8:00 PM (subject to change)" },
  { label: "Saturday – Sunday", value: "10:00 AM – 8:00 PM (subject to change)" },
] as const;

export const PICKUP_HOURS = "11:00 AM – 6:00 PM";

export const PICKUP_MESSAGE =
  "We'd love to welcome you to our bakery and let you experience the aroma of our freshly baked creations.";

export const MIN_ORDER_AMOUNT = 499;
export const FREE_DELIVERY_ABOVE = 999;

export const PREORDER_MIN_DAYS = "1–2 days";

export const PRODUCT_CATEGORIES = [
  { id: "cakes", label: "Celebration Cakes" },
  { id: "cookies", label: "Cookies" },
  { id: "breads", label: "Breads" },
  { id: "custom-cakes", label: "Custom Cakes" },
  { id: "pastries", label: "Viennoiserie" },
  { id: "desserts", label: "Gourmet Desserts" },
  { id: "gift-boxes", label: "Gifting" },
  { id: "retail", label: "Tarts & Retail" },
  { id: "workshops", label: "Workshops", href: "#workshops" },
] as const;
