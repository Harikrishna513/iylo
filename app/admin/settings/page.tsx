"use client";

import { useAuth } from "@/context/AuthContext";

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
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-10">
      <h1 className="editorial-heading mb-8 text-4xl text-ivory">Settings</h1>

      <section className="border border-ivory/10 p-6">
        <h2 className="mb-4 text-lg text-ivory">Database Backup</h2>
        <p className="mb-6 text-sm text-muted">
          Download a ZIP archive of all database tables as CSV files. Superadmin only.
        </p>
        {adminRole === "superadmin" ? (
          <button
            type="button"
            onClick={downloadBackup}
            className="border border-gold px-6 py-3 text-xs uppercase tracking-widest text-gold hover:bg-gold/10"
          >
            Download Backup (.zip)
          </button>
        ) : (
          <p className="text-sm text-muted">Superadmin access required for backup download.</p>
        )}
      </section>

      <section className="mt-8 border border-ivory/10 p-6">
        <h2 className="mb-4 text-lg text-ivory">Payment Gateway</h2>
        <p className="text-sm text-muted">Razorpay is configured via environment variables.</p>
        <p className="mt-2 text-xs text-muted">Role: {adminRole}</p>
      </section>
    </div>
  );
}
