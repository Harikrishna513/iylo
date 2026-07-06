/**
 * Site images organised by section under /public.
 * Unused legacy assets remain in /public/product-images.
 */

const brand = (f: string) => `/brand/${f}`;
const marketing = (f: string) => `/marketing/${f}`;
const gifting = (f: string) => `/gifting/${f}`;
const categories = (f: string) => `/categories/${f}`;
const products = (f: string) => `/products/${f}`;

/** @deprecated Use section helpers — kept for any legacy imports */
const BASE = "/product-images";
export function productImage(filename: string): string {
  return `${BASE}/${filename}`;
}

export const ProductImages = {
  // Brand & storefront
  iyloHouse: brand("iylo-house.webp"),
  heroHome: brand("iylo-house.webp"),

  // Marketing & SEO banners
  bannerHomeDesktop: marketing("banner-home-desktop.webp"),
  bannerHomeDesktop1200: marketing("banner-home-desktop-1200.webp"),
  bannerHomeMobile: marketing("banner-home-mobile.webp"),
  bannerDesktopHorizontal: marketing("banner-desktop-horizontal.webp"),
  bannerChocolateDesktop: productImage("banner-chocolate-desktop.webp"),

  // Category tiles (testimonials / nav)
  categoryDelicacies: categories("category-delicacies-02.webp"),
  categoryDelicacies04: productImage("category-delicacies-04.webp"),
  categoryDelicacies06: productImage("category-delicacies-06.webp"),
  categoryHamperGifting: categories("category-hamper-gifting.webp"),
  categoryTeaCakes: productImage("category-tea-cakes.webp"),

  // Breads
  sourdoughLoaf: products("wheat-sourdough-loaf-350g.webp"),
  sourdoughLoafAlt: products("wheat-sourdough-loaf-350g-02.webp"),
  briocheLoaf: products("dense-loaf-350g.webp"),
  briocheLoafAlt: productImage("dense-loaf-350g-02.webp"),
  frenchBaguette: products("french-baguette-1-pc.webp"),
  multigrainLoaf: products("multigrain-loaf-400g.webp"),
  wheatBreadLoaf: productImage("wheat-bread-loaf-400g.webp"),

  // Pastries & viennoiserie
  butterCroissant: products("butter-croissant.webp"),
  butterCroissantAlt: products("butter-croissant-02.webp"),
  painAuChocolat: products("pain-au-chocolat.webp"),
  painAuChocolatAlt: products("pain-au-chocolat-02.webp"),
  blueberryDanish: products("blueberry-danish.webp"),
  blueberryDanishAlt: products("blueberry-danish-02.webp"),
  cinnamonSwirl: products("cinnamon-swirl-cookies.webp"),

  // Cakes
  dutchTruffleCake: products("dutch-truffle-cake-1-kg.webp"),
  dutchTruffleCakeAlt: products("dutch-truffle-cake-1-kg-02.webp"),
  dutchTruffleHalfKg: productImage("dutch-truffle-cake-1-2-kg.webp"),
  chocoholicCake: products("chocoholic-cake-1-2-kg.webp"),
  redVelvetCake: productImage("red-velvet-cake-1-2-kg.webp"),
  redVelvetCakeAlt: productImage("red-velvet-cake-1-2-kg-02.webp"),
  blackForestCake: products("black-forest-cake-1.webp"),
  carrotCake: products("carrot-cake.webp"),
  carrotCakeAlt: products("carrot-cake-02.webp"),
  tiramisuCake: productImage("tiramisu-cake-660g.webp"),
  tiramisuCakeAlt: productImage("tiramisu-cake-02.webp"),
  cappuccinoCake: products("cappuccino-cake.webp"),
  freshFruitCreamCake: products("fresh-fruit-cream-cake.webp"),
  mangoCreamCake: products("fresh-mango-cream-cake-530g.webp"),
  operaCake: productImage("opera-cake-660g.webp"),
  tieredCake: products("tiered-temptation-cake.webp"),

  // Cupcakes & small bakes
  redVelvetCupcake: productImage("red-velvet-cupcake.webp"),
  chocolateCupcake: productImage("chocolate-cupcake.webp"),
  strawberryCupcake: productImage("strawberry-cupcake.webp"),
  vanillaBlueberryCupcake: productImage("vanilla-blueberry-cupcake.webp"),

  // Desserts & cheesecakes
  tiramisuCup: productImage("tiramisu-cup-110g.webp"),
  blueberryCheesecake: products("blueberry-cheesecake.webp"),
  blueberryCheesecakeAlt: products("blueberry-cheesecake-02.webp"),
  nyCheesecake: products("new-york-style-baked-cheesecake-500g.webp"),
  nyCheesecakeAlt: products("new-york-style-baked-cheesecake-500g-02.webp"),
  mangoCheesecakeJar: products("mango-cheesecake-jar.webp"),
  mangoTiramisuJar: productImage("mango-tiramisu-jar.webp"),
  mangoTrifle: productImage("mango-trifle-pudding.webp"),

  // Cookies & biscuits
  butterCookies: productImage("butter-cookies.webp"),
  jeeraCookies: productImage("jeera-cookies.webp"),
  chocolateChipCookie: products("chocolate-chip-big-cookie.webp"),
  egglessHazelnutCookies: productImage("eggless-hazelnut-cookies.webp"),
  egglessOrangeCookies: productImage("eggless-orange-cookies.webp"),
  almondBiscotti: productImage("almond-biscotti-150g.webp"),
  egglessAlmondBiscotti: productImage("eggless-almond-biscotti-150g.webp"),
  chilliCheeseCookies: products("chilli-cheese-cookies.webp"),

  // Brownies
  chocoChipBrownie: products("choco-chip-brownie.webp"),
  chocoChipBrownieAlt: productImage("choco-chip-brownie-02.webp"),
  outrageousBrownie: productImage("eggless-outrageous-chocolate-brownie.webp"),
  assortedBrownies6: products("assorted-brownies-box-6-pcs.webp"),
  signatureBrownieCake: productImage("theobroma-signature-brownie-cake.webp"),

  // Tarts & pastries
  lemonTart: products("lemon-tart.webp"),
  strawberryTart: products("strawberry-tart.webp"),
  mangoTart: products("mango-tart.webp"),
  banoffeeTart: products("banoffee-tart.webp"),
  strawberryPastry: products("strawberry-and-fresh-cream-pastry.webp"),
  blackForestPastry: productImage("black-forest-pastry-1.webp"),
  devilsMoussePastry: productImage("devils-mousse-pastry.webp"),
  cappuccinoPastry: productImage("choco-butterscotch-pastry.webp"),

  // Gifting Collection section (gifting folder only)
  giftingCorporate: gifting("gifting-corporate.webp"),
  giftingFestive: gifting("gifting-festive.webp"),
  giftingCelebration: gifting("gifting-celebration.webp"),
  giftingCustom: gifting("gifting-custom.webp"),

  // Gift hampers & boxes (shared across site)
  luxuryGiftHamper: gifting("luxury-gift-hamper-box.webp"),
  indulgenceHamper: gifting("indulgence-hamper.webp"),
  indulgenceHamperAlt: productImage("indulgence-hamper-alt-02.webp"),
  premiumGiftHamper: gifting("premium-gift-hamper-box.webp"),
  goodiesGiftHamper: productImage("goodies-gift-hamper-box.webp"),
  mothersDayHamper: gifting("mothers-day-luxury-gift-hamper-box.webp"),
  cookiesGiftSet3: productImage("cookies-collection-gift-set-3.webp"),
  cookiesGiftSet4: productImage("cookies-collection-gift-set-4.webp"),

  // Retail / pantry
  almondRocks: productImage("almond-rocks-250g.webp"),
  almondRocks500: productImage("almond-rocks-500g.webp"),
  darkChocolate60: productImage("60-dark-chocolate-60g.webp"),
  chocolateBarsSet: productImage("chocolate-bars-collection-set-of-3.webp"),
  denseLoafTruffle: products("dense-loaf-truffle-cake.webp"),
  mavaCake: productImage("mava-cake-300g.webp"),

  // Beverages
  cappuccino: products("cappuccino.webp"),
  cappuccinoAlt: productImage("cappuccino-02.webp"),
  hotChocolate: productImage("hot-chocolate.webp"),
  classicColdCoffee: productImage("classic-cold-coffee.webp"),
  latte: productImage("latte.webp"),

  // Seasonal & specials
  mangoTresLeches: productImage("mango-tres-leches.webp"),
  bakedMangoYogurt: productImage("baked-mango-yogurt.webp"),
  ramadanPhirni: productImage("ramadan-special-phirni.webp"),
  mothersDayCupcakes: productImage("mothers-day-specials-cupcakes-set-of-2.webp"),

  // Merch (workshop / brand)
  merchApron: productImage("merch-apron-blue.webp"),
  buyGreenApron: productImage("buy-green-apron.webp"),
} as const;
