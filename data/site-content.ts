/** Client-provided content from IYLO-Client-Content-Requirements.docx */

export const BRAND_NAME = "IYLO Bakehouse";

/** Brand palette — update here to change colors app-wide */
export const BRAND_COLORS = {
  maroon: "#451519",
  lightBlue: "#99BEE0",
  rosewood: "#6B2A31",
  mistBlue: "#DCEBF7",
} as const;

// ── Contact — edit this block only; site-wide links update automatically ──
export const CONTACT = {
  founderName: "SHRADDHA RAJESH",
  /** 10-digit mobile without country code */
  phone: "7625096799",
  whatsapp: "7625096799",
  email: "shraddharajesh@iylobakehouse.com",
  website: "https://iylobakehouse.com",
  instagram: "https://www.instagram.com/iylo.bakehouse/",
  facebook: "",
  googleBusiness: "",
  youtube: "",
  googleReviewUrl: "",
} as const;

/** Display format for phone */
export const CONTACT_PHONE = `+91 ${CONTACT.phone}`;

/** E.164-style WhatsApp number (no spaces) */
export const CONTACT_WHATSAPP = `+91${CONTACT.phone}`;

export function contactPhoneDigits(): string {
  return CONTACT.whatsapp.replace(/\D/g, "") || `91${CONTACT.phone}`;
}

export function contactPhoneTel(): string {
  return CONTACT_PHONE.replace(/\s/g, "");
}

export function telUrl(): string {
  return `tel:${contactPhoneTel()}`;
}

export function whatsAppUrl(): string {
  return `https://wa.me/${contactPhoneDigits()}`;
}

export function mailtoUrl(): string {
  return CONTACT.email ? `mailto:${CONTACT.email}` : "";
}

export function websiteUrl(): string {
  return CONTACT.website.replace(/\/$/, "");
}

/** @iylo.bakehouse — for display */
export function instagramHandle(): string {
  const raw = CONTACT.instagram.trim();
  if (!raw) return "";
  if (raw.startsWith("@")) return raw;
  const match = raw.match(/instagram\.com\/([^/?#]+)/i);
  if (match) return `@${match[1]}`;
  return raw.startsWith("@") ? raw : `@${raw.replace(/^@/, "")}`;
}

export function instagramUrl(): string {
  const raw = CONTACT.instagram.trim();
  if (!raw) return "";
  if (raw.startsWith("http")) return raw.replace(/\/$/, "");
  const handle = raw.replace("@", "");
  return `https://www.instagram.com/${handle}/`;
}

export function facebookUrl(): string {
  const raw = CONTACT.facebook.trim();
  if (!raw) return "";
  return raw.startsWith("http") ? raw : `https://facebook.com/${raw.replace(/^@/, "")}`;
}

export function youtubeUrl(): string {
  const raw = CONTACT.youtube.trim();
  if (!raw) return "";
  return raw.startsWith("http") ? raw : `https://youtube.com/${raw}`;
}

export const BUSINESS_DESCRIPTION =
  "A contemporary and premium bakehouse dedicated to modern baking and specialising in eggless creations, across sweet and savoury products.";

export const BRAND_STORY = {
  intro:
    "At our core, we believe that great things cannot be rushed. Iylo Bakehouse was born from the belief that baking is about so much more than the food on the plate. We choose patience, craft, and connection over shortcuts. To us, every day is a celebration, and we want our bakes to be the medium that brings people together.",
  founder:
    "I am Shraddha Rajesh, the founder of Iylo Bakehouse. My passion for cooking and baking began as a young girl, standing alongside my grandmother. To me, her kitchen was never just a place to cook—it was a safe space where I learned some of my most important life lessons. Honoring her teachings, combined with my professional training as a pastry chef, I built Iylo. It is a brand focused on creating memories, fostering connection, and bringing people together through our carefully crafted bakes.",
  mission:
    "To craft a memorable experience for you every single time. We bake with purpose and serve with intent, bringing people together around the simple joy of exceptional food.",
  vision:
    "To create a space where professional craft meets the comforting warmth of home, making every milestone sweeter and every quiet moment worth pausing for.",
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

/** Product detail page — pickup, help, delivery & storage copy (edit here) */
export const PRODUCT_DETAIL_INFO = {
  pickup: {
    locationLabel: `Pickup available at ${BRAND_NAME}`,
    readyIn: "Usually ready in 24 hours",
    storeInfoHref: "/#contact",
    storeInfoLabel: "View store information",
  },
  needHelp: {
    title: "Need Help?",
    phoneDisplay: CONTACT_PHONE,
    body: `Call or WhatsApp ${CONTACT.phone} for order customisation or for more information.`,
  },
  delivery: {
    title: "Delivery",
    paragraphs: [
      "We ship via third party partners hence please ensure someone is available to collect the order at given time slot and address.",
      "Delivery person may call you for directions if required.",
      `Deliveries are prepaid. Please do not pay to the delivery person and ask them to call ${CONTACT.phone} if they have any concerns.`,
    ],
  },
  storage: {
    title: "Storage and Serving",
    paragraphs: [
      "Cakes, Brownies, Muffins, Cookies — If refrigerated, either keep at room temperature for 30 mins or microwave for 10 seconds for best consumption. Since our cakes are butter cakes, the butter freezes in the fridge.",
      "To preserve freshness — All our baking products are best stored in airtight containers when refrigerated.",
    ],
    closing: "Happy Cakeday to you!",
  },
} as const;

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

export const contactInfo = {
  founderName: CONTACT.founderName,
  phone: CONTACT_PHONE,
  whatsapp: CONTACT_WHATSAPP,
  email: CONTACT.email,
  website: websiteUrl(),
  instagram: instagramHandle(),
  instagramUrl: instagramUrl(),
  facebook: CONTACT.facebook,
  facebookUrl: facebookUrl(),
  googleBusiness: CONTACT.googleBusiness,
  youtube: CONTACT.youtube,
  youtubeUrl: youtubeUrl(),
  googleReviewUrl: CONTACT.googleReviewUrl,
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
