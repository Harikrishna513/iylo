"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/auth/password-input";
import { SITE_HEADER_OFFSET_PX } from "@/lib/brand";

function SignInForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    router.push(redirect);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="text-sm text-red-400">{error}</p>}
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
        <label htmlFor="password" className="mb-2 block text-xs uppercase tracking-widest text-muted">
          Password
        </label>
        <PasswordInput
          id="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Signing in…" : "Sign In"}
      </Button>
      <p className="text-center text-sm text-muted">
        New to IYLO Bake House?{" "}
        <Link href="/auth/signup" className="text-gold hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-black" style={{ paddingTop: SITE_HEADER_OFFSET_PX }}>
      <div className="mx-auto max-w-md px-6 py-16">
        <h1 className="editorial-heading mb-2 text-3xl text-ivory">Sign In</h1>
        <p className="mb-8 text-sm text-muted">Welcome back to IYLO Bakehouse</p>
        <Suspense>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
