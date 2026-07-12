import { cn } from "@/lib/utils";

export const adminInputClass =
  "w-full border border-maroon/15 bg-white px-4 py-2.5 text-sm text-maroon outline-none transition-colors focus:border-light-blue";

export const adminSelectClass =
  "border border-maroon/15 bg-white px-4 py-2.5 text-sm text-maroon outline-none focus:border-light-blue";

export const adminCardClass =
  "rounded-lg border border-maroon/10 bg-white p-5 shadow-sm";

export const adminTableWrapClass =
  "overflow-x-auto rounded-lg border border-maroon/10 bg-white shadow-sm";

export const adminThClass =
  "p-4 text-left text-[10px] font-semibold uppercase tracking-widest text-maroon/50";

export const adminTdClass = "p-4 text-sm text-maroon";

export function AdminStatCard({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className={adminCardClass}>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-maroon/50">
        {label}
      </p>
      <p
        className={cn(
          "editorial-heading mt-2 text-3xl",
          accent ? "text-light-blue" : "text-maroon"
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-maroon/45">{hint}</p>}
    </div>
  );
}
