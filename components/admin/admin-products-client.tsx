"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FileSpreadsheet, Plus, Search, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { AdminCategoryRow, AdminProduct } from "@/lib/admin";
import {
  adminInputClass,
  adminSelectClass,
  adminTableWrapClass,
  adminThClass,
  adminTdClass,
  adminCardClass,
} from "@/components/admin/admin-ui";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

interface AdminProductsClientProps {
  initialProducts: AdminProduct[];
}

export function AdminProductsClient({ initialProducts }: AdminProductsClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showNew, setShowNew] = useState(false);

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
          <Link
            href="/admin/products/import"
            className="inline-flex items-center gap-2 border border-maroon/15 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-maroon transition-colors hover:bg-mist-blue"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Import / Export
          </Link>
          <button
            type="button"
            onClick={() => setShowNew(true)}
            className="inline-flex items-center gap-2 bg-maroon px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-rosewood"
          >
            <Plus className="h-3.5 w-3.5" />
            New Product
          </button>
        </div>
      </div>

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
                <td className={`${adminTdClass} text-maroon/70`}>{p.category_name || "—"}</td>
                <td className={`${adminTdClass} text-light-blue`}>
                  {p.base_price != null ? formatPrice(p.base_price) : "—"}
                </td>
                <td className={`${adminTdClass} text-maroon/70`}>
                  {p.stock_total}
                  <span className="text-xs text-maroon/40"> · {p.variant_count} var</span>
                </td>
                <td className={adminTdClass}>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      p.is_active
                        ? "bg-mist-blue text-maroon"
                        : "bg-maroon/10 text-maroon/50"
                    }`}
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
                        className="text-maroon/40 hover:text-rosewood"
                        aria-label="Hide product"
                      >
                        <Trash2 className="h-4 w-4" />
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
            {search ? "No matching products" : "No products yet"}
          </p>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hide product?"
        message={
          deleteTarget
            ? `"${deleteTarget.name}" will be hidden from the storefront.`
            : ""
        }
        confirmLabel="Hide"
        destructive
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {showNew && (
        <NewProductModal
          onClose={() => setShowNew(false)}
          onCreated={() => {
            setShowNew(false);
            window.location.reload();
          }}
        />
      )}
    </>
  );
}

function NewProductModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [categories, setCategories] = useState<AdminCategoryRow[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((d) => {
        setCategories(d.categories ?? []);
        if (d.categories?.[0]) setCategoryId(d.categories[0].id);
      })
      .catch(() => {});
  }, []);

  const syncSlug = (value: string) => {
    setName(value);
    setSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug,
        category_id: categoryId,
        short_description: shortDescription || name,
        base_price: basePrice,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to create product");
      return;
    }
    onCreated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className={`${adminCardClass} w-full max-w-lg`}>
        <h2 className="editorial-heading text-2xl text-maroon">New Product</h2>
        <p className="mt-1 text-xs text-maroon/50">
          Creates a catalogue entry. Use Import / Export for bulk updates.
        </p>
        {error && <p className="mt-3 text-sm text-rosewood">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-maroon/50">
              Name
            </label>
            <input
              required
              value={name}
              onChange={(e) => syncSlug(e.target.value)}
              className={adminInputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-maroon/50">
              Slug
            </label>
            <input
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={adminInputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-maroon/50">
              Category
            </label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={`${adminSelectClass} w-full`}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-maroon/50">
              Short description
            </label>
            <input
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className={adminInputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-maroon/50">
              Base price (₹)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              className={adminInputClass}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="border border-maroon/15 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-maroon"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-maroon px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-white disabled:opacity-60"
            >
              {saving ? "Saving…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
