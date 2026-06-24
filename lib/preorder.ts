import { DeliverySlot, TimeSlot } from "@/types";

const SLOT_DEFINITIONS: Omit<TimeSlot, "available">[] = [
  { id: "morning", label: "9:00 AM – 12:00 PM", cutoffHour: 8 },
  { id: "afternoon", label: "12:00 PM – 3:00 PM", cutoffHour: 11 },
  { id: "evening", label: "3:00 PM – 6:00 PM", cutoffHour: 14 },
  { id: "night", label: "6:00 PM – 9:00 PM", cutoffHour: 17 },
];

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function formatDateLabel(date: Date): string {
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getAvailableSlots(date: Date, now: Date): TimeSlot[] {
  const isToday = toISODate(date) === toISODate(now);
  const currentHour = now.getHours();

  return SLOT_DEFINITIONS.map((slot) => ({
    ...slot,
    available: !isToday || currentHour < slot.cutoffHour,
  }));
}

export function getDeliverySlots(daysAhead = 7): DeliverySlot[] {
  const now = new Date();
  const slots: DeliverySlot[] = [];

  for (let i = 0; i < daysAhead; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    date.setHours(0, 0, 0, 0);

    let daySlots = getAvailableSlots(date, now);

    // If all slots passed today, skip to next day
    if (i === 0 && daySlots.every((s) => !s.available)) {
      continue;
    }

    slots.push({
      date: toISODate(date),
      label: formatDateLabel(date),
      slots: daySlots,
    });
  }

  return slots;
}

export function getNextAvailableSlot(): {
  date: string;
  slot: TimeSlot;
  message: string;
} {
  const slots = getDeliverySlots(14);
  const now = new Date();

  for (const day of slots) {
    const available = day.slots.find((s) => s.available);
    if (available) {
      const isToday = day.date === toISODate(now);
      const passedCutoff =
        isToday &&
        day.slots.every((s) => !s.available);

      return {
        date: day.date,
        slot: available,
        message: passedCutoff
          ? "Today's slots have passed. Your order will be prepared for the next available day."
          : isToday
            ? `Available today, ${available.label}`
            : `Next available: ${day.label}, ${available.label}`,
      };
    }
  }

  const fallback = slots[0];
  return {
    date: fallback?.date ?? toISODate(now),
    slot: { ...SLOT_DEFINITIONS[0], available: true },
    message: "We'll confirm your delivery slot shortly.",
  };
}

export function getPickupSlots(): DeliverySlot[] {
  return getDeliverySlots(5);
}
