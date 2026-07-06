"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Mail, MessageSquare, Check } from "lucide-react";

export default function NotificationsPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [emailPref, setEmailPref] = useState(true);
  const [smsPref, setSmsPref] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setEmailPref(profile.notification_email ?? true);
      setSmsPref(profile.notification_sms ?? false);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    await supabase
      .from("users")
      .update({
        notification_email: emailPref,
        notification_sms: smsPref,
      })
      .eq("id", user.id);

    await refreshProfile();
    setSaved(true);
    setLoading(false);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-xl">
      <header className="mb-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gold">
          Account
        </p>
        <h2 className="editorial-heading mt-2 text-2xl text-ivory md:text-3xl">
          Notifications
        </h2>
        <p className="mt-2 text-sm text-muted">
          Choose how you&apos;d like to hear from us — order updates, weekend box
          alerts, and workshop announcements.
        </p>
      </header>

      <div className="space-y-3.5">
        <SettingRow
          icon={<Mail size={18} strokeWidth={1.7} />}
          title="Email Notifications"
          description="Order confirmations, delivery updates, and occasional offers."
          checked={emailPref}
          onChange={setEmailPref}
        />
        <SettingRow
          icon={<MessageSquare size={18} strokeWidth={1.7} />}
          title="SMS Notifications"
          description="Critical order updates sent directly to your phone."
          checked={smsPref}
          onChange={setSmsPref}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-ivory/10 pt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="border border-gold bg-gold px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-black transition-opacity hover:bg-gold/90 disabled:opacity-50"
        >
          {loading ? "Saving…" : saved ? "Preferences Saved" : "Save Preferences"}
        </button>
        <span
          className={`inline-flex items-center gap-1.5 text-xs text-emerald-400 transition-opacity ${
            saved ? "opacity-100" : "opacity-0"
          }`}
        >
          <Check size={14} />
          Your preferences have been updated.
        </span>
      </div>
    </div>
  );
}

function SettingRow({
  icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="group flex cursor-pointer items-start justify-between gap-4 border border-ivory/10 p-5 transition-colors hover:border-ivory/20 md:p-6">
      <div className="flex min-w-0 flex-1 items-start gap-3.5">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border border-ivory/10 text-gold">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-ivory">{title}</p>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onChange={onChange} label={title} />
    </label>
  );
}

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onChange(!checked);
      }}
      className={`relative h-6 w-11 shrink-0 rounded-full p-[3px] transition-colors ${
        checked ? "bg-gold" : "bg-ivory/20 hover:bg-ivory/30"
      }`}
    >
      <span
        className={`block h-[18px] w-[18px] rounded-full bg-black shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
