"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { SidebarPanel } from "@/components/home/sidebar-panel";
import { cn } from "@/lib/utils";

export function OurAppPanel() {
  const [qrOpen, setQrOpen] = useState(true);

  return (
    <SidebarPanel title="Our App">
      <div className="px-4 pt-4 pb-3">
        <a
          href="https://play.google.com/store/apps"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-[var(--lp-play-btn-h)] w-full items-center justify-center gap-[17.78px] rounded-[var(--lp-play-btn-radius)] border-[length:var(--lp-panel-divider-thin)] border-hw-line bg-hw-play px-4 transition-opacity hover:opacity-90"
        >
          <Image
            src="/google-logo.svg"
            alt=""
            width={29}
            height={29}
            className="size-[28.45px] shrink-0 object-contain"
          />
          <div className="leading-tight">
            <p className="text-[12.45px] font-semibold text-hw-foreground/60">
              Get it on
            </p>
            <p className="text-[16px] font-semibold text-hw-foreground">
              Google Play
            </p>
          </div>
        </a>

        <button
          type="button"
          onClick={() => setQrOpen((v) => !v)}
          aria-expanded={qrOpen}
          className="mt-[14.23px] flex w-full items-center justify-center gap-[14.23px] text-[length:var(--lp-panel-label)] font-bold text-hw-foreground transition-colors hover:text-hw-green"
        >
          Scan QR Code
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrOpen ? "/arrow-up-lightmode.svg" : "/arrow-down-lightmode.svg"}
            alt=""
            width={12}
            height={7}
            className="dark:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/arow.svg"
            alt=""
            width={12}
            height={7}
            className={cn(
              "hidden transition-transform duration-200 dark:block",
              qrOpen && "rotate-180",
            )}
          />
        </button>

        <AnimatePresence initial={false}>
          {qrOpen && (
            <motion.div
              key="qr"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-[14.23px] flex flex-col items-center gap-[14.23px]">
                <div className="overflow-hidden rounded-[10.67px] bg-white p-[3.56px]">
                  <Image
                    src="/qr-code-logo.png"
                    alt="Scan to download on Google Play"
                    width={143}
                    height={143}
                    className="size-[var(--lp-qr-size)] object-contain"
                    loading="eager"
                    priority
                  />
                </div>
                <p className="text-center text-[12.45px] font-medium text-hw-foreground/60">
                  Google Play
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SidebarPanel>
  );
}
