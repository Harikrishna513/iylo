"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { validatePincode, validateIndianPhone } from "@/lib/validation";
import { LIGHT, ALERT } from "@/lib/page-theme";
import { cn } from "@/lib/utils";
import { Plus, Edit2, Trash2, MapPin, Star, X } from "lucide-react";

interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

const EMPTY: Omit<Address, "id" | "user_id"> = {
  full_name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "Bangalore",
  state: "Karnataka",
  pincode: "",
  is_default: false,
};

export default function AddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Address> | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });
    setAddresses((data ?? []) as Address[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const startNew = () => setEditing({ ...EMPTY, is_default: addresses.length === 0 });
  const startEdit = (a: Address) => setEditing(a);
  const cancel = () => {
    setEditing(null);
    setError("");
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editing) return;
    setError("");

    const phone = validateIndianPhone(editing.phone || "");
    if (!phone) return setError("Please enter a valid Indian phone number.");
    if (!validatePincode(editing.pincode || "")) return setError("Pincode must be 6 digits.");
    if (!editing.full_name?.trim()) return setError("Recipient name required.");
    if (!editing.line1?.trim()) return setError("Address required.");
    if (!editing.city?.trim() || !editing.state?.trim()) return setError("City & state required.");

    const payload = {
      user_id: user.id,
      full_name: editing.full_name.trim(),
      phone,
      line1: editing.line1.trim(),
      line2: editing.line2?.trim() || null,
      city: editing.city.trim(),
      state: editing.state.trim(),
      pincode: editing.pincode,
      is_default: !!editing.is_default,
    };

    if (payload.is_default) {
      await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
    }

    if (editing.id) {
      await supabase.from("addresses").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("addresses").insert(payload);
    }

    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    await supabase.from("addresses").delete().eq("id", id);
    load();
  };

  const setDefault = async (id: string) => {
    if (!user) return;
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
    await supabase.from("addresses").update({ is_default: true }).eq("id", id);
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className={cn(LIGHT.title, "text-2xl")}>Addresses</h2>
          <p className={cn("mt-1", LIGHT.subtitle)}>Save addresses for faster checkout.</p>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={startNew}
            className="inline-flex items-center gap-2 border border-light-blue bg-mist-blue px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-maroon transition-colors hover:bg-mist-blue/80"
          >
            <Plus size={16} /> Add New
          </button>
        )}
      </div>

      {editing && (
        <form onSubmit={save} className={cn("relative mb-6 space-y-4 border bg-mist-blue/30 p-6", LIGHT.border)}>
          <button
            type="button"
            onClick={cancel}
            className="absolute right-4 top-4 text-maroon/45 hover:text-maroon"
          >
            <X size={18} />
          </button>
          <h3 className="text-lg font-medium text-maroon">
            {editing.id ? "Edit Address" : "New Address"}
          </h3>

          {error && (
            <div className={ALERT.errorBox} role="alert">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Recipient Name *"
              value={editing.full_name || ""}
              onChange={(v) => setEditing({ ...editing, full_name: v })}
            />
            <Input
              label="Phone *"
              value={editing.phone || ""}
              onChange={(v) => setEditing({ ...editing, phone: v.replace(/[^\d+\s]/g, "") })}
              placeholder="98765 43210"
            />
            <Input
              label="Address Line 1 *"
              value={editing.line1 || ""}
              onChange={(v) => setEditing({ ...editing, line1: v })}
              className="md:col-span-2"
            />
            <Input
              label="Address Line 2"
              value={editing.line2 || ""}
              onChange={(v) => setEditing({ ...editing, line2: v })}
              className="md:col-span-2"
            />
            <Input
              label="City *"
              value={editing.city || ""}
              onChange={(v) => setEditing({ ...editing, city: v })}
            />
            <Input
              label="State *"
              value={editing.state || ""}
              onChange={(v) => setEditing({ ...editing, state: v })}
            />
            <Input
              label="Pincode *"
              value={editing.pincode || ""}
              onChange={(v) =>
                setEditing({ ...editing, pincode: v.replace(/\D/g, "").slice(0, 6) })
              }
              maxLength={6}
            />
            <label className="mt-7 flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!editing.is_default}
                onChange={(e) => setEditing({ ...editing, is_default: e.target.checked })}
                className="h-4 w-4 accent-gold"
              />
              <span className="text-sm text-maroon/70">Set as default address</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-maroon px-7 py-3 text-xs font-semibold uppercase tracking-widest text-white hover:bg-rosewood"
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={cancel}
              className="px-7 py-3 text-xs font-semibold uppercase tracking-widest text-maroon/50 hover:text-maroon"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className={cn("py-10 text-center", LIGHT.muted)}>Loading…</p>
      ) : addresses.length === 0 && !editing ? (
        <div className="py-12 text-center">
          <MapPin size={48} className="mx-auto mb-3 text-maroon/15" />
          <p className={LIGHT.muted}>No saved addresses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {addresses.map((a) => (
            <div
              key={a.id}
              className={cn("border p-5 transition-colors hover:border-maroon/20", LIGHT.border)}
            >
              <div className="mb-2 flex items-start justify-between">
                <p className="text-sm font-semibold text-maroon">{a.full_name}</p>
                {a.is_default && (
                  <span className="flex items-center gap-1 bg-mist-blue px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-maroon">
                    <Star size={10} /> Default
                  </span>
                )}
              </div>
              <p className={cn("text-sm leading-relaxed", LIGHT.body)}>
                {a.line1}
                {a.line2 && `, ${a.line2}`}
                <br />
                {a.city}, {a.state} - {a.pincode}
                <br />
                Phone: {a.phone}
              </p>
              <div className={cn("mt-3 flex gap-2 border-t pt-3", LIGHT.border)}>
                <button
                  type="button"
                  onClick={() => startEdit(a)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-maroon/50 hover:text-light-blue"
                >
                  <Edit2 size={12} /> Edit
                </button>
                {!a.is_default && (
                  <button
                    type="button"
                    onClick={() => setDefault(a.id)}
                    className="text-xs font-semibold text-maroon/50 hover:text-light-blue"
                  >
                    Set as Default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(a.id)}
                  className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-rosewood hover:text-maroon"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  className,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  maxLength?: number;
}) {
  return (
    <div className={className}>
      <label className={cn("mb-1.5 ml-1 block", LIGHT.label)}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={LIGHT.input}
      />
    </div>
  );
}
