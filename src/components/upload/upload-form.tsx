"use client";

import { useRef, useState } from "react";
import NextImage from "next/image";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import { ChevronDown, Plus, Upload, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
  "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

const CATEGORIES = [
  "Islamic",
  "Anime",
  "Superheroes",
  "Minimalist",
  "Gaming",
  "Movies",
  "Cars",
  "Sport",
  "Space",
];

const DONT_PUBLISH = [
  "Unclear or blurry photos",
  "Mature/adult content",
  "Gore or violent scenes",
  "Hateful or harmful content",
  "Others’ private information",
  "Non-original work",
];

const fieldBox =
  "w-full rounded-[7px] border border-hw-input-border bg-hw-input px-4 text-sm text-hw-foreground outline-none transition-colors focus:border-[#05DF8B] placeholder:text-hw-faint/50";

export function UploadForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [agree, setAgree] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (file.type !== "image/jpeg") {
      alert("JPG only.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Max file size is 10MB.");
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  const canSubmit = Boolean(preview && category && agree && captchaToken);

  return (
    <form
      className="flex flex-col gap-7"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      {submitted && (
        <p
          role="status"
          className="rounded-[7px] border border-[#4D853A]/50 bg-[#4D853A]/15 px-4 py-3 text-sm text-[#7ed957]"
        >
          Wallpaper submitted for review (demo).
        </p>
      )}

      {/* Dropzone */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg"
        className="sr-only"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group mx-auto flex aspect-[16/10] w-full max-w-lg flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border-[3px] border-dashed border-[#909098]/70 bg-hw-input p-6 text-center transition-colors hover:border-[#05DF8B]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#05DF8B]/40"
      >
        {preview ? (
          <>
            <NextImage
              src={preview}
              alt="Selected wallpaper preview"
              width={320}
              height={200}
              unoptimized
              className="max-h-[60%] w-auto rounded-lg object-contain"
            />
            <p className="max-w-full truncate text-sm text-hw-foreground">{fileName}</p>
            <p className="text-xs text-hw-muted">Click to choose a different image</p>
          </>
        ) : (
          <>
            <span className="grid size-[72px] place-items-center rounded-full bg-[#2F4577] transition-transform group-hover:scale-105">
              <Plus className="size-9 text-white" strokeWidth={2.5} />
            </span>
            <span className="text-lg font-medium text-hw-foreground">Choose Wallpaper</span>
            <span className="text-sm text-hw-muted">JPG only, up to 10MB</span>
          </>
        )}
      </button>

      {/* Don't publish notice */}
      <div className="rounded-[9px] border border-[#6C4C0B] bg-[#2F2805] px-6 py-5 text-[#C1A36F]">
        <h2 className="text-base font-semibold">Don&rsquo;t publish:</h2>
        <ol className="mt-4 space-y-2 text-sm">
          {DONT_PUBLISH.map((item, i) => (
            <li key={item}>
              {i + 1}. {item}
            </li>
          ))}
        </ol>
        <Link href="/content-policy" className="mt-4 inline-block text-sm underline">
          Read full Content Policy
        </Link>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-2">
        <label htmlFor="upload-category" className="text-sm font-semibold text-hw-foreground">
          Category <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <select
            id="upload-category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={cn(
              fieldBox,
              "h-12 appearance-none pr-11",
              category ? "text-hw-foreground" : "text-hw-faint/80"
            )}
          >
            <option value="" disabled>
              Select a category
            </option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-hw-input text-hw-foreground">
                {c}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-hw-faint" />
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-2">
        <label htmlFor="upload-tags" className="text-sm font-semibold text-hw-foreground">
          Tags
        </label>
        <input
          id="upload-tags"
          type="text"
          placeholder="Add tags to help discovery..."
          className={cn(fieldBox, "h-12")}
        />
      </div>

      {/* Source */}
      <div className="flex flex-col gap-2">
        <label htmlFor="upload-source" className="text-sm font-semibold text-hw-foreground">
          Source
        </label>
        <textarea
          id="upload-source"
          placeholder="Credit the original source..."
          rows={4}
          className={cn(fieldBox, "min-h-[120px] resize-y py-3 leading-relaxed")}
        />
      </div>

      {/* Terms checkbox */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          role="checkbox"
          aria-checked={agree}
          aria-label="I agree to the terms of use"
          onClick={() => setAgree((v) => !v)}
          className={cn(
            "grid size-[18px] shrink-0 place-items-center rounded-[4px] border-2 transition-colors",
            agree ? "border-[#05DF8B] bg-[#05DF8B]" : "border-hw-foreground bg-transparent"
          )}
        >
          {agree ? <Check className="size-3 text-black" strokeWidth={3} /> : null}
        </button>
        <p className="text-sm text-hw-foreground">
          I agree to the{" "}
          <Link href="/terms" className="text-[#69A6D5] underline">
            terms of use
          </Link>
        </p>
      </div>

      {/* reCAPTCHA */}
      <ReCAPTCHA
        sitekey={RECAPTCHA_SITE_KEY}
        theme="light"
        onChange={(token) => setCaptchaToken(token)}
        onExpired={() => setCaptchaToken(null)}
      />

      {/* Upload */}
      <div>
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[7px] bg-[#4D853A] px-5 text-sm font-semibold text-white transition-[filter,transform] hover:brightness-110 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
        >
          Upload Wallpaper
          <Upload className="size-4" />
        </button>
      </div>
    </form>
  );
}
