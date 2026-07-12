"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/auth/password-input";
import {
  validateEmail,
  validateFullName,
  validateIndianPhone,
  validatePassword,
} from "@/lib/validation";
import { cn } from "@/lib/utils";

type FieldErrors = {
  fullName?: string;
  mobile?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const inputClass = (hasError?: boolean) =>
  cn(
    "w-full border bg-transparent px-4 py-3 text-ivory outline-none focus:border-gold",
    hasError ? "border-red-400/70" : "border-ivory/20"
  );

export function SignUpForm() {
  const { signUp } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateFields = (): {
    valid: boolean;
    errors: FieldErrors;
    normalized: {
      fullName: string;
      mobile: string;
      email: string;
      password: string;
    };
  } => {
    const errors: FieldErrors = {};

    const normalizedName = validateFullName(fullName);
    if (!normalizedName) {
      errors.fullName = "Enter your full name (letters only, at least 2 characters).";
    }

    const normalizedMobile = validateIndianPhone(mobile);
    if (!normalizedMobile) {
      errors.mobile = "Enter a valid 10-digit Indian mobile number.";
    }

    const normalizedEmail = validateEmail(email);
    if (!normalizedEmail) {
      errors.email = "Enter a valid email address.";
    }

    const normalizedPassword = validatePassword(password);
    if (!normalizedPassword) {
      errors.password = "Password must be at least 8 characters with letters and numbers.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
      normalized: {
        fullName: normalizedName!,
        mobile: normalizedMobile!,
        email: normalizedEmail!,
        password: normalizedPassword!,
      },
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const { valid, errors, normalized } = validateFields();
    setFieldErrors(errors);
    if (!valid) return;

    setLoading(true);
    const { error: err } = await signUp(
      normalized.email,
      normalized.password,
      normalized.fullName,
      normalized.mobile
    );
    setLoading(false);

    if (err) {
      setFormError(err);
      return;
    }

    setSuccessMessage(
      "Account created. Please check your email to verify your account before signing in."
    );
    setTimeout(() => router.push("/auth/signin"), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {formError && <p className="text-sm text-red-400">{formError}</p>}
      {successMessage && <p className="text-sm text-gold">{successMessage}</p>}

      <div>
        <label htmlFor="fullName" className="mb-2 block text-xs uppercase tracking-widest text-muted">
          Full Name <span className="text-gold">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          required
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (fieldErrors.fullName) setFieldErrors((prev) => ({ ...prev, fullName: undefined }));
          }}
          onBlur={() => {
            if (fullName && !validateFullName(fullName)) {
              setFieldErrors((prev) => ({
                ...prev,
                fullName: "Enter your full name (letters only, at least 2 characters).",
              }));
            }
          }}
          autoComplete="name"
          className={inputClass(!!fieldErrors.fullName)}
        />
        {fieldErrors.fullName && (
          <p className="mt-1.5 text-xs text-red-400">{fieldErrors.fullName}</p>
        )}
      </div>

      <div>
        <label htmlFor="mobile" className="mb-2 block text-xs uppercase tracking-widest text-muted">
          Mobile Number <span className="text-gold">*</span>
        </label>
        <input
          id="mobile"
          type="tel"
          required
          inputMode="numeric"
          value={mobile}
          onChange={(e) => {
            setMobile(e.target.value.replace(/[^\d+\s-]/g, ""));
            if (fieldErrors.mobile) setFieldErrors((prev) => ({ ...prev, mobile: undefined }));
          }}
          onBlur={() => {
            if (mobile && !validateIndianPhone(mobile)) {
              setFieldErrors((prev) => ({
                ...prev,
                mobile: "Enter a valid 10-digit Indian mobile number.",
              }));
            }
          }}
          placeholder="10-digit mobile number"
          autoComplete="tel"
          className={inputClass(!!fieldErrors.mobile)}
        />
        {fieldErrors.mobile && (
          <p className="mt-1.5 text-xs text-red-400">{fieldErrors.mobile}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-widest text-muted">
          Email <span className="text-gold">*</span>
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
          }}
          onBlur={() => {
            if (email && !validateEmail(email)) {
              setFieldErrors((prev) => ({
                ...prev,
                email: "Enter a valid email address.",
              }));
            }
          }}
          autoComplete="email"
          className={inputClass(!!fieldErrors.email)}
        />
        {fieldErrors.email && (
          <p className="mt-1.5 text-xs text-red-400">{fieldErrors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-xs uppercase tracking-widest text-muted">
          Password <span className="text-gold">*</span>
        </label>
        <PasswordInput
          id="password"
          value={password}
          onChange={(value) => {
            setPassword(value);
            if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
          }}
          onBlur={() => {
            if (password && !validatePassword(password)) {
              setFieldErrors((prev) => ({
                ...prev,
                password: "Password must be at least 8 characters with letters and numbers.",
              }));
            }
          }}
          autoComplete="new-password"
          error={fieldErrors.password}
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-xs uppercase tracking-widest text-muted"
        >
          Confirm Password <span className="text-gold">*</span>
        </label>
        <PasswordInput
          id="confirmPassword"
          value={confirmPassword}
          onChange={(value) => {
            setConfirmPassword(value);
            if (fieldErrors.confirmPassword) {
              setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }
          }}
          onBlur={() => {
            if (confirmPassword && password !== confirmPassword) {
              setFieldErrors((prev) => ({
                ...prev,
                confirmPassword: "Passwords do not match.",
              }));
            }
          }}
          autoComplete="new-password"
          error={fieldErrors.confirmPassword}
        />
      </div>

      <Button type="submit" disabled={loading || !!successMessage} className="w-full">
        {loading ? "Creating…" : "Create Account"}
      </Button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/auth/signin" className="text-gold hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
