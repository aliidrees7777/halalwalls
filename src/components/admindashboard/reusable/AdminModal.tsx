"use client";

import { X } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

const border = "1px solid var(--border)";

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "grid",
  placeItems: "center",
  padding: 20,
  zIndex: 70,
};

const closeBtnStyle: CSSProperties = {
  position: "absolute",
  top: 14,
  right: 14,
  zIndex: 2,
  display: "grid",
  placeItems: "center",
  width: 32,
  height: 32,
  borderRadius: 8,
  border,
  background: "var(--bg3)",
  color: "var(--text2)",
  cursor: "pointer",
};

/** Backdrop that does NOT close on outside click. */
export function AdminModalOverlay({ children }: { children: ReactNode }) {
  return <div style={overlayStyle}>{children}</div>;
}

/** Top-right X — the only way to dismiss (besides Cancel / explicit actions). */
export function AdminModalCloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      style={closeBtnStyle}
    >
      <X size={16} strokeWidth={2.25} />
    </button>
  );
}

/** Shared panel styles; panels should be `position: relative` for the X button. */
export function adminModalPanelStyle(
  maxWidth: number,
  extra?: CSSProperties,
): CSSProperties {
  return {
    position: "relative",
    width: "100%",
    maxWidth,
    background: "var(--bg2)",
    border,
    borderRadius: 16,
    padding: 22,
    paddingRight: 48,
    boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
    ...extra,
  };
}
