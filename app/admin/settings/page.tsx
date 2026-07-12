"use client";

import { useAuth } from "@/context/AuthContext";
import { adminCardClass } from "@/components/admin/admin-ui";

export default function AdminSettingsPage() {
  const { adminRole } = useAuth();

  const downloadBackup = async () => {
    const res = await fetch("/api/admin/backup");
    if (!res.ok) {
      alert("Backup failed — superadmin access required");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `iylo-backup-${Date.now()}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h1 className="editorial-heading mb-2 text-3xl text-maroon md:text-4xl">Settings</h1>
      <p className="mb-8 text-sm text-maroon/55">
        Manage operational policy and store configuration.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={adminCardClass}>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-maroon/50">
            Brand Colours
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { name: "Primary · Dark Maroon", hex: "#451519" },
              { name: "Secondary · Powder Blue", hex: "#99BEE0" },
              { name: "Accent · Warm Rosewood", hex: "#6B2A31" },
              { name: "Accent · Mist Blue", hex: "#DCEBF7" },
            ].map((c) => (
              <div key={c.hex} className="flex items-center gap-3">
                <span
                  className="h-10 w-10 shrink-0 rounded-lg border border-maroon/10"
                  style={{ backgroundColor: c.hex }}
                />
                <div>
                  <p className="text-xs font-medium text-maroon">{c.name}</p>
                  <p className="text-[10px] text-maroon/45">{c.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={adminCardClass}>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-maroon/50">
            Payment Gateway
          </h2>
          <p className="mt-3 text-sm text-maroon/70">
            Razorpay is configured via environment variables.
          </p>
          <p className="mt-2 text-xs text-maroon/45">Your role: {adminRole}</p>
        </section>

        <section className={`${adminCardClass} lg:col-span-2`}>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-maroon/50">
            Database Backup
          </h2>
          <p className="mt-3 text-sm text-maroon/70">
            Download every table in the store database as a single ZIP file (one CSV per table).
            Superadmin only.
          </p>
          {adminRole === "superadmin" ? (
            <button
              type="button"
              onClick={downloadBackup}
              className="mt-4 bg-maroon px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white hover:bg-rosewood"
            >
              Download backup (.zip)
            </button>
          ) : (
            <p className="mt-4 text-sm text-maroon/45">Superadmin access required.</p>
          )}
        </section>
      </div>
    </div>
  );
}
