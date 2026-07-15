"use client";

import { SignUpForm } from "@/components/auth/signup-form";
import { BrandLogo } from "@/components/ui/brand-logo";
import { SITE_HEADER_OFFSET_PX } from "@/lib/brand";
import { LIGHT } from "@/lib/page-theme";
import { cn } from "@/lib/utils";

export default function SignUpPage() {
  return (
    <div className={LIGHT.bg} style={{ paddingTop: SITE_HEADER_OFFSET_PX }}>
      <div className="mx-auto max-w-md px-6 py-16">
        <div className="mb-8 flex justify-center">
          <BrandLogo variant="circle" height={96} priority />
        </div>
        <h1 className={cn(LIGHT.title, "mb-2 text-center text-3xl")}>Create Account</h1>
        <p className={cn("mb-8 text-center", LIGHT.subtitle)}>New to IYLO Bake House? Join us today.</p>
        <SignUpForm />
      </div>
    </div>
  );
}
