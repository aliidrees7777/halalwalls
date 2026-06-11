"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import type { Wallpaper } from "@/types/wallpaper";

type UploadItem = Wallpaper & { status?: "active" | "pending" | "hidden" };

/**
 * The signed-in user's own uploaded wallpapers (GET /me/uploads, all statuses).
 * Returns [] for guests. (Uploading itself is a later phase, so this is usually
 * empty for now.)
 */
export function useMyUploads() {
  const { isAuthenticated } = useAuth();
  const [wallpapers, setWallpapers] = useState<UploadItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setWallpapers([]);
      setLoading(false);
      return;
    }
    let ignore = false;
    setLoading(true);
    api
      .get<{ wallpapers: UploadItem[]; count: number }>("/me/uploads")
      .then((d) => {
        if (!ignore) setWallpapers(d.wallpapers);
      })
      .catch(() => {
        if (!ignore) setWallpapers([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [isAuthenticated]);

  return { wallpapers, loading };
}
