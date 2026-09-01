"use client";

import { useEffect } from "react";

let lockCount = 0;
let savedScrollY = 0;
let savedBodyStyles: {
  overflow: string;
  position: string;
  top: string;
  width: string;
} | null = null;

/** Prevent background page scroll while overlays (e.g. mobile menu) are open. */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    if (lockCount === 0) {
      savedScrollY = window.scrollY;
      const { style } = document.body;
      savedBodyStyles = {
        overflow: style.overflow,
        position: style.position,
        top: style.top,
        width: style.width,
      };

      style.overflow = "hidden";
      style.position = "fixed";
      style.top = `-${savedScrollY}px`;
      style.width = "100%";
    }

    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount > 0 || !savedBodyStyles) return;

      const { style } = document.body;
      style.overflow = savedBodyStyles.overflow;
      style.position = savedBodyStyles.position;
      style.top = savedBodyStyles.top;
      style.width = savedBodyStyles.width;
      savedBodyStyles = null;
      window.scrollTo(0, savedScrollY);
    };
  }, [locked]);
}
