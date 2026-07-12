export function validatePincode(pincode: string): boolean {
  return /^[0-9]{6}$/.test(pincode.trim());
}

export function validateEmail(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) return null;
  return trimmed;
}

export function validateFullName(name: string): string | null {
  const trimmed = name.trim().replace(/\s+/g, " ");
  if (trimmed.length < 2) return null;
  if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) return null;
  return trimmed;
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return null;
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) return null;
  return password;
}

export function validateIndianPhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10 && /^[6-9]/.test(digits)) return digits;
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 13 && digits.startsWith("091")) return digits.slice(3);
  return null;
}

export function formatIndianPhone(phone: string): string {
  const normalized = validateIndianPhone(phone);
  if (!normalized) return phone;
  return `+91 ${normalized.slice(0, 5)} ${normalized.slice(5)}`;
}

export function safeInternalRedirect(path: string | null, fallback = "/"): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return fallback;
  return path;
}
