"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { LIGHT, ALERT } from "@/lib/page-theme";

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  onBlur?: () => void;
}

export function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  autoComplete = "current-password",
  error,
  onBlur,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={cn(LIGHT.input, "pr-12", error && ALERT.errorBorder)}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-maroon/45 transition-colors hover:text-maroon"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && (
        <p className={ALERT.errorSm} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
