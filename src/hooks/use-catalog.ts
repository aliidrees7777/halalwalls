// "use client";

// import { useEffect, useState } from "react";
// import { api } from "@/lib/api"; // API import commented out

// export interface ApiCategory {
//   id: string;
//   name: string;
//   slug: string;
//   description: string;
//   image: string | null;
//   isPremium: boolean;
//   order: number;
//   count: number;
// }

// // Static Data Array
// const STATIC_CATEGORIES: ApiCategory[] = [
//   { id: "1", name: "Nature", slug: "nature", description: "Beautiful landscapes", image: null, isPremium: false, order: 1, count: 120 },
//   { id: "2", name: "Abstract", slug: "abstract", description: "Modern art", image: null, isPremium: false, order: 2, count: 85 },
//   { id: "3", name: "Cars", slug: "cars", description: "Supercars wallpapers", image: null, isPremium: false, order: 3, count: 200 },
// ];

// export interface ResolutionSet {
//   desktop: string[];
//   mobile: string[];
// }

// export interface TagItem {
//   tag: string;
//   count: number;
// }

// // ── module-level caches ──
// let _catsCache: ApiCategory[] | null = STATIC_CATEGORIES; // Set to static data by default
// let _catsPromise: Promise<ApiCategory[]> | null = null;
// let _resCache: ResolutionSet | null = null;
// let _resPromise: Promise<ResolutionSet> | null = null;
// let _tagsCache: TagItem[] | null = null;
// let _tagsPromise: Promise<TagItem[]> | null = null;

// const FALLBACK_RES: ResolutionSet = {
//   desktop: ["1920×1080", "2560×1440", "3840×2160"],
//   mobile: ["1080×2400", "1290×2796", "1320×2868"],
// };

// export function useCategories() {
//   const [categories, setCategories] = useState<ApiCategory[]>(_catsCache ?? []);
//   const [loading, setLoading] = useState(false); // Set to false since data is local

//   /* // API Call Commented Out
//   useEffect(() => {
//     if (_catsCache) return;
//     if (!_catsPromise) {
//       _catsPromise = api
//         .get<{ categories: ApiCategory[] }>("/categories")
//         .then((d) => {
//           _catsCache = d.categories;
//           return d.categories;
//         })
//         .catch(() => []);
//     }
//     let active = true;
//     _catsPromise.then((c) => {
//       if (active) {
//         setCategories(c);
//         setLoading(false);
//       }
//     });
//     return () => {
//       active = false;
//     };
//   }, []);
//   */

//   return { categories, loading };
// }

// // ... baaki ka code resolutions aur tags ke liye waise hi rahega ya aap unhe bhi comment kar sakte hain




"use client";

import { useState } from "react";

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

// 1. Static Categories Data
// Updated Static Categories based on your Browse Modes
const STATIC_CATEGORIES: ApiCategory[] = [
  { id: "1", name: "Islamic", slug: "islamic", description: "Islamic wallpapers", image: null, isPremium: false, order: 1, count: 50 },
  { id: "2", name: "Anime", slug: "anime", description: "Anime wallpapers", image: null, isPremium: false, order: 2, count: 150 },
  { id: "3", name: "Premium Walls", slug: "premium", description: "Premium collection", image: null, isPremium: true, order: 3, count: 100 },
  { id: "4", name: "Superheroes", slug: "superheroes", description: "Superheroes wallpapers", image: null, isPremium: false, order: 4, count: 120 },
  { id: "5", name: "Minimalist", slug: "minimalist", description: "Minimalist wallpapers", image: null, isPremium: false, order: 5, count: 90 },
  { id: "6", name: "Gaming", slug: "gaming", description: "Gaming wallpapers", image: null, isPremium: false, order: 6, count: 300 },
  { id: "7", name: "Movies", slug: "movies", description: "Movies wallpapers", image: null, isPremium: false, order: 7, count: 110 },
  { id: "8", name: "Live Walls", slug: "live", description: "Live wallpapers", image: null, isPremium: false, order: 8, count: 40 },
  { id: "9", name: "Cars", slug: "cars", description: "Cars wallpapers", image: null, isPremium: false, order: 9, count: 200 },
  { id: "10", name: "Sport", slug: "sport", description: "Sport wallpapers", image: null, isPremium: false, order: 10, count: 95 },
];

// 2. Static Resolutions Data
const FALLBACK_RES: ResolutionSet = {
  desktop: ["1920×1080", "2560×1440", "3840×2160"],
  mobile: ["1080×2400", "1290×2796", "1320×2868"],
};

// 3. Static Tags Data
const STATIC_TAGS: TagItem[] = [
  { tag: "4k", count: 300 },
  { tag: "dark", count: 250 },
  { tag: "amoled", count: 150 },
];

export function useCategories() {
  const [categories] = useState<ApiCategory[]>(STATIC_CATEGORIES);
  const loading = false;
  return { categories, loading };
}

export function useResolutions() {
  const [resolutions] = useState<ResolutionSet>(FALLBACK_RES);
  return resolutions;
}

export function useTags() {
  const [tags] = useState<TagItem[]>(STATIC_TAGS);
  return tags;
}