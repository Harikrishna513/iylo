"use client";

import { useMemo, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDeliverySlots, getPickupSlots } from "@/lib/preorder";
import type { DeliverySlot } from "@/types";

export interface FulfillmentSelection {
  date: string;
  dateLabel: string;
  slotId: string;
  slotLabel: string;
}

interface FulfillmentDatePickerProps {
  mode?: "delivery" | "pickup";
  value?: FulfillmentSelection | null;
  onChange: (selection: FulfillmentSelection | null) => void;
  className?: string;
}

export function FulfillmentDatePicker({
  mode = "delivery",
  value,
  onChange,
  className,
}: FulfillmentDatePickerProps) {
  const days = useMemo(
    () => (mode === "pickup" ? getPickupSlots() : getDeliverySlots(7)),
    [mode]
  );

  const [selectedDay, setSelectedDay] = useState<DeliverySlot | null>(
    () => days.find((d) => d.date === value?.date) ?? days[0] ?? null
  );

  const handleDaySelect = (day: DeliverySlot) => {
    setSelectedDay(day);
    const firstSlot = day.slots.find((s) => s.available);
    if (firstSlot) {
      onChange({
        date: day.date,
        dateLabel: day.label,
        slotId: firstSlot.id,
        slotLabel: firstSlot.label,
      });
    } else {
      onChange(null);
    }
  };

  const handleSlotSelect = (slotId: string, slotLabel: string) => {
    if (!selectedDay) return;
    onChange({
      date: selectedDay.date,
      dateLabel: selectedDay.label,
      slotId,
      slotLabel,
    });
  };

  if (!days.length) {
    return (
      <p className="text-sm text-maroon/50">
        No slots available. Please check back tomorrow.
      </p>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-light-blue">
        <Calendar className="h-4 w-4" />
        Select {mode === "pickup" ? "pickup" : "delivery"} date
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {days.map((day) => {
          const isSelected = selectedDay?.date === day.date;
          const hasSlots = day.slots.some((s) => s.available);
          return (
            <button
              key={day.date}
              type="button"
              disabled={!hasSlots}
              onClick={() => handleDaySelect(day)}
              className={cn(
                "border px-3 py-3 text-left text-xs transition-colors",
                !hasSlots && "cursor-not-allowed opacity-40",
                isSelected
                  ? "border-light-blue bg-mist-blue text-maroon"
                  : "border-maroon/15 text-maroon/70 hover:border-maroon/30"
              )}
            >
              <span className="block font-medium">{day.label.split(",")[0]}</span>
              <span className="mt-1 block text-[10px] text-maroon/45">
                {day.label.split(",").slice(1).join(",").trim()}
              </span>
            </button>
          );
        })}
      </div>

      {selectedDay && (
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-light-blue">
            <Clock className="h-4 w-4" />
            Select time slot
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {selectedDay.slots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                disabled={!slot.available}
                onClick={() => handleSlotSelect(slot.id, slot.label)}
                className={cn(
                  "border px-4 py-3 text-left text-sm transition-colors",
                  !slot.available && "cursor-not-allowed opacity-30",
                  value?.slotId === slot.id
                    ? "border-light-blue bg-mist-blue text-maroon"
                    : "border-maroon/15 text-maroon/70 hover:border-maroon/30"
                )}
              >
                {slot.label}
                {!slot.available && (
                  <span className="ml-2 text-[10px] text-maroon/45">(passed)</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {value && (
        <p className="rounded border border-light-blue/30 bg-mist-blue px-4 py-3 text-sm text-maroon/80">
          Scheduled: <strong className="text-light-blue">{value.dateLabel}</strong> ·{" "}
          {value.slotLabel}
        </p>
      )}

      {mode === "pickup" && (
        <p className="text-xs leading-relaxed text-maroon/45">
          We&apos;d love to welcome you to our bakery and have you experience the
          aromas of our freshly baked creations.
        </p>
      )}
    </div>
  );
}
