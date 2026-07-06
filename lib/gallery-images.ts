/** Visual Diary / Gallery section — public/gallery/ */

const gallery = (file: string) => `/gallery/${file}`;

export const GALLERY_IMAGES = {
  sourdoughLoaf: gallery("sourdough-loaf.webp"),
  butterCroissant: gallery("butter-croissant.webp"),
  dutchTruffleCake: gallery("dutch-truffle-cake.webp"),
  multigrainLoaf: gallery("multigrain-loaf.webp"),
  cinnamonSwirl: gallery("cinnamon-swirl.webp"),
  strawberryTart: gallery("strawberry-tart.webp"),
  giftHamper: gallery("gift-hamper.webp"),
  chocolateChipCookie: gallery("chocolate-chip-cookie.webp"),
} as const;
