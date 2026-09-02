"use client";

import { useState } from "react";
import Image from "next/image";
import ReCAPTCHA from "react-google-recaptcha";
import { cn } from "@/lib/utils";
import { AddAuthorWallpaperPreview } from "@/components/add-author/add-author-wallpaper-preview";
import sendIcon from "../../../public/Send-icon.svg";

const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
  "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

const DETAILS_MAX = 1000;

/** Static UI — Figma "Ad An Author" (1939:13954). Submit/API wired later. */
const fieldLabel =
  "text-base font-semibold leading-snug text-black dark:text-white lg:text-[21.333px] lg:leading-[35.556px]";

const fieldBox =
  "w-full rounded-[5.333px] border border-hw-input-border bg-hw-input px-4 text-base text-hw-foreground outline-none transition-colors placeholder:text-[#B2ACA2]/50 focus:border-[#05DF8B] lg:h-[53.333px] lg:border-[1.067px] lg:px-[17.778px] lg:text-[21.333px] lg:leading-[35.556px]";

export function AddAuthorForm() {
  const [authorName, setAuthorName] = useState("");
  const [authorLink, setAuthorLink] = useState("");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-8 lg:gap-11">
      {/* Thanks banner — Figma #2F2805 / #6C4C0B / #C1A36F */}
      <div className="rounded-[7.111px] border border-[#D4A574] bg-[#FFF4D6] px-6 py-6 dark:border-[#6C4C0B] dark:bg-[#2F2805] lg:px-6 lg:py-[30px]">
        <p className="text-base font-medium leading-relaxed text-[#8B6914] dark:text-[#C1A36F] lg:text-[21.333px] lg:leading-[35.556px]">
          Thanks for your assistance in{" "}
          <span className="font-bold">
            identifying the Author of this wallpaper
          </span>
          !
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-9">
        {/* Form — left on desktop, below preview on mobile */}
        <form
          className="order-2 flex min-w-0 flex-1 flex-col gap-8 lg:order-1 lg:max-w-[880px] lg:gap-8"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Author Name */}
          <div className="flex flex-col gap-3.5 lg:gap-[14.222px]">
            <label htmlFor="add-author-name" className={fieldLabel}>
              Author Name <span className="text-[#C26664]">*</span>
            </label>
            <input
              id="add-author-name"
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Author Name"
              className={cn(fieldBox, "h-12 lg:h-[53.333px]")}
            />
          </div>

          {/* Author Link */}
          <div className="flex flex-col gap-3.5 lg:gap-[14.222px]">
            <label htmlFor="add-author-link" className={fieldLabel}>
              Author Link <span className="text-[#C26664]">*</span>
            </label>
            <input
              id="add-author-link"
              type="url"
              value={authorLink}
              onChange={(e) => setAuthorLink(e.target.value)}
              placeholder="Author Link (ex: https://example.com)"
              className={cn(fieldBox, "h-12 lg:h-[53.333px]")}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-3.5 lg:gap-[14.222px]">
            <label htmlFor="add-author-email" className={fieldLabel}>
              Email Address
            </label>
            <input
              id="add-author-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address (Optional)"
              className={cn(fieldBox, "h-12 lg:h-[53.333px]")}
            />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-3.5 lg:gap-[14.222px]">
            <label htmlFor="add-author-details" className={fieldLabel}>
              Details
            </label>
            <div className="relative">
              <textarea
                id="add-author-details"
                value={details}
                onChange={(e) =>
                  setDetails(e.target.value.slice(0, DETAILS_MAX))
                }
                placeholder="Details (max 1000 characters) (Optional)"
                rows={5}
                className={cn(
                  fieldBox,
                  "min-h-[120px] resize-y py-4 lg:min-h-[142.222px] lg:py-[17.778px]",
                )}
              />
            </div>
            <p className="self-end text-sm leading-none text-[#9D9488] lg:text-base lg:leading-[35.556px]">
              {details.length} / {DETAILS_MAX}
            </p>
          </div>

          {/* reCAPTCHA + Submit */}
          <div className="flex w-full max-w-[378.666px] flex-col gap-5 lg:gap-[19.556px]">
            <div className="overflow-hidden rounded-[5.333px]">
              <ReCAPTCHA
                sitekey={RECAPTCHA_SITE_KEY}
                theme="light"
                onChange={(token) => setCaptchaToken(token)}
                onExpired={() => setCaptchaToken(null)}
              />
            </div>

            <button
              type="button"
              disabled={!captchaToken}
              className="inline-flex h-11 w-fit items-center justify-center gap-0.5 rounded-[5.333px] bg-[#4D853A] px-[26px] text-base font-semibold text-white transition-[filter,transform] hover:brightness-110 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 lg:h-[42.667px] lg:text-[17.778px] lg:leading-[35.556px]"
            >
              Submit
              <span className="ml-0.5 flex size-[25.071px] items-center justify-center">
                <Image
                  src={sendIcon}
                  alt=""
                  width={18}
                  height={18}
                  className="rotate-45"
                  aria-hidden
                />
              </span>
            </button>
          </div>
        </form>

        {/* Wallpaper preview — top on mobile, right on desktop */}
        <AddAuthorWallpaperPreview
          className="order-1 lg:order-2"
          title="Spiderman: Across the spider verse"
          imageSrc="/spiderman-miles-lost-in-space-4k-0f-2550x1435.jpg"
          href="#"
        />
      </div>
    </div>
  );
}
