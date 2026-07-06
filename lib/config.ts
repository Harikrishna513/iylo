export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://iylobakehouse.com";

export const BRAND_NAME = "IYLO Bakehouse";
export const SUPPORT_EMAIL = "hello@iylobakehouse.com";
export const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ?? process.env.GMAIL_USER ?? SUPPORT_EMAIL;
export const EMAIL_FROM_HEADER = `${BRAND_NAME} <${process.env.GMAIL_USER ?? SUPPORT_EMAIL}>`;

export const MIN_ORDER_AMOUNT = 499;
export const FREE_DELIVERY_ABOVE = 999;
export const GIFT_WRAP_FEE = 99;
