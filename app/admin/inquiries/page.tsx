"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminInquiry, InquiryStatus } from "@/lib/inquiries";
import {
  DASHBOARD_PRESETS,
  dateRangeForPreset,
  describeDateRange,
  isoToLocalDateInput,
  localDateToIsoEndExclusive,
  localDateToIsoStart,
  type DashboardPreset,
} from "@/lib/domain/dashboard-presets";
import { adminCardClass, adminInputClass, adminSelectClass } from "@/components/admin/admin-ui";

const STATUSES: Array<"all" | InquiryStatus> = [
  "all",
  "new",
  "contacted",
  "quoted",
  "closed",
];

const TYPES = ["all", "corporate", "custom"] as const;

interface PeriodState {
  preset: DashboardPreset;
  customFrom: string;
  customTo: string;
}

const INITIAL_PERIOD: PeriodState = {
  preset: "all",
  customFrom: "",
  customTo: "",
};

function statusClasses(status: InquiryStatus) {
  switch (status) {
    case "new":
      return "bg-mist-blue text-maroon";
    case "contacted":
      return "bg-light-blue/30 text-maroon";
    case "quoted":
      return "bg-mist-blue text-maroon";
    case "closed":
      return "bg-maroon/10 text-maroon/50";
    default:
      return "bg-maroon/10 text-maroon/50";
  }
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("all");
  const [type, setType] = useState<(typeof TYPES)[number]>("all");
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState<PeriodState>(INITIAL_PERIOD);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});

  const dateParams = useMemo(() => {
    if (period.preset === "custom") {
      return {
        dateFrom: localDateToIsoStart(period.customFrom),
        dateTo: localDateToIsoEndExclusive(period.customTo),
      };
    }
    return dateRangeForPreset(period.preset);
  }, [period]);

  const friendlyRange = useMemo(() => {
    if (period.preset === "all") return "All time";
    if (period.preset === "custom") {
      return describeDateRange({
        dateFrom: dateParams.dateFrom,
        dateTo: dateParams.dateTo,
      });
    }
    return describeDateRange(dateRangeForPreset(period.preset));
  }, [period, dateParams]);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (type !== "all") params.set("type", type);
    if (search.trim()) params.set("search", search.trim());
    if (dateParams.dateFrom) params.set("dateFrom", dateParams.dateFrom);
    if (dateParams.dateTo) params.set("dateTo", dateParams.dateTo);
    const res = await fetch(`/api/admin/inquiries?${params}`);
    const data = await res.json();
    setInquiries(data.inquiries ?? []);
    setLoading(false);
  }, [status, type, search, dateParams]);

  useEffect(() => {
    load();
  }, [load]);

  const setPreset = (preset: DashboardPreset) => {
    setPeriod((prev) => {
      if (preset === "custom") {
        const r = dateRangeForPreset(prev.preset);
        return {
          preset,
          customFrom: isoToLocalDateInput(r.dateFrom),
          customTo: isoToLocalDateInput(
            r.dateTo
              ? new Date(new Date(r.dateTo).getTime() - 86_400_000).toISOString()
              : null
          ),
        };
      }
      return { ...prev, preset };
    });
  };

  const updateInquiry = async (
    id: string,
    update: { status?: InquiryStatus; admin_notes?: string | null }
  ) => {
    await fetch("/api/admin/inquiries/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...update }),
    });
    load();
  };

  return (
    <div>
      <h1 className="editorial-heading mb-2 text-3xl text-maroon md:text-4xl">Enquiries</h1>
      <p className="mb-6 text-sm text-maroon/55">
        Corporate and custom packaging requests · {friendlyRange}
      </p>

      <div className={`${adminCardClass} mb-6 space-y-3`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden text-[10px] font-bold uppercase tracking-widest text-maroon/55 sm:inline">
            <Calendar className="mr-1 inline h-3.5 w-3.5 -mt-0.5" />
            Period
          </span>
          {DASHBOARD_PRESETS.map((p) => {
            const active = period.preset === p.value;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => setPreset(p.value)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? "border-maroon bg-maroon text-white"
                    : "border-maroon/20 bg-white text-maroon/65 hover:border-maroon/40"
                }`}
              >
                {p.label}
              </button>
            );
          })}
          {period.preset !== INITIAL_PERIOD.preset && (
            <button
              type="button"
              onClick={() => setPeriod(INITIAL_PERIOD)}
              className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-maroon/45"
            >
              <X className="h-3 w-3" /> Reset
            </button>
          )}
        </div>

        {period.preset === "custom" && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-maroon/55">
              From
            </span>
            <input
              type="date"
              value={period.customFrom}
              onChange={(e) =>
                setPeriod((p) => ({ ...p, customFrom: e.target.value }))
              }
              className="rounded-full border border-maroon/20 bg-white px-3 py-1.5 text-xs text-maroon"
            />
            <span className="text-[10px] font-bold uppercase tracking-widest text-maroon/55">
              To
            </span>
            <input
              type="date"
              value={period.customTo}
              min={period.customFrom || undefined}
              onChange={(e) =>
                setPeriod((p) => ({ ...p, customTo: e.target.value }))
              }
              className="rounded-full border border-maroon/20 bg-white px-3 py-1.5 text-xs text-maroon"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as (typeof STATUSES)[number])}
            className={adminSelectClass}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All statuses" : s}
              </option>
            ))}
          </select>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as (typeof TYPES)[number])}
            className={adminSelectClass}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "All types" : t}
              </option>
            ))}
          </select>
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-maroon/40" />
            <input
              type="search"
              placeholder="Search name, email, phone, company…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${adminInputClass} pl-10`}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-maroon/40" />
        </div>
      ) : inquiries.length === 0 ? (
        <p className={`${adminCardClass} text-center text-maroon/50`}>No enquiries found.</p>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <article key={inq.id} className={adminCardClass}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs uppercase tracking-widest text-light-blue">
                      {inq.inquiry_type}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                        statusClasses(inq.status)
                      )}
                    >
                      {inq.status}
                    </span>
                  </div>
                  <h2 className="mt-2 text-lg font-medium text-maroon">{inq.contact_name}</h2>
                  {inq.company_name && (
                    <p className="text-sm text-maroon/55">{inq.company_name}</p>
                  )}
                  <p className="mt-1 text-xs text-maroon/45">
                    {new Date(inq.created_at).toLocaleString("en-IN")} · {inq.email} ·{" "}
                    {inq.phone}
                  </p>
                </div>
                <select
                  value={inq.status}
                  onChange={(e) =>
                    updateInquiry(inq.id, { status: e.target.value as InquiryStatus })
                  }
                  className={`${adminSelectClass} py-1.5 text-xs`}
                >
                  {STATUSES.filter((s) => s !== "all").map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setExpandedId(expandedId === inq.id ? null : inq.id)}
                className="mt-4 text-xs text-light-blue hover:underline"
              >
                {expandedId === inq.id ? "Hide details" : "View details"}
              </button>

              {expandedId === inq.id && (
                <div className="mt-4 space-y-3 border-t border-maroon/10 pt-4 text-sm text-maroon/75">
                  <p className="whitespace-pre-wrap">{inq.message}</p>
                  <dl className="grid gap-2 sm:grid-cols-2">
                    {inq.estimated_qty && (
                      <div>
                        <dt className="text-xs text-maroon/45">Quantity / event size</dt>
                        <dd>{inq.estimated_qty}</dd>
                      </div>
                    )}
                    {inq.delivery_date && (
                      <div>
                        <dt className="text-xs text-maroon/45">Delivery date</dt>
                        <dd>{inq.delivery_date}</dd>
                      </div>
                    )}
                    {inq.budget && (
                      <div>
                        <dt className="text-xs text-maroon/45">Budget</dt>
                        <dd>{inq.budget}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-xs text-maroon/45">GST invoice</dt>
                      <dd>{inq.gst_required ? "Yes" : "No"}</dd>
                    </div>
                  </dl>

                  <div>
                    <label className="mb-1 block text-xs text-maroon/45">Admin notes</label>
                    <textarea
                      rows={2}
                      value={notesDraft[inq.id] ?? inq.admin_notes ?? ""}
                      onChange={(e) =>
                        setNotesDraft((prev) => ({ ...prev, [inq.id]: e.target.value }))
                      }
                      className={adminInputClass}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateInquiry(inq.id, {
                          admin_notes: notesDraft[inq.id] ?? inq.admin_notes ?? null,
                        })
                      }
                      className="mt-2 border border-maroon/15 px-4 py-1.5 text-[10px] uppercase tracking-widest text-maroon hover:bg-mist-blue"
                    >
                      Save notes
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
