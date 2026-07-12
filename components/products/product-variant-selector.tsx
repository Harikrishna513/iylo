"use client";

import { cn, formatPrice } from "@/lib/utils";
import type { ProductVariant } from "@/types";

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  selectedId: string;
  onSelect: (variant: ProductVariant) => void;
  label?: string;
}

export function ProductVariantSelector({
  variants,
  selectedId,
  onSelect,
  label = "Select size",
}: ProductVariantSelectorProps) {
  if (variants.length <= 1) return null;

  return (
    <div className="mt-6">
      <p className="mb-3 text-xs uppercase tracking-widest text-gold">{label}</p>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isSelected = variant.id === selectedId;
          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onSelect(variant)}
              className={cn(
                "min-w-[5.5rem] border px-4 py-3 text-left text-sm transition-colors",
                isSelected
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-ivory/20 text-ivory/80 hover:border-ivory/40"
              )}
            >
              <span className="block font-medium">{variant.name}</span>
              <span className="mt-0.5 block text-xs text-ivory/50">
                {formatPrice(variant.price)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
