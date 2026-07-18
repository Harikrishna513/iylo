"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import type { AdminCategoryRow, AdminProduct, AdminProductVariant } from "@/lib/admin";
import {
  adminCardClass,
  adminInputClass,
  adminSelectClass,
} from "@/components/admin/admin-ui";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";

type Tab = "details" | "variants";

const DIET_TYPES = ["eggless", "veg", "egg", "non_veg"] as const;
const AVAILABILITY_TYPES = ["daily", "pre_order", "weekend", "seasonal", "limited"] as const;

interface ProductEditorModalProps {
  productId: string;
  categories: AdminCategoryRow[];
  onClose: () => void;
  onSaved: (product: AdminProduct) => void;
}

export function ProductEditorModal({
  productId,
  categories,
  onClose,
  onSaved,
}: ProductEditorModalProps) {
  const [tab, setTab] = useState<Tab>("details");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [product, setProduct] = useState<AdminProduct | null>(null);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [dietType, setDietType] = useState("eggless");
  const [availabilityType, setAvailabilityType] = useState("daily");
  const [isActive, setIsActive] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isSeasonal, setIsSeasonal] = useState(false);
  const [preparationTime, setPreparationTime] = useState("");
  const [shelfLife, setShelfLife] = useState("");
  const [weightLabel, setWeightLabel] = useState("");

  useBodyScrollLock(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/products/${productId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load product");
      const p = data.product as AdminProduct;
      setProduct(p);
      setName(p.name);
      setCategoryId(p.category_id);
      setShortDescription(p.short_description ?? "");
      setLongDescription(p.long_description ?? "");
      setBasePrice(p.base_price != null ? String(p.base_price) : "");
      setOfferPrice(p.offer_price != null ? String(p.offer_price) : "");
      setDietType(p.diet_type || "eggless");
      setAvailabilityType(p.availability_type || "daily");
      setIsActive(p.is_active);
      setIsBestseller(p.is_bestseller);
      setIsFeatured(p.is_featured);
      setIsNew(p.is_new);
      setIsSeasonal(p.is_seasonal);
      setPreparationTime(p.preparation_time ?? "");
      setShelfLife(p.shelf_life ?? "");
      setWeightLabel(p.weight_label ?? "");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category_id: categoryId,
          short_description: shortDescription || name,
          long_description: longDescription,
          base_price: basePrice,
          offer_price: offerPrice,
          diet_type: dietType,
          availability_type: availabilityType,
          is_active: isActive,
          is_bestseller: isBestseller,
          is_featured: isFeatured,
          is_new: isNew,
          is_seasonal: isSeasonal,
          preparation_time: preparationTime,
          shelf_life: shelfLife,
          weight_label: weightLabel,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setProduct(data.product);
      onSaved(data.product);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const refreshVariants = async () => {
    const res = await fetch(`/api/admin/products/${productId}`);
    const data = await res.json();
    if (res.ok) {
      setProduct(data.product);
      onSaved(data.product);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-maroon/45 p-4"
      onWheel={(e) => e.stopPropagation()}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-product-title"
        className={`${adminCardClass} flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden p-0`}
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between border-b border-maroon/10 px-6 py-4">
          <div>
            <h2 id="edit-product-title" className="editorial-heading text-2xl text-maroon">
              Edit Product
            </h2>
            <p className="mt-0.5 text-xs text-maroon/50">
              Update catalogue details, pricing, and variants.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-maroon/50 hover:bg-mist-blue hover:text-maroon"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex border-b border-maroon/10 px-6">
          {(["details", "variants"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`border-b-2 px-4 py-3 text-xs font-semibold uppercase tracking-widest transition-colors ${
                tab === t
                  ? "border-maroon text-maroon"
                  : "border-transparent text-maroon/45 hover:text-maroon"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-maroon/40" />
            </div>
          ) : error && !product ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : tab === "details" ? (
            <form id="product-details-form" onSubmit={handleSaveDetails} className="space-y-4">
              {error && <p className="text-sm text-red-600">{error}</p>}

              <Field label="Name">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={adminInputClass}
                />
              </Field>

              <Field label="Category">
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
              </Field>

              <Field label="Short description">
                <textarea
                  required
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className={adminInputClass}
                />
              </Field>

              <Field label="Long description">
                <textarea
                  rows={4}
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  className={adminInputClass}
                  placeholder="Full product story for the detail page…"
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Base price (₹)">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className={adminInputClass}
                  />
                </Field>
                <Field label="Offer price (₹)">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className={adminInputClass}
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Diet type">
                  <select
                    value={dietType}
                    onChange={(e) => setDietType(e.target.value)}
                    className={`${adminSelectClass} w-full`}
                  >
                    {DIET_TYPES.map((d) => (
                      <option key={d} value={d}>
                        {d.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Availability">
                  <select
                    value={availabilityType}
                    onChange={(e) => setAvailabilityType(e.target.value)}
                    className={`${adminSelectClass} w-full`}
                  >
                    {AVAILABILITY_TYPES.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Preparation time">
                  <input
                    value={preparationTime}
                    onChange={(e) => setPreparationTime(e.target.value)}
                    className={adminInputClass}
                    placeholder="e.g. 1–2 days"
                  />
                </Field>
                <Field label="Shelf life">
                  <input
                    value={shelfLife}
                    onChange={(e) => setShelfLife(e.target.value)}
                    className={adminInputClass}
                    placeholder="e.g. 3 days"
                  />
                </Field>
                <Field label="Weight label">
                  <input
                    value={weightLabel}
                    onChange={(e) => setWeightLabel(e.target.value)}
                    className={adminInputClass}
                    placeholder="e.g. 500g"
                  />
                </Field>
              </div>

              <div className="flex flex-wrap gap-4 border-t border-maroon/10 pt-4">
                <Flag
                  label="Visible on store"
                  checked={isActive}
                  onChange={setIsActive}
                />
                <Flag label="Bestseller" checked={isBestseller} onChange={setIsBestseller} />
                <Flag label="Featured" checked={isFeatured} onChange={setIsFeatured} />
                <Flag label="New" checked={isNew} onChange={setIsNew} />
                <Flag label="Seasonal" checked={isSeasonal} onChange={setIsSeasonal} />
              </div>
            </form>
          ) : (
            <VariantsTab
              productId={productId}
              variants={product?.variants ?? []}
              onChanged={refreshVariants}
            />
          )}
        </div>

        {tab === "details" && !loading && product && (
          <div className="flex justify-end gap-2 border-t border-maroon/10 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="border border-maroon/15 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-maroon"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="product-details-form"
              disabled={saving}
              className="bg-maroon px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs uppercase tracking-widest text-maroon/50">
        {label}
      </label>
      {children}
    </div>
  );
}

function Flag({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-maroon">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-maroon"
      />
      {label}
    </label>
  );
}

function VariantsTab({
  productId,
  variants,
  onChanged,
}: {
  productId: string;
  variants: AdminProductVariant[];
  onChanged: () => Promise<void>;
}) {
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("0");
  const [adding, setAdding] = useState(false);

  const saveVariant = async (
    id: string,
    patch: Record<string, string | number | boolean | null>
  ) => {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/variants/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Update failed");
      await onChanged();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const removeVariant = async (id: string) => {
    if (!confirm("Delete this variant?")) return;
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/variants/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Delete failed");
      await onChanged();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const addVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError("");
    try {
      const res = await fetch("/api/admin/variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          name: newName,
          price: Number(newPrice),
          stock_quantity: Number(newStock) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Add failed");
      setNewName("");
      setNewPrice("");
      setNewStock("0");
      await onChanged();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-5">
      {error && <p className="text-sm text-red-600">{error}</p>}

      {variants.length === 0 ? (
        <p className="text-sm text-maroon/50">
          No variants yet. Add sizes or pack options below (price & stock live here).
        </p>
      ) : (
        <div className="space-y-3">
          {variants.map((v) => (
            <VariantRow
              key={v.id}
              variant={v}
              busy={busyId === v.id}
              onSave={saveVariant}
              onDelete={removeVariant}
            />
          ))}
        </div>
      )}

      <form
        onSubmit={addVariant}
        className="space-y-3 rounded-lg border border-dashed border-maroon/20 bg-mist-blue/40 p-4"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-maroon/50">
          Add variant
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            required
            placeholder="Label (e.g. 0.5 kg)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className={adminInputClass}
          />
          <input
            required
            type="number"
            min="0"
            step="1"
            placeholder="Price ₹"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            className={adminInputClass}
          />
          <input
            type="number"
            min="0"
            step="1"
            placeholder="Stock"
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
            className={adminInputClass}
          />
        </div>
        <button
          type="submit"
          disabled={adding}
          className="inline-flex items-center gap-1.5 bg-maroon px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white disabled:opacity-60"
        >
          <Plus className="h-3.5 w-3.5" />
          {adding ? "Adding…" : "Add variant"}
        </button>
      </form>
    </div>
  );
}

function VariantRow({
  variant,
  busy,
  onSave,
  onDelete,
}: {
  variant: AdminProductVariant;
  busy: boolean;
  onSave: (
    id: string,
    patch: Record<string, string | number | boolean | null>
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [name, setName] = useState(variant.name);
  const [price, setPrice] = useState(String(variant.price));
  const [offer, setOffer] = useState(
    variant.offer_price != null ? String(variant.offer_price) : ""
  );
  const [stock, setStock] = useState(String(variant.stock_quantity));
  const [active, setActive] = useState(variant.is_active);

  useEffect(() => {
    setName(variant.name);
    setPrice(String(variant.price));
    setOffer(variant.offer_price != null ? String(variant.offer_price) : "");
    setStock(String(variant.stock_quantity));
    setActive(variant.is_active);
  }, [variant]);

  const blurSave = (
    field: string,
    value: string | number | boolean | null
  ) => {
    const current =
      field === "name"
        ? variant.name
        : field === "price"
          ? variant.price
          : field === "offer_price"
            ? variant.offer_price
            : field === "stock_quantity"
              ? variant.stock_quantity
              : variant.is_active;
    if (String(current ?? "") === String(value ?? "")) return;
    void onSave(variant.id, { [field]: value });
  };

  return (
    <div className="rounded-lg border border-maroon/10 bg-white p-3">
      <div className="grid gap-2 sm:grid-cols-5">
        <input
          value={name}
          disabled={busy}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => blurSave("name", name)}
          className={adminInputClass}
          placeholder="Label"
        />
        <input
          type="number"
          min="0"
          step="1"
          value={price}
          disabled={busy}
          onChange={(e) => setPrice(e.target.value)}
          onBlur={() => blurSave("price", Number(price))}
          className={adminInputClass}
          placeholder="Price"
        />
        <input
          type="number"
          min="0"
          step="1"
          value={offer}
          disabled={busy}
          onChange={(e) => setOffer(e.target.value)}
          onBlur={() =>
            blurSave("offer_price", offer === "" ? null : Number(offer))
          }
          className={adminInputClass}
          placeholder="Offer"
        />
        <input
          type="number"
          min="0"
          step="1"
          value={stock}
          disabled={busy}
          onChange={(e) => setStock(e.target.value)}
          onBlur={() => blurSave("stock_quantity", Number(stock))}
          className={adminInputClass}
          placeholder="Stock"
          title="Live inventory — updates immediately for storefront checkout"
        />
        <div className="flex items-center justify-between gap-2">
          <label className="flex items-center gap-1.5 text-xs text-maroon">
            <input
              type="checkbox"
              checked={active}
              disabled={busy}
              onChange={(e) => {
                setActive(e.target.checked);
                void onSave(variant.id, { is_active: e.target.checked });
              }}
              className="accent-maroon"
            />
            Active
          </label>
          <button
            type="button"
            disabled={busy}
            onClick={() => onDelete(variant.id)}
            className="p-1.5 text-maroon/40 hover:text-rosewood disabled:opacity-50"
            aria-label="Delete variant"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="mt-1 font-mono text-[10px] text-maroon/40">
        {variant.sku} · low alert at {variant.low_stock_threshold} pcs
      </p>
    </div>
  );
}
