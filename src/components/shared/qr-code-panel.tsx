"use client";

import Image from "next/image";
import { ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function QrCodePanel() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-4 flex w-full items-center justify-center gap-1 text-[12px] text-hw-muted transition-colors hover:text-hw-foreground"
      >
        Scan QR Code
        <ChevronUp
          className={cn(
            "size-3.5 transition-transform duration-300",
            !open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 flex flex-col items-center pb-1">
              <div className="overflow-hidden rounded-lg bg-white p-2">
                <Image
                  src="/qr-code-logo.png"
                  alt="Scan to download on Google Play"
                  width={160}
                  height={160}
                  className="size-[140px] object-contain"
                />
              </div>
              <p className="mt-2 text-center text-[11px] text-hw-muted">
                Google Play
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
