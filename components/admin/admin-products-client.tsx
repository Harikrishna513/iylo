"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Download, Upload, Trash2, Search } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { AdminProduct } from "@/lib/admin";
import {
  adminInputClass,
  adminSelectClass,
  adminTableWrapClass,
  adminThClass,
  adminTdClass,
} from "@/components/admin/admin-ui";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

interface AdminProductsClientProps {
  initialProducts: AdminProduct[];
}

export function AdminProductsClient({ initialProducts }: AdminProductsClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.category_name.toLowerCase().includes(q)
    );
  }, [products, search]);

  const handleExport = () => {
    window.location.href = "/api/admin/products/export";
  };

  const handleImport = async (file: File) => {
    setImporting(true);
    setImportMessage("");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/products/import", { method: "POST", body: form });
    const data = await res.json();
    setImporting(false);
    if (!res.ok) {
      setImportMessage(data.error ?? "Import failed");
      return;
    }
    setImportMessage(
      `Imported ${data.imported}, updated ${data.updated}${
        data.errors?.length ? `. ${data.errors.length} row(s) had issues.` : "."
      }`
    );
    window.location.reload();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/products/${deleteTarget.id}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === deleteTarget.id ? { ...p, is_active: false } : p
        )
      );
      setDeleteTarget(null);
    } else {
      const data = await res.json();
      alert(data.error ?? "Delete failed");
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="editorial-heading text-3xl text-maroon md:text-4xl">Products</h1>
          <p className="mt-1 text-sm text-maroon/55">
            {products.length} products in catalogue
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 border border-maroon/15 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-maroon transition-colors hover:bg-mist-blue"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={importing}
            className="inline-flex items-center gap-2 border border-maroon/15 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-maroon transition-colors hover:bg-mist-blue disabled:opacity-60"
          >
            <Upload className="h-3.5 w-3.5" />
            {importing ? "Importing…" : "Import CSV"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImport(file);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      {importMessage && (
        <p className="mb-4 rounded-lg border border-light-blue/40 bg-mist-blue px-4 py-3 text-sm text-maroon">
          {importMessage}
        </p>
      )}

      <div className="relative mb-6 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-maroon/40" />
        <input
          type="search"
          placeholder="Search by name, slug, or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${adminInputClass} pl-10`}
        />
      </div>

      <div className={adminTableWrapClass}>
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-maroon/10">
              <th className={adminThClass}>Product</th>
              <th className={adminThClass}>Category</th>
              <th className={adminThClass}>Price</th>
              <th className={adminThClass}>Stock</th>
              <th className={adminThClass}>Status</th>
              <th className={adminThClass}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-maroon/5 last:border-0">
                <td className={adminTdClass}>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-maroon/45">{p.slug}</p>
                </td>
                <td className={`${adminTdClass} text-maroon/70`}>{p.category_name}</td>
                <td className={`${adminTdClass} text-light-blue`}>
                  {p.base_price ? formatPrice(p.base_price) : "Enquiry"}
                </td>
                <td className={`${adminTdClass} text-maroon/70`}>{p.stock_total}</td>
                <td className={adminTdClass}>
                  <span
                    className={
                      p.is_active
                        ? "rounded-full bg-mist-blue px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-maroon"
                        : "rounded-full bg-maroon/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-maroon/50"
                    }
                  >
                    {p.is_active ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className={adminTdClass}>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/products/${p.slug}`}
                      target="_blank"
                      className="text-xs text-light-blue hover:underline"
                    >
                      View
                    </Link>
                    {p.is_active && (
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(p)}
                        className="inline-flex items-center gap-1 text-xs text-rosewood hover:underline"
                      >
                        <Trash2 className="h-3 w-3" />
                        Hide
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && (
          <p className="p-8 text-center text-sm text-maroon/50">
            {search ? "No products match your search." : "No products in database."}
          </p>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hide product?"
        message={`"${deleteTarget?.name}" will be hidden from the storefront. You can re-activate it later via CSV import or the database.`}
        confirmLabel="Hide product"
        destructive
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
