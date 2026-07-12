import { BRAND_COLORS, CONTACT_PHONE, CONTACT_WHATSAPP } from "@/data/site-content";

/** IYLO Bakehouse brand assets (transparent) */
export const BRAND_LOGO = "/logo.png";

export { BRAND_COLORS, CONTACT_PHONE, CONTACT_WHATSAPP };
export const COLOR_MAROON = BRAND_COLORS.maroon;
export const COLOR_LIGHT_BLUE = BRAND_COLORS.lightBlue;
export const BRAND_LOGO_ALT = "iylo BAKEHOUSE";

/** Source file dimensions: public/logo.png */
export const LOGO_WIDTH = 824;
export const LOGO_HEIGHT = 465;
export const LOGO_ASPECT_RATIO = LOGO_WIDTH / LOGO_HEIGHT;

/** Announcement bar (h-9) + navbar with logo padding */
export const ANNOUNCEMENT_BAR_HEIGHT_PX = 36;
export const NAVBAR_LOGO_HEIGHT = { mobile: 52, desktop: 68 } as const;
export const NAVBAR_VERTICAL_PADDING_PX = 12;
export const NAVBAR_HEIGHT_PX =
  NAVBAR_LOGO_HEIGHT.desktop + NAVBAR_VERTICAL_PADDING_PX * 2;
export const SITE_HEADER_OFFSET_PX =
  ANNOUNCEMENT_BAR_HEIGHT_PX + NAVBAR_HEIGHT_PX;

export function logoWidthForHeight(height: number): number {
  return Math.round(height * LOGO_ASPECT_RATIO);
}

/** Shared content width — matches hero, header, and sections */
export const SITE_CONTENT_CLASS =
  "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10";
