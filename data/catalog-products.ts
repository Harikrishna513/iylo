import { Product } from "@/types";
import { ProductImages as img } from "@/lib/product-images";

function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const eggless = {
  preparationTime: "Fresh daily",
  isAvailableToday: true,
  ingredients: ["Eggless recipe"],
  allergens: ["Gluten", "Dairy"] as string[],
};

/** Client catalog — display order preserved */
export const catalogProducts: Product[] = [
  // ── Viennoiserie ──
  {
    id: slug("Butter Croissant"),
    name: "Butter Croissant",
    description: "Flaky and buttery pastry hand laminated to create beautiful melt in your mouth layers",
    price: 180,
    category: "viennoiserie",
    image: img.butterCroissant,
    images: [img.butterCroissant, img.butterCroissantAlt],
    ...eggless,
  },
  {
    id: slug("Pain Au Chocolat"),
    name: "Pain Au Chocolat",
    description:
      "A French classic consisting of flaky buttery pastry layers, stuffed with 46.5% dark chocolate",
    price: 220,
    category: "viennoiserie",
    image: img.painAuChocolat,
    images: [img.painAuChocolat, img.painAuChocolatAlt],
    ...eggless,
  },
  {
    id: slug("Almond Croissant"),
    name: "Almond Croissant",
    description:
      "A twice baked butter croissant, filled with an almond frangipane and topped with sliced almonds",
    price: 220,
    category: "viennoiserie",
    image: img.butterCroissantAlt,
    ...eggless,
  },
  {
    id: slug("Caramelised Onion Mushroom Pain Suisse"),
    name: "Caramelised Onion Mushroom Pain Suisse",
    description:
      "Buttery pastry layers filled with the richness of caramelised onions and mushrooms with a hint of rosemary",
    price: 235,
    category: "viennoiserie",
    image: img.blueberryDanish,
    ...eggless,
  },
  {
    id: slug("Romesco Supreme Croissant"),
    name: "Romesco Supreme Croissant",
    description:
      "The viral supreme croissant, filled with a spicy romesco sauce, garnished with roasted almond slices",
    price: 235,
    category: "viennoiserie",
    image: img.painAuChocolatAlt,
    ...eggless,
  },
  {
    id: slug("Mango Lime Danish"),
    name: "Mango Lime Danish",
    description:
      "A seasonal fresh mango and lime compote, sitting on a bed of pastry cream, brought together in the layers of a flaky pastry",
    price: 235,
    category: "viennoiserie",
    image: img.mangoTart,
    badge: "Seasonal",
    isLimited: true,
    ...eggless,
  },
  {
    id: slug("Strawberry Mascarpone Croissant"),
    name: "Strawberry Mascarpone Croissant",
    description:
      "Signature flaky croissant filled with a lightly sweetened mascarpone cream, topped with a zesty and fresh strawberry compote, garnished with roasted pistachios",
    price: 240,
    category: "viennoiserie",
    image: img.strawberryPastry,
    ...eggless,
  },
  {
    id: slug("Roasted Sweet Potato Curry Leaf Danish"),
    name: "Roasted Sweet Potato Curry Leaf Danish",
    description:
      "Our take on familiar flavours, with a croissant base filled with whipped cream cheese bursting with curry leaf pudi, roasted sweet potato chunks and garnished with pudi coated cashews",
    price: 240,
    category: "viennoiserie",
    image: img.blueberryDanishAlt,
    ...eggless,
  },

  // ── Cake Slices ──
  {
    id: slug("Lemon Blueberry Slice"),
    name: "Lemon Blueberry",
    description: "A moist lemon sponge filled with a blueberry compote and a zesty lemon mousse",
    price: 235,
    category: "cake-slices",
    image: img.lemonTart,
    ...eggless,
  },
  {
    id: slug("The Midnight Crisp"),
    name: "The Midnight Crisp",
    description:
      "A unique but addictive combination of a decadent chocolate sponge, 70% dark chocolate ganache, whipped salted caramel and salted potato chips for the crunch",
    price: 235,
    category: "cake-slices",
    image: img.chocoChipBrownie,
    ...eggless,
  },
  {
    id: slug("Marble Rocher"),
    name: "Marble Rocher",
    description:
      "Rich and buttery cake sponge, marbled with chocolate and vanilla swirls, topped off with a roasted almond chocolate glaze",
    price: 170,
    category: "cake-slices",
    image: img.denseLoafTruffle,
    ...eggless,
  },
  {
    id: slug("Spiced Carrot Walnut"),
    name: "Spiced Carrot & Walnut",
    description:
      "A timeless classic, combining a moist carrot walnut cake with a cream cheese frosting, garnished with candied walnuts",
    price: 160,
    category: "cake-slices",
    image: img.carrotCake,
    images: [img.carrotCake, img.carrotCakeAlt],
    ...eggless,
  },

  // ── Breads ──
  {
    id: slug("Pistachio Orange Babka"),
    name: "Pistachio Orange Babka",
    description:
      "A popular braided bread, filled with a nutty pistachio frangipane filling, packed with the bright flavor of orange zest",
    price: 170,
    category: "breads",
    image: img.cinnamonSwirl,
    ...eggless,
  },
  {
    id: slug("Bagels with Cream Cheese"),
    name: "Bagels with Cream Cheese",
    description:
      "Classic chewy bagels topped with a flavourful seasoning, sliced and filled with a thick layer of cream cheese",
    price: 180,
    category: "breads",
    image: img.frenchBaguette,
    ...eggless,
  },
  {
    id: slug("Olive Garlic Focaccia"),
    name: "Olive, Garlic Focaccia with Tomato Chilli Jam",
    description:
      "Golden brown crusted focaccia with the flavours of confit garlic and olives, served with a tomato chilli jam",
    price: 210,
    category: "breads",
    image: img.multigrainLoaf,
    ...eggless,
  },

  // ── Tarts ──
  {
    id: slug("Almond Mixed Berry Tart"),
    name: "Almond Mixed Berry Tart",
    description:
      "A golden and buttery vanilla tart shell, filled with a mixed berry jam and topped with an almond sponge",
    price: 0,
    category: "tarts",
    image: img.strawberryTart,
    longDescription: "Available in portions of 1–4 pcs. Price on enquiry.",
    ...eggless,
  },
  {
    id: slug("Hazelnut Praline Chocolate Tart"),
    name: "Hazelnut Praline Chocolate Tart",
    description:
      "Chocolate tart shell, filled with a crunch layer, hazelnut praline and a liquid chocolate ganache",
    price: 0,
    category: "tarts",
    image: img.banoffeeTart,
    longDescription: "Available in portions of 1–4 pcs. Price on enquiry.",
    ...eggless,
  },

  // ── Cookies ──
  {
    id: slug("Caramelised White Chocolate Coffee Cookie"),
    name: "Caramelised White Chocolate & Coffee",
    description:
      "A chunky caramelised cookie, with bold coffee notes and shards of white chocolate for flavour",
    price: 0,
    category: "cookies",
    image: img.chocolateChipCookie,
    longDescription: "Individual, pack of 10, or pack of 20. Price on enquiry.",
    ...eggless,
  },
  {
    id: slug("Scallion Tomatoes Cheese Cookie"),
    name: "Scallion, Tomatoes and Cheese",
    description:
      "Savoury chunky cookie, with scallions, sundried tomatoes folded in, and pockets of melted cheese",
    price: 0,
    category: "cookies",
    image: img.chilliCheeseCookies,
    longDescription: "Individual, pack of 10, or pack of 21. Price on enquiry.",
    ...eggless,
  },

  // ── Celebration Cakes ──
  {
    id: slug("Chocolate Salted Caramel Cake"),
    name: "Chocolate Salted Caramel",
    description: "Rich chocolate layers with silky salted caramel — perfect for celebrations",
    price: 0,
    category: "celebration-cakes",
    image: img.dutchTruffleCake,
    images: [img.dutchTruffleCake, img.dutchTruffleCakeAlt],
    isPreOrder: true,
    longDescription: "Available in 0.5kg, 1kg, and 2kg. Pre-order 1–2 days ahead.",
    ...eggless,
  },
  {
    id: slug("Vanilla Salted Caramel Cake"),
    name: "Vanilla Salted Caramel",
    description: "Classic vanilla sponge with salted caramel filling and finish",
    price: 0,
    category: "celebration-cakes",
    image: img.freshFruitCreamCake,
    isPreOrder: true,
    longDescription: "Available in 0.5kg, 1kg, and 2kg. Pre-order 1–2 days ahead.",
    ...eggless,
  },
  {
    id: slug("Dark Chocolate Indulgence"),
    name: "Dark Chocolate Indulgence",
    description: "Deep dark chocolate layers for the true chocolate lover",
    price: 0,
    category: "celebration-cakes",
    image: img.chocoholicCake,
    isPreOrder: true,
    longDescription: "Available in 0.5kg, 1kg, and 2kg. Pre-order 1–2 days ahead.",
    ...eggless,
  },
  {
    id: slug("Vanilla Mixed Berries Cake"),
    name: "Vanilla Mixed Berries",
    description: "Light vanilla sponge layered with fresh mixed berries and cream",
    price: 0,
    category: "celebration-cakes",
    image: img.freshFruitCreamCake,
    isPreOrder: true,
    longDescription: "Available in 0.5kg, 1kg, and 2kg. Pre-order 1–2 days ahead.",
    ...eggless,
  },
  {
    id: slug("Chocolate Berries Cake"),
    name: "Chocolate & Berries",
    description: "Decadent chocolate cake paired with seasonal berries",
    price: 0,
    category: "celebration-cakes",
    image: img.blackForestCake,
    isPreOrder: true,
    longDescription: "Available in 0.5kg, 1kg, and 2kg. Pre-order 1–2 days ahead.",
    ...eggless,
  },
  {
    id: slug("Lemon Blueberry Celebration Cake"),
    name: "Lemon Blueberry",
    description: "Zesty lemon sponge with blueberry compote — a celebration favourite",
    price: 0,
    category: "celebration-cakes",
    image: img.mangoCreamCake,
    isPreOrder: true,
    longDescription: "Available in 0.5kg, 1kg, and 2kg. Pre-order 1–2 days ahead.",
    ...eggless,
  },

  // ── Cheesecakes ──
  {
    id: slug("New York Baked Cheesecake"),
    name: "New York Style Baked Cheesecake",
    description: "Classic baked cheesecake with a buttery biscuit base and creamy centre",
    price: 680,
    category: "cheesecakes",
    image: img.nyCheesecake,
    images: [img.nyCheesecake, img.nyCheesecakeAlt],
    ...eggless,
  },
  {
    id: slug("Blueberry Cheesecake"),
    name: "Blueberry Cheesecake",
    description: "Creamy cheesecake topped with a fresh blueberry compote",
    price: 620,
    category: "cheesecakes",
    image: img.blueberryCheesecake,
    images: [img.blueberryCheesecake, img.blueberryCheesecakeAlt],
    ...eggless,
  },
  {
    id: slug("Mango Cheesecake Jar"),
    name: "Mango Cheesecake Jar",
    description: "Individual serve cheesecake jar with seasonal mango — perfect for gifting",
    price: 320,
    category: "cheesecakes",
    image: img.mangoCheesecakeJar,
    badge: "Seasonal",
    ...eggless,
  },
];
