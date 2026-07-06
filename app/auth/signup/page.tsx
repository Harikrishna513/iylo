"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { SITE_HEADER_OFFSET_PX } from "@/lib/brand";

export default function SignUpPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await signUp(email, password, fullName);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    router.push("/account");
  };

  return (
    <div className="min-h-screen bg-black" style={{ paddingTop: SITE_HEADER_OFFSET_PX }}>
      <div className="mx-auto max-w-md px-6 py-16">
        <h1 className="editorial-heading mb-2 text-3xl text-ivory">Create Account</h1>
        <p className="mb-8 text-sm text-muted">Join IYLO Bakehouse</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-muted">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-ivory/20 bg-transparent px-4 py-3 text-ivory outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-muted">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-ivory/20 bg-transparent px-4 py-3 text-ivory outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-muted">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-ivory/20 bg-transparent px-4 py-3 text-ivory outline-none focus:border-gold"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating…" : "Create Account"}
          </Button>
          <p className="text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-gold hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
