"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { validateIndianPhone } from "@/lib/validation";
import { Button } from "@/components/ui/button";

export default function AccountProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setPhone(profile.phone ?? "");
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError("");
    setLoading(true);

    const normalizedPhone = phone.trim() ? validateIndianPhone(phone) : null;
    if (phone.trim() && !normalizedPhone) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      setLoading(false);
      return;
    }
    if (!name.trim()) {
      setError("Name is required.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({
        name: name.trim(),
        phone: normalizedPhone,
      })
      .eq("id", user.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg">
      <header className="mb-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gold">
          Account
        </p>
        <h2 className="editorial-heading mt-2 text-2xl text-ivory md:text-3xl">
          Profile
        </h2>
        <p className="mt-2 text-sm text-muted">
          Name and mobile are required to place an order. Email is used for login.
        </p>
      </header>

      <form onSubmit={handleSave} className="space-y-5">
        {error && (
          <div className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <Field label="Full Name *" value={name} onChange={setName} />
        <Field
          label="Email"
          value={user?.email ?? ""}
          onChange={() => {}}
          disabled
          hint="Email cannot be changed here."
        />
        <Field
          label="Mobile Number *"
          value={phone}
          onChange={(v) => setPhone(v.replace(/[^\d+\s]/g, ""))}
          placeholder="98765 43210"
        />

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button type="submit" variant="gold" disabled={loading}>
            {loading ? "Saving…" : saved ? "Saved" : "Save Profile"}
          </Button>
          {saved && (
            <span className="text-xs text-emerald-400">Profile updated.</span>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-muted">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full border border-ivory/20 bg-black px-4 py-3 text-sm text-ivory outline-none transition-colors focus:border-gold disabled:opacity-50"
      />
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}
