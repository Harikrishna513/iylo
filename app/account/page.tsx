"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { validateIndianPhone } from "@/lib/validation";
import { LIGHT, ALERT } from "@/lib/page-theme";
import { cn } from "@/lib/utils";
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
        <p className={LIGHT.label}>Account</p>
        <h2 className={cn(LIGHT.title, "mt-2 text-2xl md:text-3xl")}>Profile</h2>
        <p className={cn("mt-2", LIGHT.subtitle)}>
          Name and mobile are required to place an order. Email is used for login.
        </p>
      </header>

      <form onSubmit={handleSave} className="space-y-5">
        {error && (
          <div className={ALERT.errorBox} role="alert">
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
            <span className="text-xs text-maroon/55">Profile updated.</span>
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
      <label className={cn("mb-1.5 block", LIGHT.label)}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={LIGHT.input}
      />
      {hint && <p className={cn("mt-1 text-xs", LIGHT.muted)}>{hint}</p>}
    </div>
  );
}
