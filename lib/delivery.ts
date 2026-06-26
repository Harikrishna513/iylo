import { DeliveryZone } from "@/types";

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: "jayanagar-local",
    name: "Jayanagar & Surroundings",
    pincodes: ["560011", "560041", "560076", "560070", "560034"],
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

export const FREE_DELIVERY_THRESHOLD = 999;
export const MIN_ORDER_AMOUNT = 499;
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
  lat: 12.9308,
  lng: 77.5838,
  address: "No. 476/65, 7th Main, 33rd Cross, 4th Block, Jayanagar, Bangalore – 560011",
  landmark: "Next to Ajfan Dates and Nuts, Jayanagar, 4th Block",
  parking: "Street parking available near 4th Block, Jayanagar.",
  directions: "https://maps.app.goo.gl/yJ5Ypo7Tm168wiHr7",
};
