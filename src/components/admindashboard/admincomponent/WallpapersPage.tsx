"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Image as ImageIcon,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Upload,
} from "lucide-react";
import { api, API_BASE_URL, ApiError, getToken } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import {
  effectivePermissions,
  hasPermission,
} from "@/lib/admin-permissions";
import { bustWallpaperPageCache } from "@/lib/bust-wallpaper-cache";
import { resolveMediaUrl } from "@/lib/media-url";
import { parseSourceUrl } from "@/lib/source-url";
import { AdminListPage } from "../reusable/AdminListPage";
import { AdminThumb } from "../reusable/AdminThumb";
import { StatusBadge } from "../reusable/cells";
import {
  AdminModalCloseButton,
  AdminModalOverlay,
  adminModalPanelStyle,
} from "../reusable/AdminModal";
import type { ListPageConfig, StatCardDef } from "../reusable/types";

interface AdminWallpaper {
  id: string;
  title: string;
  slug: string;
  description?: string;
  tags: string[];
  image: string | null;
  thumbnailUrl: string | null;
  mobileImage?: string | null;
  mobileResolution?: string;
  mobileWidth?: number | null;
  mobileHeight?: number | null;
  resolution: string;
  category: string | null;
  categorySlug: string | null;
  categories?: string[];
  categorySlugs?: string[];
  author: string;
  isPremium?: boolean;
  status: "active" | "pending" | "hidden";
  downloadCount: number;
  createdAt: string;
  uploadedBy: { id: string; name: string; email: string } | null;
}

interface WpStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  downloads: number;
  thisMonth: { total: number; approved: number; pending: number; rejected: number; downloads: number };
  filters: {
    categories: { label: string; value: string }[];
    resolutions: { label: string; value: string }[];
  };
}

/** Use same-origin `/uploads/…` (Next rewrite → backend), not raw API host. */
const imgSrc = (raw?: string | null) => resolveMediaUrl(raw);
const CAT_CLASS: Record<string, string> = {
  nature: "cat-n", sport: "cat-n", space: "cat-i", islamic: "cat-i",
  movies: "cat-m", minimalist: "cat-m", gaming: "cat-g", anime: "cat-g",
  cars: "cat-c", superheroes: "cat-c",
};
const STATUS_LABEL: Record<string, string> = { active: "Approved", pending: "Pending", hidden: "Rejected" };
const fmt = (n: number) => n.toLocaleString("en-US");
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const WallpapersPage = () => {
  const { user } = useAuth();
  const permissions = effectivePermissions(user);
  const canModerate = hasPermission(permissions, "wallpapers.moderate");
  const canDelete = hasPermission(permissions, "wallpapers.delete");
  const canEdit = hasPermission(permissions, "wallpapers.edit");
  const canUpload = hasPermission(permissions, "wallpapers.upload");
  const canExport = hasPermission(permissions, "dashboard.export");

  const [reloadTick, setReloadTick] = useState(0);
  const [stats, setStats] = useState<WpStats | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editRow, setEditRow] = useState<AdminWallpaper | null>(null);

  const reload = useCallback(() => setReloadTick((t) => t + 1), []);

  // Stats + filter options (refreshed after mutations).
  useEffect(() => {
    let ignore = false;
    api.get<WpStats>("/admin/wallpapers/stats").then((d) => {
      if (!ignore) setStats(d);
    }).catch((e) => {
      if (!ignore) {
        console.error("Failed to load wallpaper stats:", e);
        setStats(null);
      }
    });
    return () => { ignore = true; };
  }, [reloadTick]);

  // Stable server fetcher.
  const fetcher = useCallback(
    async ({ search, filters, sort, page, pageSize }: {
      search: string; filters: Record<string, string>; sort: string; page: number; pageSize: number | "all";
    }) => {
      const p = new URLSearchParams({ page: String(page), limit: String(pageSize) });
      if (search) p.set("q", search);
      if (sort) p.set("sort", sort);
      if (filters.category) p.set("category", filters.category);
      if (filters.resolution) p.set("resolution", filters.resolution);
      if (filters.status) p.set("status", filters.status);
      const d = await api.get<{ wallpapers: AdminWallpaper[]; pagination: { total: number } }>(
        `/admin/wallpapers?${p.toString()}`
      );
      return { rows: d.wallpapers as unknown as Record<string, unknown>[], total: d.pagination.total };
    },
    []
  );

  const del = useCallback(async (row: Record<string, unknown>) => {
    if (!canDelete) {
      alert("Your role cannot delete wallpapers.");
      return;
    }
    const w = row as unknown as AdminWallpaper;
    if (!window.confirm(`Delete "${w.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/wallpapers/${w.id}`);
      void bustWallpaperPageCache(w.slug);
      reload();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Delete failed");
    }
  }, [reload, canDelete]);

  // Approve (→ live on the site) or reject (→ hidden) straight from the table.
  const moderate = useCallback(async (row: Record<string, unknown>, action: "approve" | "reject") => {
    if (!canModerate) {
      alert("Your role cannot approve or reject wallpapers.");
      return;
    }
    const w = row as unknown as AdminWallpaper;
    try {
      await api.patch(`/admin/wallpapers/${w.id}/${action}`);
      void bustWallpaperPageCache(w.slug);
      reload();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Action failed");
    }
  }, [reload, canModerate]);

  const exportCsv = useCallback(async () => {
    if (!canExport) {
      alert("Your role cannot export data.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/admin/wallpapers/export`, {
        headers: { Authorization: `Bearer ${getToken() ?? ""}` },
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "wallpapers.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Export failed. Please try again.");
    }
  }, [canExport]);

  const cards: StatCardDef[] = useMemo(() => {
    const s = stats;
    const m = s?.thisMonth;
    return [
      { label: "Total Wallpapers", value: s ? fmt(s.total) : "—", sub: m ? `+${fmt(m.total)} this month` : "", icon: <ImageIcon size={18} /> },
      { label: "Approved", value: s ? fmt(s.approved) : "—", sub: m ? `+${fmt(m.approved)} this month` : "", icon: <CheckCircle size={18} />, accent: "#05df8b" },
      { label: "Pending Review", value: s ? fmt(s.pending) : "—", sub: m ? `+${fmt(m.pending)} this month` : "", icon: <Clock size={18} />, accent: "#f59e0b" },
      { label: "Rejected", value: s ? fmt(s.rejected) : "—", sub: m ? `+${fmt(m.rejected)} this month` : "", icon: <XCircle size={18} />, accent: "#ef4444" },
      { label: "Total Downloads", value: s ? fmt(s.downloads) : "—", sub: m ? `+${fmt(m.downloads)} this month` : "", icon: <Download size={18} /> },
    ];
  }, [stats]);

  const config: ListPageConfig = useMemo(() => ({
    title: "Wallpapers",
    breadcrumb: ["Dashboard", "Wallpapers"],
    primaryAction: canUpload
      ? { label: "Add Wallpaper", onClick: () => setShowAdd(true) }
      : undefined,
    secondaryAction: canExport
      ? { label: "Export", icon: <Download size={15} />, onClick: exportCsv }
      : undefined,
    stats: cards,
    searchPlaceholder: "Search wallpapers by title, uploader, tag…",
    fetcher,
    rowId: (r) => String((r as unknown as AdminWallpaper).id),
    gridTitleKey: "title",
    gridImage: (r) => imgSrc((r as unknown as AdminWallpaper).thumbnailUrl || (r as unknown as AdminWallpaper).image),
    filters: [
      { key: "category", placeholder: "All Categories", options: stats?.filters.categories ?? [] },
      { key: "resolution", placeholder: "All Resolutions", options: stats?.filters.resolutions ?? [] },
      {
        key: "status", placeholder: "All Status",
        options: [
          { label: "Approved", value: "active" },
          { label: "Pending", value: "pending" },
          { label: "Rejected", value: "hidden" },
        ],
      },
    ],
    sortOptions: [
      { label: "Newest", value: "latest" },
      { label: "Oldest", value: "oldest" },
      { label: "Most downloaded", value: "popular" },
      { label: "Most viewed", value: "views" },
      { label: "Title A–Z", value: "title" },
    ],
    columns: [
      {
        key: "preview", header: "Preview",
        cell: (r) => {
          const w = r as unknown as AdminWallpaper;
          const src = imgSrc(w.thumbnailUrl || w.image);
          return <AdminThumb src={src || null} alt={w.title} />;
        },
      },
      {
        key: "title", header: "Title",
        cell: (r) => {
          const w = r as unknown as AdminWallpaper;
          return (
            <>
              <div className="wtitle">{w.title}</div>
              <div className="wtags">{(w.tags || []).slice(0, 3).map((t) => `#${t}`).join(" ")}</div>
            </>
          );
        },
      },
      {
        key: "uploader", header: "Uploader",
        cell: (r) => {
          const w = r as unknown as AdminWallpaper;
          return (
            <>
              <div className="uname">{w.uploadedBy?.name || w.author || "HalalWalls"}</div>
              <div className="uemail">{w.uploadedBy?.email || "—"}</div>
            </>
          );
        },
      },
      {
        key: "category", header: "Category",
        cell: (r) => {
          const w = r as unknown as AdminWallpaper;
          const labels =
            w.categories?.length
              ? w.categories
              : w.category
                ? [w.category]
                : [];
          if (!labels.length) return <span className="restext">—</span>;
          return (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {labels.map((name, i) => {
                const slug = w.categorySlugs?.[i] || w.categorySlug || "";
                const cls = slug ? CAT_CLASS[slug] || "cat-n" : "cat-n";
                return (
                  <span key={`${slug}-${name}`} className={`catb ${cls}`}>
                    {name}
                  </span>
                );
              })}
            </div>
          );
        },
      },
      {
        key: "resolution", header: "Resolution",
        cell: (r) => <span className="restext">{String((r as unknown as AdminWallpaper).resolution || "—").replace("x", "×")}</span>,
      },
      {
        key: "downloads", header: "Downloads",
        cell: (r) => <span className="restext">{fmt((r as unknown as AdminWallpaper).downloadCount || 0)}</span>,
      },
      {
        key: "status", header: "Status",
        cell: (r) => <StatusBadge value={STATUS_LABEL[(r as unknown as AdminWallpaper).status] || "Pending"} />,
      },
      {
        key: "uploaded", header: "Uploaded",
        cell: (r) => <span className="ddate">{fmtDate((r as unknown as AdminWallpaper).createdAt)}</span>,
      },
    ],
    actions: [
      ...(canModerate
        ? [
            {
              type: "approve" as const,
              title: "Approve (publish)",
              visible: (r: Record<string, unknown>) =>
                (r as unknown as AdminWallpaper).status !== "active",
              onClick: (r: Record<string, unknown>) => moderate(r, "approve"),
            },
            {
              type: "reject" as const,
              title: "Reject / hide",
              visible: (r: Record<string, unknown>) =>
                (r as unknown as AdminWallpaper).status !== "hidden",
              onClick: (r: Record<string, unknown>) => moderate(r, "reject"),
            },
          ]
        : []),
      { type: "view", title: "Open on site", onClick: (r) => window.open(`/wallpaper/${(r as unknown as AdminWallpaper).slug}`, "_blank") },
      ...(canEdit
        ? [{ type: "edit" as const, title: "Edit", onClick: (r: Record<string, unknown>) => setEditRow(r as unknown as AdminWallpaper) }]
        : []),
      ...(canDelete
        ? [{ type: "delete" as const, title: "Delete", onClick: del }]
        : []),
    ],
  }), [cards, fetcher, del, moderate, exportCsv, stats, canModerate, canDelete, canEdit, canUpload, canExport]);

  return (
    <>
      <AdminListPage config={config} refreshKey={reloadTick} />
      {showAdd ? (
        <WallpaperFormModal
          categories={stats?.filters.categories ?? []}
          onClose={() => setShowAdd(false)}
          onSaved={() => { setShowAdd(false); reload(); }}
        />
      ) : null}
      {editRow ? (
        <WallpaperFormModal
          initial={editRow}
          categories={stats?.filters.categories ?? []}
          onClose={() => setEditRow(null)}
          onSaved={() => { setEditRow(null); reload(); }}
        />
      ) : null}
    </>
  );
};

const DEFAULT_SOURCE = "https://halalwalls.com";
const DESKTOP_MIN = { width: 1920, height: 1080 };
const MOBILE_MIN = { width: 1080, height: 2400 };
const border = "1px solid rgba(255,255,255,0.08)";
const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--bg3)", border: "1px solid var(--border2)",
  borderRadius: 8, color: "var(--text)", fontSize: 13, padding: "9px 12px", outline: "none",
};
const label: React.CSSProperties = { display: "block", fontSize: 12, color: "var(--text2)", margin: "12px 0 6px" };

function readImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image dimensions."));
    };
    img.src = url;
  });
}

function WallpaperFormModal({
  initial, categories, onClose, onSaved,
}: {
  initial?: AdminWallpaper;
  categories: { label: string; value: string }[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!initial;
  const [title, setTitle] = useState(initial?.title ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [mobileImage, setMobileImage] = useState(initial?.mobileImage ?? "");
  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(() => {
    if (initial?.categorySlugs?.length) return [...initial.categorySlugs];
    if (initial?.categorySlug) return [initial.categorySlug];
    return categories[0]?.value ? [categories[0].value] : [];
  });
  const [detectedDesktopRes, setDetectedDesktopRes] = useState<string | null>(
    initial?.resolution ? String(initial.resolution).replace("x", "×") : null,
  );
  const [detectedMobileRes, setDetectedMobileRes] = useState<string | null>(
    initial?.mobileResolution
      ? String(initial.mobileResolution).replace("x", "×")
      : initial?.mobileWidth && initial?.mobileHeight
        ? `${initial.mobileWidth}×${initial.mobileHeight}`
        : null,
  );
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [source, setSource] = useState(initial?.description?.trim() || DEFAULT_SOURCE);
  const [isPremium, setIsPremium] = useState(initial?.isPremium ?? false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleCategory = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const onDesktopFileChange = async (f: File | null) => {
    setDesktopFile(f);
    setDetectedDesktopRes(null);
    if (!f) return;
    try {
      const dims = await readImageDimensions(f);
      if (dims.width < DESKTOP_MIN.width || dims.height < DESKTOP_MIN.height) {
        setError(
          `Desktop image must be at least ${DESKTOP_MIN.width}×${DESKTOP_MIN.height}.`,
        );
        setDesktopFile(null);
        return;
      }
      setError(null);
      setDetectedDesktopRes(`${dims.width}×${dims.height}`);
    } catch {
      setError("Could not read desktop image dimensions.");
      setDesktopFile(null);
    }
  };

  const onMobileFileChange = async (f: File | null) => {
    setMobileFile(f);
    setDetectedMobileRes(null);
    if (!f) return;
    try {
      const dims = await readImageDimensions(f);
      if (dims.width < MOBILE_MIN.width || dims.height < MOBILE_MIN.height) {
        setError(
          `Mobile image must be at least ${MOBILE_MIN.width}×${MOBILE_MIN.height}.`,
        );
        setMobileFile(null);
        return;
      }
      setError(null);
      setDetectedMobileRes(`${dims.width}×${dims.height}`);
    } catch {
      setError("Could not read mobile image dimensions.");
      setMobileFile(null);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    if (!selectedSlugs.length) {
      setError("Select at least one category.");
      return;
    }
    const selectedCats = categories.filter((c) => selectedSlugs.includes(c.value));
    const categorySlugs = selectedCats.map((c) => c.value);
    const categoryLabels = selectedCats.map((c) => c.label);
    const sourceValue = source.trim() || DEFAULT_SOURCE;

    // Edit → patch metadata; optionally replace the image file (old files deleted server-side).
    if (isEdit) {
      if (!title.trim()) {
        setError("Title is required.");
        return;
      }
      setBusy(true);
      try {
        if (desktopFile) {
          const fd = new FormData();
          fd.append("image", desktopFile);
          await api.post(`/admin/wallpapers/${initial!.id}/image`, fd);
        }
        if (mobileFile) {
          const fd = new FormData();
          fd.append("image", mobileFile);
          await api.post(`/admin/wallpapers/${initial!.id}/image?target=mobile`, fd);
        }
        await api.patch(`/admin/wallpapers/${initial!.id}`, {
          title: title.trim(),
          category: categoryLabels[0],
          categorySlug: categorySlugs[0],
          categories: categoryLabels,
          categorySlugs,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          description: sourceValue,
          author: parseSourceUrl(sourceValue).username || initial!.author || "HalalWalls",
          isPremium,
        });
        void bustWallpaperPageCache(initial!.slug);
        onSaved();
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Could not save wallpaper.");
      } finally {
        setBusy(false);
      }
      return;
    }

    // Add → upload the actual image file through the Sharp pipeline. Because the
    // uploader is an admin, it publishes immediately (active, no approval).
    // Resolution + download options come from the image itself (no manual field).
    if (!desktopFile) {
      setError("Please choose a desktop image file to upload.");
      return;
    }
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("image", desktopFile);
      if (mobileFile) fd.append("mobileImage", mobileFile);
      fd.append("title", title.trim());
      if (categoryLabels[0]) fd.append("category", categoryLabels[0]);
      if (categorySlugs[0]) fd.append("categorySlug", categorySlugs[0]);
      fd.append("categories", categoryLabels.join(","));
      fd.append("categorySlugs", categorySlugs.join(","));
      const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
      if (tagList.length) fd.append("tags", tagList.join(","));
      fd.append("source", sourceValue);
      const username = parseSourceUrl(sourceValue).username;
      if (username) fd.append("author", username);
      fd.append("isPremium", String(isPremium));
      await api.post("/uploads", fd);
      // New publish — bust catalog tag (slug may not be known client-side yet).
      void bustWallpaperPageCache();
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not upload wallpaper.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminModalOverlay>
      <form
        onSubmit={submit}
        style={adminModalPanelStyle(520)}
      >
        <AdminModalCloseButton onClose={onClose} />
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
          {isEdit ? "Edit Wallpaper" : "Add Wallpaper"}
        </h2>
        <p style={{ fontSize: 12.5, color: "var(--text2)" }}>
          {isEdit
            ? "Update this wallpaper's details."
            : "Upload desktop (required) and mobile (optional) images. Download sizes are detected automatically — no upscaling."}
        </p>

        {error ? (
          <div style={{ marginTop: 12, background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.3)", color: "#f7a7a7", fontSize: 12.5, padding: "9px 12px", borderRadius: 9 }}>
            {error}
          </div>
        ) : null}

        <label style={label}>Title <span style={{ color: "#ef4444" }}>*</span></label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Sunset in Tokyo"
          required
          style={inputStyle}
        />

        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <label style={label}>
              Categories <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div
              style={{
                ...inputStyle,
                display: "flex",
                flexDirection: "column",
                gap: 6,
                maxHeight: 200,
                overflowY: "auto",
                padding: "10px 12px",
              }}
            >
              {categories.length === 0 ? (
                <span style={{ color: "var(--text3)", fontSize: 12 }}>No categories available</span>
              ) : (
                categories.map((c) => {
                  const checked = selectedSlugs.includes(c.value);
                  return (
                    <label
                      key={c.value}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 13,
                        color: "var(--text)",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCategory(c.value)}
                      />
                      {c.label}
                    </label>
                  );
                })
              )}
            </div>
            <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>
              Select one or more. The first category in the list that is checked is primary.
            </p>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {isEdit ? (
              <>
                <label style={label}>Replace desktop image (optional)</label>
                {image ? (
                  <div
                    style={{
                      marginBottom: 8,
                      borderRadius: 8,
                      overflow: "hidden",
                      border,
                      background: "var(--bg3)",
                      aspectRatio: "16 / 9",
                      maxHeight: 120,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgSrc(image) || image}
                      alt="Current desktop wallpaper"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                ) : null}
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) => void onDesktopFileChange(e.target.files?.[0] ?? null)}
                  style={inputStyle}
                />
                <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>
                  {desktopFile
                    ? `New desktop file: ${desktopFile.name}`
                    : "Leave empty to keep the current desktop image."}
                </p>

                <label style={{ ...label, marginTop: 16 }}>Replace mobile image (optional)</label>
                {mobileImage ? (
                  <div
                    style={{
                      marginBottom: 8,
                      borderRadius: 8,
                      overflow: "hidden",
                      border,
                      background: "var(--bg3)",
                      aspectRatio: "9 / 16",
                      maxHeight: 120,
                      maxWidth: 68,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgSrc(mobileImage) || mobileImage}
                      alt="Current mobile wallpaper"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                ) : null}
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) => void onMobileFileChange(e.target.files?.[0] ?? null)}
                  style={inputStyle}
                />
                <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>
                  {mobileFile
                    ? `New mobile file: ${mobileFile.name}`
                    : "Leave empty to keep the current mobile image."}
                </p>
              </>
            ) : (
              <>
                <label style={label}>
                  Desktop image <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) => void onDesktopFileChange(e.target.files?.[0] ?? null)}
                  style={inputStyle}
                />
                {desktopFile ? (
                  <p style={{ fontSize: 12, color: "var(--text2)", marginTop: 4 }}>{desktopFile.name}</p>
                ) : null}

                <label style={{ ...label, marginTop: 16 }}>Mobile image (optional)</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) => void onMobileFileChange(e.target.files?.[0] ?? null)}
                  style={inputStyle}
                />
                {mobileFile ? (
                  <p style={{ fontSize: 12, color: "var(--text2)", marginTop: 4 }}>{mobileFile.name}</p>
                ) : null}
                <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>
                  Min desktop 1920×1080; min mobile 1080×2400 when provided.
                </p>
              </>
            )}

            <label style={label}>Desktop resolution</label>
            <div
              style={{
                ...inputStyle,
                display: "flex",
                alignItems: "center",
                minHeight: 40,
                color: detectedDesktopRes ? "var(--text)" : "var(--text3)",
                cursor: "default",
              }}
            >
              {detectedDesktopRes || (isEdit ? "—" : "Detected from desktop image")}
            </div>

            <label style={label}>Mobile resolution</label>
            <div
              style={{
                ...inputStyle,
                display: "flex",
                alignItems: "center",
                minHeight: 40,
                color: detectedMobileRes ? "var(--text)" : "var(--text3)",
                cursor: "default",
              }}
            >
              {detectedMobileRes || (isEdit ? "—" : "Detected from mobile image")}
            </div>
          </div>
        </div>

        <label style={label}>Tags (comma-separated)</label>
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="city, sunset" style={inputStyle} />

        <label style={label}>Source</label>
        <input
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder={DEFAULT_SOURCE}
          style={inputStyle}
        />

        <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, fontSize: 13, color: "var(--text)", cursor: "pointer" }}>
          <input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} />
          Premium wallpaper
        </label>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          <button type="button" onClick={onClose} style={{ padding: "9px 16px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", border, background: "var(--bg3)", color: "var(--text2)" }}>
            Cancel
          </button>
          <button type="submit" disabled={busy} style={{ padding: "9px 18px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: busy ? "default" : "pointer", border: "none", background: "var(--brand)", color: "#04120c", opacity: busy ? 0.7 : 1, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Upload size={14} /> {busy ? "Saving…" : isEdit ? "Save changes" : "Publish"}
          </button>
        </div>
      </form>
    </AdminModalOverlay>
  );
};

export default WallpapersPage;
