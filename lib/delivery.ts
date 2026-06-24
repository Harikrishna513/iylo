import { DeliveryZone } from "@/types";

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: "indiranagar",
    name: "Indiranagar & Surroundings",
    pincodes: ["560038", "560008", "560075", "560034"],
    fee: 49,
    estimatedMinutes: 45,
  },
  {
    id: "koramangala",
    name: "Koramangala & HSR",
    pincodes: ["560034", "560102", "560068", "560029"],
    fee: 49,
    estimatedMinutes: 50,
  },
  {
    id: "whitefield",
    name: "Whitefield & Marathahalli",
    pincodes: ["560066", "560037", "560048", "560103"],
    fee: 79,
    estimatedMinutes: 75,
  },
  {
    id: "jayanagar",
    name: "Jayanagar & BTM",
    pincodes: ["560041", "560076", "560070", "560011"],
    fee: 59,
    estimatedMinutes: 55,
  },
  {
    id: "mg-road",
    name: "MG Road & Central Bangalore",
    pincodes: ["560001", "560025", "560027", "560002"],
    fee: 39,
    estimatedMinutes: 35,
  },
];

export const FREE_DELIVERY_THRESHOLD = 2000;
export const DEFAULT_DELIVERY_FEE = 99;

export function findDeliveryZone(pincode: string): DeliveryZone | null {
  return DELIVERY_ZONES.find((z) => z.pincodes.includes(pincode)) ?? null;
}

export function calculateDeliveryFee(
  subtotal: number,
  zone: DeliveryZone | null
): number {
  if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
  if (!zone) return DEFAULT_DELIVERY_FEE;
  return zone.fee;
}

export function getAmountForFreeDelivery(subtotal: number): number {
  const remaining = FREE_DELIVERY_THRESHOLD - subtotal;
  return remaining > 0 ? remaining : 0;
}

export const BAKERY_LOCATION = {
  lat: 12.9716,
  lng: 77.6412,
  address: "42, 12th Main Road, Indiranagar, Bangalore 560038",
  parking: "Street parking available on 12th Main. Valet on weekends.",
  directions: "https://maps.google.com/?q=IYLO+Bake+House+Indiranagar+Bangalore",
};
