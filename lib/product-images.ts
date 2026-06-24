/** Local product & marketing images served from /public/product-images */

const BASE = "/product-images";

export function productImage(filename: string): string {
  return `${BASE}/${filename}`;
}

export const ProductImages = {
  // Hero & banners
  heroHome: productImage("hero-home.webp"),
  bannerHomeDesktop: productImage("banner-home-desktop.webp"),
  bannerHomeDesktop1200: productImage("banner-home-desktop-1200.webp"),
  bannerHomeMobile: productImage("banner-home-mobile.webp"),
  bannerDesktopHorizontal: productImage("banner-desktop-horizontal.webp"),
  bannerChocolateDesktop: productImage("banner-chocolate-desktop.webp"),

  // Category tiles
  categoryDelicacies: productImage("category-delicacies-02.webp"),
  categoryDelicacies04: productImage("category-delicacies-04.webp"),
  categoryDelicacies06: productImage("category-delicacies-06.webp"),
  categoryHamperGifting: productImage("category-hamper-gifting.webp"),
  categoryTeaCakes: productImage("category-tea-cakes.webp"),

  // Breads
  sourdoughLoaf: productImage("wheat-sourdough-loaf-350g.webp"),
  sourdoughLoafAlt: productImage("wheat-sourdough-loaf-350g-02.webp"),
  briocheLoaf: productImage("dense-loaf-350g.webp"),
  briocheLoafAlt: productImage("dense-loaf-350g-02.webp"),
  frenchBaguette: productImage("french-baguette-1-pc.webp"),
  multigrainLoaf: productImage("multigrain-loaf-400g.webp"),
  wheatBreadLoaf: productImage("wheat-bread-loaf-400g.webp"),

  // Pastries & viennoiserie
  butterCroissant: productImage("butter-croissant.webp"),
  butterCroissantAlt: productImage("butter-croissant-02.webp"),
  painAuChocolat: productImage("pain-au-chocolat.webp"),
  painAuChocolatAlt: productImage("pain-au-chocolat-02.webp"),
  blueberryDanish: productImage("blueberry-danish.webp"),
  blueberryDanishAlt: productImage("blueberry-danish-02.webp"),
  cinnamonSwirl: productImage("cinnamon-swirl-cookies.webp"),

  // Cakes
  dutchTruffleCake: productImage("dutch-truffle-cake-1-kg.webp"),
  dutchTruffleCakeAlt: productImage("dutch-truffle-cake-1-kg-02.webp"),
  dutchTruffleHalfKg: productImage("dutch-truffle-cake-1-2-kg.webp"),
  chocoholicCake: productImage("chocoholic-cake-1-2-kg.webp"),
  redVelvetCake: productImage("red-velvet-cake-1-2-kg.webp"),
  redVelvetCakeAlt: productImage("red-velvet-cake-1-2-kg-02.webp"),
  blackForestCake: productImage("black-forest-cake-1.webp"),
  carrotCake: productImage("carrot-cake.webp"),
  carrotCakeAlt: productImage("carrot-cake-02.webp"),
  tiramisuCake: productImage("tiramisu-cake-660g.webp"),
  tiramisuCakeAlt: productImage("tiramisu-cake-02.webp"),
  cappuccinoCake: productImage("cappuccino-cake.webp"),
  freshFruitCreamCake: productImage("fresh-fruit-cream-cake.webp"),
  mangoCreamCake: productImage("fresh-mango-cream-cake-530g.webp"),
  operaCake: productImage("opera-cake-660g.webp"),
  tieredCake: productImage("tiered-temptation-cake.webp"),

  // Cupcakes & small bakes
  redVelvetCupcake: productImage("red-velvet-cupcake.webp"),
  chocolateCupcake: productImage("chocolate-cupcake.webp"),
  strawberryCupcake: productImage("strawberry-cupcake.webp"),
  vanillaBlueberryCupcake: productImage("vanilla-blueberry-cupcake.webp"),

  // Desserts & cheesecakes
  tiramisuCup: productImage("tiramisu-cup-110g.webp"),
  blueberryCheesecake: productImage("blueberry-cheesecake.webp"),
  blueberryCheesecakeAlt: productImage("blueberry-cheesecake-02.webp"),
  nyCheesecake: productImage("new-york-style-baked-cheesecake-500g.webp"),
  nyCheesecakeAlt: productImage("new-york-style-baked-cheesecake-500g-02.webp"),
  mangoCheesecakeJar: productImage("mango-cheesecake-jar.webp"),
  mangoTiramisuJar: productImage("mango-tiramisu-jar.webp"),
  mangoTrifle: productImage("mango-trifle-pudding.webp"),

  // Cookies & biscuits
  butterCookies: productImage("butter-cookies.webp"),
  jeeraCookies: productImage("jeera-cookies.webp"),
  chocolateChipCookie: productImage("chocolate-chip-big-cookie.webp"),
  egglessHazelnutCookies: productImage("eggless-hazelnut-cookies.webp"),
  egglessOrangeCookies: productImage("eggless-orange-cookies.webp"),
  almondBiscotti: productImage("almond-biscotti-150g.webp"),
  egglessAlmondBiscotti: productImage("eggless-almond-biscotti-150g.webp"),
  chilliCheeseCookies: productImage("chilli-cheese-cookies.webp"),

  // Brownies
  chocoChipBrownie: productImage("choco-chip-brownie.webp"),
  chocoChipBrownieAlt: productImage("choco-chip-brownie-02.webp"),
  outrageousBrownie: productImage("eggless-outrageous-chocolate-brownie.webp"),
  assortedBrownies6: productImage("assorted-brownies-box-6-pcs.webp"),
  signatureBrownieCake: productImage("theobroma-signature-brownie-cake.webp"),

  // Tarts & pastries
  lemonTart: productImage("lemon-tart.webp"),
  strawberryTart: productImage("strawberry-tart.webp"),
  mangoTart: productImage("mango-tart.webp"),
  banoffeeTart: productImage("banoffee-tart.webp"),
  strawberryPastry: productImage("strawberry-and-fresh-cream-pastry.webp"),
  blackForestPastry: productImage("black-forest-pastry-1.webp"),
  devilsMoussePastry: productImage("devils-mousse-pastry.webp"),
  cappuccinoPastry: productImage("choco-butterscotch-pastry.webp"),

  // Gift hampers & boxes
  luxuryGiftHamper: productImage("luxury-gift-hamper-box.webp"),
  indulgenceHamper: productImage("indulgence-hamper.webp"),
  indulgenceHamperAlt: productImage("indulgence-hamper-alt-02.webp"),
  premiumGiftHamper: productImage("premium-gift-hamper-box.webp"),
  goodiesGiftHamper: productImage("goodies-gift-hamper-box.webp"),
  mothersDayHamper: productImage("mothers-day-luxury-gift-hamper-box.webp"),
  cookiesGiftSet3: productImage("cookies-collection-gift-set-3.webp"),
  cookiesGiftSet4: productImage("cookies-collection-gift-set-4.webp"),

  // Retail / pantry
  almondRocks: productImage("almond-rocks-250g.webp"),
  almondRocks500: productImage("almond-rocks-500g.webp"),
  darkChocolate60: productImage("60-dark-chocolate-60g.webp"),
  chocolateBarsSet: productImage("chocolate-bars-collection-set-of-3.webp"),
  denseLoafTruffle: productImage("dense-loaf-truffle-cake.webp"),
  mavaCake: productImage("mava-cake-300g.webp"),

  // Beverages
  cappuccino: productImage("cappuccino.webp"),
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
