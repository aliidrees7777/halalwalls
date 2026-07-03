"use client";

import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import { ChevronDown, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import downloadrotate from "../../../public/detail-page/downloadrotate.svg"
// Only show the reCAPTCHA when a REAL site key is configured. Without one we
// don't render Google's "for testing purposes only" widget (and don't require it).
const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
  "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // Google test key until a real one is set

// Fallback shown only if the categories API can't be reached.
const FALLBACK_CATEGORIES = [
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
  "w-full rounded-[5px] border h-[16px] border-hw-input-border bg-hw-input px-4 text-[21px] text-hw-foreground outline-none transition-colors focus:border-[#05DF8B] placeholder:text-hw-faint/50";

export function UploadForm() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<string[]>(FALLBACK_CATEGORIES);
  const [tags, setTags] = useState("");
  const [source, setSource] = useState("");
  const [agree, setAgree] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Real, active categories from the API (admin-managed).
  useEffect(() => {
    let ignore = false;
    api
      .get<{ categories: { name: string }[] }>("/categories")
      .then((d) => {
        if (!ignore && d.categories?.length) setCategoryOptions(d.categories.map((c) => c.name));
      })
      .catch(() => {
        /* keep the fallback list */
      });
    return () => {
      ignore = true;
    };
  }, []);

  function handleFile(picked: File | undefined) {
    if (!picked) return;
    if (picked.type !== "image/jpeg") {
      alert("JPG only.");
      return;
    }
    if (picked.size > 10 * 1024 * 1024) {
      alert("Max file size is 10MB.");
      return;
    }
    setFile(picked);
    setFileName(picked.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setPreview(reader.result);
    };
    reader.readAsDataURL(picked);
  }

  const canSubmit = Boolean(file && category && agree && captchaToken);

  function resetForm() {
    setFile(null);
    setPreview(null);
    setFileName(null);
    setCategory("");
    setTags("");
    setSource("");
    setAgree(false);
    setCaptchaToken(null);
    recaptchaRef.current?.reset();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Submitting requires a signed-in user (the backend route is auth-guarded).
    if (!isAuthenticated) {
      openAuthModal("signin");
      return;
    }
    if (!canSubmit || !file) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("category", category);
      if (tags.trim()) formData.append("tags", tags.trim());
      if (source.trim()) formData.append("source", source.trim());

      await api.post("/uploads", formData);

      setSuccess(
        "Wallpaper submitted! It’s now pending review — you’ll find it under your profile uploads.",
      );
      resetForm();
    } catch (err) {
      // An expired/invalid session surfaces the sign-in modal.
      if (err instanceof ApiError && err.statusCode === 401) {
        openAuthModal("signin");
      }
      setError(
        err instanceof ApiError
          ? err.message
          : "Upload failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-7 " onSubmit={handleSubmit}>
      {success && (
        <p
          role="status"
          className="rounded-[7px] border border-[#4D853A]/50 bg-[#4D853A]/15 px-4 py-3 text-sm text-[#7ed957]"
        >
          {success}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-[7px] border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400"
        >
          {error}
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
        className="group mx-auto relative w-full lg:w-[733px] h-[412px] flex flex-col items-center justify-center gap-4 overflow-hidden rounded-4xl bg-hw-input p-6 text-center"
      >
        <svg
  className="absolute inset-0 h-full w-full pointer-events-none"
  preserveAspectRatio="none"
>
  <rect
    x="2"
    y="2"
    width="calc(100% - 4px)"
    height="calc(100% - 4px)"
    rx="24"
    fill="none"
    stroke="#909098"
    strokeWidth="3"
    strokeDasharray="18 10"
  />
</svg>
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
            <p className="max-w-full truncate text-sm text-hw-foreground">
              {fileName}
            </p>
            <p className="text-xs text-hw-muted">
              Click to choose a different image
            </p>
          </>
        ) : (
          <>
            <span className="grid size-[72px] place-items-center rounded-full bg-[#2F4577] transition-transform group-hover:scale-105">
              <Plus className="size-9 text-white" strokeWidth={2.5} />
            </span>
            <span className="text-2xl font-medium text-hw-depw">
              Choose Wallpaper
            </span>
            <span className="text-[21px] text-hw-depw">
              JPG only, up to 10MB
            </span>
          </>
        )}
      </button>

      {/* Don't publish notice */}
      <div className="flex flex-col justify-center lg:items-center">
        <div className="rounded-[9px]  lg:w-[1191px] border border-[#2F2805] bg-[#2F2805] px-6 py-5 text-[#C1A36F]">
          <h2 className="text-[28px] font-semibold text-[#C1A36F]">Don&rsquo;t publish:</h2>
          <ol className="mt-4 space-y-2 text-[21px] text-[#C1A36F] font-medium">
            {DONT_PUBLISH.map((item, i) => (
              <li key={item}>
                {i + 1}. {item}
              </li>
            ))}
          </ol>
          <Link
            href="/content-policy"
            className="mt-4 inline-block text-[21px] underline"
          >
            Read full Content Policy
          </Link>
        </div>
      </div>
      {/* Category */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="upload-category"
          className="text-[21px] font-semibold text-hw-depw"
        >
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
              category ? "text-hw-foreground" : "text-hw-faint/80",
            )}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categoryOptions.map((c) => (
              <option
                key={c}
                value={c}
                className="bg-hw-input text-hw-foreground"
              >
                {c}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-hw-faint" />
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="upload-tags"
          className="text-[21px] font-semibold text-hw-depw"
        >
          Tags<span className="text-red-400">*</span>
        </label>
        <input
          id="upload-tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Add tags to help discovery (comma-separated)..."
          className={cn(fieldBox, "h-12")}
        />
      </div>

      {/* Source */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="upload-source"
          className="text-[21px] font-semibold text-hw-depw"
        >
          Source<span className="text-red-400">*</span>
        </label>
        <textarea
          id="upload-source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Credit the original source..."
          rows={4}
          className={cn(
            fieldBox,
            "min-h-[120px] resize-y py-3 leading-relaxed",
          )}
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
          className="grid size-5 shrink-0 place-items-center rounded-[5px] transition-colors"
          style={{
            borderWidth: 2,
            borderStyle: "solid",
            borderColor: agree ? "#05DF8B" : "#8b9096",
            backgroundColor: agree ? "rgba(5,223,139,0.15)" : "rgba(255,255,255,0.05)",
          }}
        >
          {agree ? (
            <Check className="size-3.5 text-[#05DF8B]" strokeWidth={3.5} />
          ) : null}
        </button>
        <p className="text-sm text-hw-depw">
          I agree to the{" "}
          <Link href="/terms" className="text-[#69A6D5] underline">
            terms of use
          </Link>
        </p>
      </div>

      {/* reCAPTCHA */}
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={RECAPTCHA_SITE_KEY}
        theme="light"
        onChange={(token) => setCaptchaToken(token)}
        onExpired={() => setCaptchaToken(null)}
      />

      {/* Upload */}
      <div>
        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[5px] bg-[#4D853A] px-5 text-[17px] font-semibold text-white transition-[filter,transform] hover:brightness-110 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Uploading…" : "Upload Wallpaper"}
          <Image src={downloadrotate} alt="" className="text-white"/>
        </button>
      </div>
    </form>
  );
}
