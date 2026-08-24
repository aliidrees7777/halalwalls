import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { API_BASE_URL } from "@/lib/api";
import {
  WALLPAPERS_CACHE_TAG,
  wallpaperCacheTag,
} from "@/lib/wallpaper-data";

type Body = {
  /** When set, bust that wallpaper’s detail cache + path. */
  slug?: string;
};

/**
 * On-demand ISR bust for wallpaper pages.
 * Auth: Bearer JWT must belong to an admin (verified via backend /me).
 */
export async function POST(request: Request) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let me: { role?: string } | null = null;
  try {
    const res = await fetch(`${API_BASE_URL}/me`, {
      headers: { Authorization: auth },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const json = (await res.json()) as {
      data?: { user?: { role?: string } };
      user?: { role?: string };
    };
    me = json.data?.user ?? json.user ?? null;
  } catch {
    return NextResponse.json({ error: "Auth check failed" }, { status: 502 });
  }

  if (me?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: Body = {};
  try {
    body = (await request.json()) as Body;
  } catch {
    body = {};
  }

  const slug = typeof body.slug === "string" ? body.slug.trim() : "";

  // Catalog-wide tag (related carousels, etc.).
  revalidateTag(WALLPAPERS_CACHE_TAG, "max");

  if (slug) {
    revalidateTag(wallpaperCacheTag(slug), "max");
    revalidatePath(`/wallpaper/${slug}`);
  }

  return NextResponse.json({
    revalidated: true,
    slug: slug || null,
    now: Date.now(),
  });
}
