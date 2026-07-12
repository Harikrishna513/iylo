"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  adminCardClass,
  adminInputClass,
  adminSelectClass,
  adminTableWrapClass,
  adminThClass,
  adminTdClass,
} from "@/components/admin/admin-ui";

interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  role: "admin" | "superadmin";
  is_active: boolean;
  created_at: string;
}

export default function AdminUsersPage() {
  const { user, adminRole } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "superadmin">("admin");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/admin-users");
    const data = await res.json();
    if (res.ok) setAdmins(data.admins ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (adminRole === "superadmin") load();
    else setLoading(false);
  }, [adminRole]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    const res = await fetch("/api/admin/admin-users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed to add admin");
      return;
    }
    setMessage("Admin access granted.");
    setEmail("");
    load();
  };

  if (adminRole !== "superadmin") {
    return (
      <div>
        <h1 className="editorial-heading text-3xl text-maroon">Admin Users</h1>
        <p className="mt-4 text-sm text-maroon/60">Superadmin access required.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="editorial-heading text-3xl text-maroon md:text-4xl">Admin Users</h1>
      <p className="mt-1 text-sm text-maroon/55">
        Manage who has access to the admin panel.
      </p>

      <form onSubmit={handleAdd} className={`${adminCardClass} mt-8 max-w-lg`}>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-maroon/50">
          Add Admin
        </h2>
        <p className="mt-1 text-xs text-maroon/45">
          Email must already have a customer account on the store.
        </p>
        {error && <p className="mt-3 text-sm text-rosewood">{error}</p>}
        {message && <p className="mt-3 text-sm text-light-blue">{message}</p>}
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-maroon/50">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@iylobakehouse.com"
              className={adminInputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-maroon/50">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "superadmin")}
              className={adminSelectClass}
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-maroon px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white hover:bg-rosewood"
          >
            Add Admin
          </button>
        </div>
      </form>

      <div className={`${adminTableWrapClass} mt-8`}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-maroon/10">
              <th className={adminThClass}>Email</th>
              <th className={adminThClass}>Role</th>
              <th className={adminThClass}>Added</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-sm text-maroon/50">
                  Loading…
                </td>
              </tr>
            ) : (
              admins.map((a) => (
                <tr key={a.id} className="border-b border-maroon/5 last:border-0">
                  <td className={adminTdClass}>
                    {a.email}
                    {a.user_id === user?.id && (
                      <span className="ml-2 text-xs text-light-blue">You</span>
                    )}
                  </td>
                  <td className={adminTdClass}>
                    <span className="rounded-full bg-mist-blue px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-maroon">
                      {a.role}
                    </span>
                  </td>
                  <td className={`${adminTdClass} text-maroon/60`}>
                    {new Date(a.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
