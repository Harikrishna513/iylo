"use client";

import { SignUpForm } from "@/components/auth/signup-form";
import { SITE_HEADER_OFFSET_PX } from "@/lib/brand";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-black" style={{ paddingTop: SITE_HEADER_OFFSET_PX }}>
      <div className="mx-auto max-w-md px-6 py-16">
        <h1 className="editorial-heading mb-2 text-3xl text-ivory">Create Account</h1>
        <p className="mb-8 text-sm text-muted">New to IYLO Bake House? Join us today.</p>
        <SignUpForm />
      </div>
    </div>
  );
}
