"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (opts: { message: string; type?: ToastType }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextToastId = 0;

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
} as const;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback(
    ({ message, type = "info" }: { message: string; type?: ToastType }) => {
      const id = ++nextToastId;
      setToasts((current) => [...current, { id, message, type }]);
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== id));
      }, 4500);
    },
    [],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-5 right-5 z-[10000] flex w-[min(100vw-2.5rem,360px)] flex-col gap-2"
      >
        <AnimatePresence>
          {toasts.map((item) => {
            const Icon = ICONS[item.type];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 80 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={cn(
                  "flex items-start gap-3 rounded-xl border px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-sm",
                  item.type === "success" &&
                    "border-[#05DF8B]/40 bg-hw-card/95 text-hw-depw",
                  item.type === "error" &&
                    "border-red-500/40 bg-hw-card/95 text-red-300",
                  item.type === "info" &&
                    "border-hw-input-border bg-hw-card/95 text-hw-depw",
                )}
              >
                <Icon
                  className={cn(
                    "mt-0.5 size-5 shrink-0",
                    item.type === "success" && "text-[#05DF8B]",
                    item.type === "error" && "text-red-400",
                    item.type === "info" && "text-[#69A6D5]",
                  )}
                />
                <p className="text-sm font-semibold leading-snug">{item.message}</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within <ToastProvider>");
  }
  return ctx;
}
