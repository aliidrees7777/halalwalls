"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  isPremium: boolean;
  order: number;
  count: number;
}

export interface ResolutionSet {
  desktop: string[];
  mobile: string[];
}

export interface TagItem {
  tag: string;
  count: number;
}

// ── module-level caches so multiple consumers fetch once ──
let _catsCache: ApiCategory[] | null = null;
let _catsPromise: Promise<ApiCategory[]> | null = null;
let _resCache: ResolutionSet | null = null;
let _resPromise: Promise<ResolutionSet> | null = null;
let _tagsCache: TagItem[] | null = null;
let _tagsPromise: Promise<TagItem[]> | null = null;

const FALLBACK_RES: ResolutionSet = {
  desktop: ["1920×1080", "2560×1440", "3840×2160"],
  mobile: ["1080×2400", "1290×2796", "1320×2868"],
};

/** Live categories (with active-wallpaper counts) from GET /categories. */
export function useCategories() {
  const [categories, setCategories] = useState<ApiCategory[]>(_catsCache ?? []);
  const [loading, setLoading] = useState(!_catsCache);

  useEffect(() => {
    if (_catsCache) return;
    if (!_catsPromise) {
      _catsPromise = api
        .get<{ categories: ApiCategory[] }>("/categories")
        .then((d) => {
          _catsCache = d.categories;
          return d.categories;
        })
        .catch(() => []);
    }
    let active = true;
    _catsPromise.then((c) => {
      if (active) {
        setCategories(c);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return { categories, loading };
}

/** Fixed browse-by-resolution set from GET /resolutions (falls back to the known set). */
export function useResolutions() {
  const [resolutions, setResolutions] = useState<ResolutionSet>(_resCache ?? FALLBACK_RES);

  useEffect(() => {
    if (_resCache) return;
    if (!_resPromise) {
      _resPromise = api
        .get<ResolutionSet>("/resolutions")
        .then((d) => {
          _resCache = d;
          return d;
        })
        .catch(() => FALLBACK_RES);
    }
    let active = true;
    _resPromise.then((r) => {
      if (active) setResolutions(r);
    });
    return () => {
      active = false;
    };
  }, []);

  return resolutions;
}

/** Popular tags (assigned to wallpapers at upload) from GET /wallpapers/tags. */
export function useTags() {
  const [tags, setTags] = useState<TagItem[]>(_tagsCache ?? []);

  useEffect(() => {
    if (_tagsCache) return;
    if (!_tagsPromise) {
      _tagsPromise = api
        .get<{ tags: TagItem[] }>("/wallpapers/tags")
        .then((d) => {
          _tagsCache = d.tags;
          return d.tags;
        })
        .catch(() => []);
    }
    let active = true;
    _tagsPromise.then((t) => {
      if (active) setTags(t);
    });
    return () => {
      active = false;
    };
  }, []);

  return tags;
}
