"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";

/**
 * Per-wallpaper favorite state: reflects the signed-in user's favorites,
 * keeps an optimistic local count, and toggles via the backend. Guests are
 * routed to the auth modal by the context's toggleFavorite.
 */
export function useFavorite(wallpaperId: string, initialCount = 0) {
  const { isFavorited, toggleFavorite } = useAuth();
  const isFavorite = isFavorited(wallpaperId);
  const [count, setCount] = useState(initialCount);
  const [pending, setPending] = useState(false);

  // Keep count in sync if the source data changes (e.g. list refetch).
  useEffect(() => setCount(initialCount), [initialCount]);

  const toggle = async () => {
    if (pending) return;
    setPending(true);
    // optimistic count nudge (reverted by the server value or on error)
    const optimistic = isFavorite ? count - 1 : count + 1;
    setCount(Math.max(0, optimistic));
    try {
      const res = await toggleFavorite(wallpaperId);
      if (res) setCount(res.favoritesCount);
      else setCount(initialCount); // guest → modal opened, no change
    } catch {
      setCount(initialCount); // revert
    } finally {
      setPending(false);
    }
  };

  return { isFavorite, count, toggle, pending };
}
