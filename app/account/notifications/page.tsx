"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Mail, MessageSquare, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { LIGHT } from "@/lib/page-theme";

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
        <p className={LIGHT.label}>Account</p>
        <h2 className={cn(LIGHT.title, "mt-2 text-2xl md:text-3xl")}>Notifications</h2>
        <p className={cn("mt-2", LIGHT.subtitle)}>
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

      <div className={cn("mt-8 flex flex-wrap items-center gap-4 border-t pt-6", LIGHT.border)}>
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="bg-maroon px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-opacity hover:bg-rosewood disabled:opacity-50"
        >
          {loading ? "Saving…" : saved ? "Preferences Saved" : "Save Preferences"}
        </button>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-xs text-maroon/55 transition-opacity",
            saved ? "opacity-100" : "opacity-0"
          )}
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
    <label
      className={cn(
        "group flex cursor-pointer items-start justify-between gap-4 border p-5 transition-colors hover:border-maroon/20 md:p-6",
        LIGHT.border
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3.5">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border border-maroon/10 bg-mist-blue text-light-blue">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-maroon">{title}</p>
          <p className={cn("mt-1 text-[13px] leading-relaxed", LIGHT.muted)}>{description}</p>
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
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full p-[3px] transition-colors",
        checked ? "bg-light-blue" : "bg-maroon/15 hover:bg-maroon/25"
      )}
    >
      <span
        className={cn(
          "block h-[18px] w-[18px] rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}
