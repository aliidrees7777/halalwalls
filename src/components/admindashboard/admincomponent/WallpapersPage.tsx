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
import { AdminListPage } from "../reusable/AdminListPage";
import { StatusBadge } from "../reusable/cells";
import type { ListPageConfig, StatCardDef } from "../reusable/types";

interface AdminWallpaper {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  image: string | null;
  thumbnailUrl: string | null;
  resolution: string;
  category: string | null;
  categorySlug: string | null;
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

const ORIGIN = API_BASE_URL.replace(/\/api\/v\d+$/, "");
const imgSrc = (raw?: string | null) => {
  if (!raw) return "";
  if (/^(https?:|data:)/.test(raw)) return raw;
  return raw.startsWith("/") ? ORIGIN + raw : `${ORIGIN}/${raw}`;
};
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
    }).catch(() => {});
    return () => { ignore = true; };
  }, [reloadTick]);

  // Stable server fetcher.
  const fetcher = useCallback(
    async ({ search, filters, sort, page, pageSize }: {
      search: string; filters: Record<string, string>; sort: string; page: number; pageSize: number;
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
    const w = row as unknown as AdminWallpaper;
    if (!window.confirm(`Delete "${w.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/wallpapers/${w.id}`);
      reload();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Delete failed");
    }
  }, [reload]);

  // Approve (→ live on the site) or reject (→ hidden) straight from the table.
  const moderate = useCallback(async (row: Record<string, unknown>, action: "approve" | "reject") => {
    const w = row as unknown as AdminWallpaper;
    try {
      await api.patch(`/admin/wallpapers/${w.id}/${action}`);
      reload();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Action failed");
    }
  }, [reload]);

  const exportCsv = useCallback(async () => {
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
  }, []);

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
    primaryAction: { label: "Add Wallpaper", onClick: () => setShowAdd(true) },
    secondaryAction: { label: "Export", icon: <Download size={15} />, onClick: exportCsv },
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
          return <div className="thumb">{src ? <img src={src} alt={w.title} /> : null}</div>;
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
          const cls = w.categorySlug ? CAT_CLASS[w.categorySlug] || "cat-n" : "cat-n";
          return <span className={`catb ${cls}`}>{w.category || "—"}</span>;
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
      {
        type: "approve",
        title: "Approve (publish)",
        visible: (r) => (r as unknown as AdminWallpaper).status !== "active",
        onClick: (r) => moderate(r, "approve"),
      },
      {
        type: "reject",
        title: "Reject / hide",
        visible: (r) => (r as unknown as AdminWallpaper).status !== "hidden",
        onClick: (r) => moderate(r, "reject"),
      },
      { type: "view", title: "Open on site", onClick: (r) => window.open(`/wallpaper/${(r as unknown as AdminWallpaper).slug}`, "_blank") },
      { type: "edit", title: "Edit", onClick: (r) => setEditRow(r as unknown as AdminWallpaper) },
      { type: "delete", title: "Delete", onClick: del },
    ],
  }), [cards, fetcher, del, moderate, exportCsv, stats]);

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

const border = "1px solid rgba(255,255,255,0.08)";
const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--bg3)", border: "1px solid var(--border2)",
  borderRadius: 8, color: "var(--text)", fontSize: 13, padding: "9px 12px", outline: "none",
};
const label: React.CSSProperties = { display: "block", fontSize: 12, color: "var(--text2)", margin: "12px 0 6px" };

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
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState(initial?.categorySlug ?? categories[0]?.value ?? "");
  const [resolution, setResolution] = useState(initial?.resolution ?? "1920x1080");
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [isPremium, setIsPremium] = useState(initial?.isPremium ?? false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    const cat = categories.find((c) => c.value === category);

    // Edit → patch metadata (image stays a URL).
    if (isEdit) {
      if (!title.trim() || !image.trim()) {
        setError("Title and image URL are required.");
        return;
      }
      setBusy(true);
      try {
        await api.patch(`/admin/wallpapers/${initial!.id}`, {
          title: title.trim(),
          image: image.trim(),
          category: cat?.label,
          categorySlug: cat?.value,
          resolution: resolution.trim(),
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          isPremium,
        });
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
    if (!file) {
      setError("Please choose an image file to upload.");
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      if (title.trim()) fd.append("title", title.trim());
      if (cat?.label) fd.append("category", cat.label);
      if (cat?.value) fd.append("categorySlug", cat.value);
      const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
      if (tagList.length) fd.append("tags", tagList.join(","));
      fd.append("isPremium", String(isPremium));
      await api.post("/uploads", fd);
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not upload wallpaper.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "grid", placeItems: "center", padding: 20, zIndex: 70 }}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        style={{ width: "100%", maxWidth: 460, background: "var(--bg2)", border, borderRadius: 16, padding: 22, boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
          {isEdit ? "Edit Wallpaper" : "Add Wallpaper"}
        </h2>
        <p style={{ fontSize: 12.5, color: "var(--text2)" }}>
          {isEdit ? "Update this wallpaper's details." : "Upload an image file — it publishes immediately (no approval)."}
        </p>

        {error ? (
          <div style={{ marginTop: 12, background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.3)", color: "#f7a7a7", fontSize: 12.5, padding: "9px 12px", borderRadius: 9 }}>
            {error}
          </div>
        ) : null}

        <label style={label}>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Sunset in Tokyo" style={inputStyle} />

        {isEdit ? (
          <>
            <label style={label}>Image URL</label>
            <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://…" style={inputStyle} />
          </>
        ) : (
          <>
            <label style={label}>Image file</label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              style={inputStyle}
            />
            {file ? (
              <p style={{ fontSize: 12, color: "var(--text2)", marginTop: 4 }}>{file.name}</p>
            ) : null}
          </>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label style={label}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...inputStyle, appearance: "auto" }}>
              {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={label}>Resolution</label>
            <input value={resolution} onChange={(e) => setResolution(e.target.value)} placeholder="1920x1080" style={inputStyle} />
          </div>
        </div>

        <label style={label}>Tags (comma-separated)</label>
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="city, sunset" style={inputStyle} />

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
    </div>
  );
};

export default WallpapersPage;
