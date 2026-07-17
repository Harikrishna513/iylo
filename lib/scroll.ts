export type InquiryScrollType = "corporate" | "custom";

const INQUIRY_TYPE_KEY = "iylo_inquiry_type";

export function setPendingInquiryType(type: InquiryScrollType) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(INQUIRY_TYPE_KEY, type);
}

export function consumePendingInquiryType(): InquiryScrollType | null {
  if (typeof window === "undefined") return null;
  const value = sessionStorage.getItem(INQUIRY_TYPE_KEY);
  if (value === "corporate" || value === "custom") {
    sessionStorage.removeItem(INQUIRY_TYPE_KEY);
    return value;
  }
  return null;
}

export function scrollToSection(sectionId: string, inquiryType?: InquiryScrollType) {
  if (inquiryType) setPendingInquiryType(inquiryType);
  const el = document.getElementById(sectionId);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => {
    el.querySelector<HTMLElement>("input, textarea, select")?.focus();
  }, 500);
}
