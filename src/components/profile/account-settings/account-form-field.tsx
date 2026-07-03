"use client";

import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";
import pencil from "../../../../public/my-account/pencil.svg"
interface AccountFormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type?: "text" | "email";
  error?: string;
  multiline?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export function AccountFormField({
  id,
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  error,
  multiline = false,
  placeholder,
  disabled = false,
}: AccountFormFieldProps) {
  const invalid = Boolean(error);

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-[14px] font-medium text-hw-depw sm:text-xs"
      >
        {label}
      </label>
      <div className="relative">
        {multiline ? (
          <textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            rows={2}
            aria-invalid={invalid}
            className={cn(
              "h-11 w-full resize-none rounded-[6px] border bg-hw-input px-3 py-2.5 pr-10 text-sm text-hw-foreground transition-colors outline-none placeholder:text-hw-muted/60",
              "focus-visible:border-hw-green/60 focus-visible:ring-2 focus-visible:ring-hw-green/20",
              invalid
                ? "border-red-500/80 ring-2 ring-red-500/15"
                : "border-hw-faint/40 hover:border-hw-faint/60"
            )}
          />
        ) : (
          <Input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={invalid}
            className={cn(
              "h-11 rounded-[6px] border bg-hw-input px-3 pr-10 text-sm text-hw-foreground shadow-none",
              "focus-visible:border-hw-green/60 focus-visible:ring-2 focus-visible:ring-hw-green/20",
              disabled && "cursor-not-allowed opacity-60",
              invalid
                ? "border-red-500/80 ring-2 ring-red-500/15"
                : "border-hw-faint/40 hover:border-hw-faint/60"
            )}
          />
        )}
        {!disabled ? (
          <Image src={pencil} alt="pencil" className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-hw-foreground/50"
            aria-hidden/>
         
        ) : null}
      </div>
      {error ? (
        <p
          role="alert"
          className="text-[11px] text-red-400 transition-opacity duration-200"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
