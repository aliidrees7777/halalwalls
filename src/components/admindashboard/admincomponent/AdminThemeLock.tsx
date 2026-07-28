"use client";

import { useEffect } from "react";

/**
 * Keeps `html.dark` while admin is mounted so the panel never follows the
 * public site's light theme. Restores the prior class on leave without
 * changing the stored theme preference.
 */
export function AdminThemeLock() {
  useEffect(() => {
    const root = document.documentElement;
    const hadDark = root.classList.contains("dark");

    const ensureDark = () => {
      if (!root.classList.contains("dark")) root.classList.add("dark");
    };
    ensureDark();

    const observer = new MutationObserver(ensureDark);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
      if (!hadDark) root.classList.remove("dark");
    };
  }, []);

  return null;
}
