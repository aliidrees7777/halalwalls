"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { DownloadActions } from "@/components/download/download-actions";
import { DownloadResolutionPanel } from "@/components/download/download-resolution-panel";
import {
  findAvailableResolution,
  firstAvailableMobileResolution,
  normalizeResKey,
} from "@/lib/download-resolution";
import type { DownloadResolution, WallpaperDetail } from "@/types/wallpaper";
import { resolveMediaUrl, shouldUnoptimizeMedia } from "@/lib/media-url";
import { isHttpUrl, parseSourceUrl } from "@/lib/source-url";
import download from "../../../public/download.svg";
import link from "../../../public/link.svg";

interface DownloadMainProps {
  wallpaper: WallpaperDetail;
}

export function DownloadMain({ wallpaper }: DownloadMainProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loaded, setLoaded] = useState(false);
  const imageSrc = resolveMediaUrl(wallpaper.image);

  const urlResolution = searchParams.get("resolution");
  const browseMatch = useMemo(
    () => findAvailableResolution(wallpaper, urlResolution),
    [wallpaper, urlResolution],
  );
  const mobileDefault = useMemo(
    () => firstAvailableMobileResolution(wallpaper),
    [wallpaper],
  );

  // Mobile viewport only: prefer a mobile size when the source can serve one.
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const apply = () => setIsMobileViewport(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Highlight browse choice when valid; otherwise mobile size on phones, else preferred.
  const selectedResolution =
    browseMatch?.label.replace(/×/g, "x") ??
    (isMobileViewport && mobileDefault
      ? normalizeResKey(mobileDefault.label)
      : wallpaper.preferredResolution
        ? normalizeResKey(wallpaper.preferredResolution)
        : null);

  const sourceParsed = parseSourceUrl(wallpaper.description);
  const sourceUrl =
    sourceParsed.url && isHttpUrl(sourceParsed.url) ? sourceParsed.url : null;
  const sourceLabel =
    sourceParsed.username ||
    (wallpaper.author && wallpaper.author !== "HalalWalls"
      ? wallpaper.author
      : null) ||
    (sourceUrl
      ? (() => {
          try {
            return new URL(sourceUrl).hostname.replace(/^www\./i, "");
          } catch {
            return "Source";
          }
        })()
      : null);

  const setResolutionQuery = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("resolution", normalizeResKey(key));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Resolution chips only select — download happens via the main button.
  const handleResolutionSelect = (res: DownloadResolution) => {
    setResolutionQuery(res.label);
  };

  return (
    <div className="min-w-0 flex-1 xl:max-w-[921px]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto h-[829.78px] w-[373.5px] max-w-full overflow-hidden rounded-[12px] border border-hw-line bg-hw-deep lg:mx-0 lg:h-auto lg:w-full lg:rounded-[7px]"
      >
        <motion.div
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.35 }}
          className="relative h-full w-full lg:aspect-[16/9] lg:h-auto"
        >
          <Image
            src={imageSrc}
            alt={wallpaper.title}
            fill
            priority
            unoptimized={shouldUnoptimizeMedia(imageSrc)}
            className={`object-cover transition-opacity duration-500 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            sizes="(max-width: 1024px) 100vw, 720px"
            onLoad={() => setLoaded(true)}
          />
          {!loaded && (
            <div className="absolute inset-0 animate-pulse bg-hw-surface" />
          )}
        </motion.div>
      </motion.div>
      <div className="mt-4 flex items-start gap-3">
        <Badge
          variant="outline"
          className="h-[26px] w-auto shrink-0 gap-2 rounded-full border-hw-line bg-hw-down px-3 text-[15px] font-semibold text-[#ffffff]"
        >
          <Image src={download} alt="download" />
          {(wallpaper.downloadCount ?? 0).toLocaleString()}
        </Badge>
        <div className="flex min-w-0 flex-1 flex-wrap items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Purchase-lightmode.svg"
            alt=""
            className="mr-2 shrink-0 dark:hidden"
          />
          <Image
            src={link}
            alt=""
            className="mr-2 hidden shrink-0 dark:inline"
          />
          {wallpaper.tags.map((tag, index) => (
            <span key={`${tag}-${index}`} className="inline-flex items-center">
              <Link
                href={`/?tag=${encodeURIComponent(tag)}`}
                className="text-[19px] font-medium text-hw-foreground underline decoration-hw-foreground/50 underline-offset-2 transition-colors hover:text-hw-green hover:decoration-hw-green/50"
              >
                {tag}
              </Link>
              {index < wallpaper.tags.length - 1 ? (
                <span className="mr-1 text-[19px] font-medium text-hw-foreground">
                  ,
                </span>
              ) : null}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-3 text-[17px] leading-relaxed text-hw-muted lg:ml-21">
        — Published on {wallpaper.publishedAt} | Original Resolution:{" "}
        <span className="underline decoration-hw-foreground/50 underline-offset-2">
          {wallpaper.originalResolution}
        </span>{" "}
        |{" "}
        {sourceUrl && sourceLabel ? (
          <>
            Source:{" "}
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-hw-foreground underline decoration-hw-foreground/50 underline-offset-2 transition-colors hover:text-hw-green hover:decoration-hw-green/50"
            >
              {sourceLabel}
            </a>
          </>
        ) : (
          <>Author: {wallpaper.author}</>
        )}
      </p>

      <div className="mt-5">
        <DownloadActions
          wallpaper={wallpaper}
          selectedResolution={selectedResolution}
          onSelectedResolutionChange={setResolutionQuery}
        />
      </div>

      <div className="mt-5">
        <DownloadResolutionPanel
          wallpaper={wallpaper}
          selectedResolution={selectedResolution}
          onSelect={handleResolutionSelect}
        />
      </div>
    </div>
  );
}
