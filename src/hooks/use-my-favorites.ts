"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import type { Wallpaper } from "@/types/wallpaper";

/**
 * Fetches the signed-in user's favorited wallpapers from the live backend
 * (GET /me/favorites). Returns an empty list for guests. Refetches whenever
 * the authentication state changes, and guards against stale responses.
 */
export function useMyFavorites(): { wallpapers: Wallpaper[]; loading: boolean } {
  const { isAuthenticated } = useAuth();
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setWallpapers([]);
      setLoading(false);
      return;
    }

    let ignore = false;
    setLoading(true);

    (async () => {
      try {
        const data = await api.get<{ wallpapers: Wallpaper[]; count: number }>(
          "/me/favorites"
        );
        if (!ignore) setWallpapers(data.wallpapers);
      } catch {
        if (!ignore) setWallpapers([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [isAuthenticated]);

  return { wallpapers, loading };
}
