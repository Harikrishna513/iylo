"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Upload,
  FileSpreadsheet,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  X,
} from "lucide-react";
import { PRODUCT_CSV_COLUMN_DESCRIPTORS } from "@/lib/csv-products";
import { adminCardClass, adminTableWrapClass, adminThClass, adminTdClass } from "@/components/admin/admin-ui";

export default function ImportProductsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const [result, setResult] = useState<{
    imported: number;
    updated: number;
    errors: string[];
  } | null>(null);
  const [error, setError] = useState("");

  const downloadTemplate = () => {
    window.location.href = "/api/admin/products/template";
  };

  const downloadExport = () => {
    setExporting(true);
    window.location.href = "/api/admin/products/export";
    setTimeout(() => setExporting(false), 1500);
  };

  const handleFile = useCallback(async (file: File) => {
    if (!/\.csv$/i.test(file.name)) {
      setError("Pick a .csv file. Excel sheets must be saved as CSV first.");
      return;
    }
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError("Please keep imports under 10 MB.");
      return;
    }

    setError("");
    setResult(null);
    setUploadedName(file.name);
    setImporting(true);

    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/products/import", { method: "POST", body: form });
    const data = await res.json();
    setImporting(false);

    if (!res.ok) {
      setError(data.error ?? "Import failed");
      return;
    }
    setResult({
      imported: data.imported ?? 0,
      updated: data.updated ?? 0,
      errors: data.errors ?? [],
    });
  }, []);

  const clearUpload = () => {
    setUploadedName(null);
    setResult(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="editorial-heading text-3xl text-maroon md:text-4xl">Bulk Import</h1>
          <p className="mt-1 text-sm text-maroon/55">
            Upload products from CSV in bulk.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-maroon/65 hover:text-maroon"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <ActionCard
          icon={Download}
          title="Download template"
          description="Empty CSV with all columns and one example row."
          action="Download"
          onClick={downloadTemplate}
        />
        <ActionCard
          icon={FileSpreadsheet}
          title="Export current catalogue"
          description="Every product as one CSV for editing and re-import."
          action={exporting ? "Exporting…" : "Export CSV"}
          onClick={downloadExport}
          busy={exporting}
        />
        <ActionCard
          icon={Upload}
          title="Need help?"
          description="See the column reference at the bottom for what each header means."
          action="Scroll down"
          onClick={() => {
            document
              .getElementById("column-reference")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-rosewood/30 bg-rosewood/10 px-4 py-3 text-sm text-rosewood">
          {error}
        </p>
      )}

      {!uploadedName && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragOver(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
          className={`flex w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed p-10 transition-colors sm:p-14 ${
            dragOver
              ? "border-light-blue bg-mist-blue text-maroon"
              : "border-maroon/25 bg-white text-maroon/65 hover:border-light-blue/60 hover:bg-mist-blue/40"
          }`}
        >
          <Upload className="h-9 w-9 opacity-70" />
          <p className="text-base font-bold text-maroon">
            Drop CSV here, or click to choose a file
          </p>
          <p className="max-w-md text-center text-xs leading-relaxed text-maroon/55">
            One row per product. Up to 10 MB. Excel users: File → Save As → CSV
            (Comma Delimited).
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
        </button>
      )}

      {uploadedName && (
        <div className={`${adminCardClass} space-y-4`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-medium text-maroon">
                <FileSpreadsheet className="h-5 w-5 text-light-blue" />
                {uploadedName}
              </h2>
              {importing && (
                <p className="mt-2 flex items-center gap-2 text-sm text-maroon/60">
                  <Loader2 className="h-4 w-4 animate-spin" /> Importing…
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={clearUpload}
              disabled={importing}
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-maroon/55 hover:text-maroon disabled:opacity-50"
            >
              <X className="h-4 w-4" /> Clear file
            </button>
          </div>

          {result && (
            <div
              className={`rounded-lg border p-4 ${
                result.errors.length
                  ? "border-rosewood/30 bg-rosewood/5"
                  : "border-light-blue/40 bg-mist-blue"
              }`}
            >
              <div className="flex items-start gap-3">
                {result.errors.length ? (
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-rosewood" />
                ) : (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-light-blue" />
                )}
                <div>
                  <p className="font-medium text-maroon">
                    Imported {result.imported}, updated {result.updated}
                    {result.errors.length
                      ? ` · ${result.errors.length} row issue(s)`
                      : "."}
                  </p>
                  {result.errors.length > 0 && (
                    <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto text-xs text-rosewood">
                      {result.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                  <Link
                    href="/admin/products"
                    className="mt-3 inline-block text-xs text-light-blue hover:underline"
                  >
                    Back to products →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <section id="column-reference" className="mt-10">
        <h2 className="editorial-heading mb-2 text-2xl text-maroon">Column reference</h2>
        <p className="mb-4 text-sm text-maroon/55">
          Header names must match exactly (case-insensitive). Unknown columns are ignored.
        </p>
        <div className={adminTableWrapClass}>
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-maroon/10">
                <th className={adminThClass}>Column</th>
                <th className={adminThClass}>Required</th>
                <th className={adminThClass}>Description</th>
                <th className={adminThClass}>Example</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCT_CSV_COLUMN_DESCRIPTORS.map((col) => (
                <tr key={col.column} className="border-b border-maroon/5 last:border-0">
                  <td className={`${adminTdClass} font-mono text-xs`}>{col.column}</td>
                  <td className={adminTdClass}>
                    {col.required ? (
                      <span className="text-xs font-semibold text-rosewood">Yes</span>
                    ) : (
                      <span className="text-xs text-maroon/45">No</span>
                    )}
                  </td>
                  <td className={`${adminTdClass} text-maroon/70`}>{col.description}</td>
                  <td className={`${adminTdClass} font-mono text-xs text-maroon/55`}>
                    {col.example}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ActionCard({
  icon: Icon,
  title,
  description,
  action,
  onClick,
  busy,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
  busy?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="group flex flex-col gap-3 rounded-lg border border-maroon/10 bg-white p-5 text-left shadow-sm transition-all hover:border-light-blue hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mist-blue text-maroon">
        {busy ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Icon className="h-5 w-5" />
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-maroon">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-maroon/55">{description}</p>
      </div>
      <span className="mt-auto text-xs font-bold text-light-blue group-hover:underline">
        {action} →
      </span>
    </button>
  );
}
