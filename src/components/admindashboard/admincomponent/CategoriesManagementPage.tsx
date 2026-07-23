"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LayoutGrid, CheckCircle, Image as ImageIcon, Download, Star } from "lucide-react";
import { api, API_BASE_URL, ApiError } from "@/lib/api";
import { invalidateCategoriesCache } from "@/hooks/use-catalog";
import { AdminListPage } from "../reusable/AdminListPage";
import { StatusBadge } from "../reusable/cells";
import {
  AdminModalCloseButton,
  AdminModalOverlay,
  adminModalPanelStyle,
} from "../reusable/AdminModal";
import type { ListPageConfig, StatCardDef } from "../reusable/types";

interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  isPremium: boolean;
  wallpaperCount: number;
  downloads: number;
  status: "active" | "inactive";
  createdAt: string;
}

interface CatStats {
  total: number;
  active: number;
  totalWallpapers: number;
  totalDownloads: number;
  mostPopular: { name: string; downloads: number } | null;
}

const ORIGIN = API_BASE_URL.replace(/\/api\/v\d+$/, "");
const imgSrc = (raw?: string | null) => {
  if (!raw) return "";
  if (/^(https?:|data:)/.test(raw)) return raw;
  return raw.startsWith("/") ? ORIGIN + raw : `${ORIGIN}/${raw}`;
};
const fmt = (n: number) => n.toLocaleString("en-US");
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const CategoriesManagementPage = () => {
  const [reloadTick, setReloadTick] = useState(0);
  const [stats, setStats] = useState<CatStats | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editRow, setEditRow] = useState<AdminCategory | null>(null);

  const reload = useCallback(() => {
    invalidateCategoriesCache();
    setReloadTick((t) => t + 1);
  }, []);

  useEffect(() => {
    let ignore = false;
    api.get<CatStats>("/admin/categories/stats").then((d) => {
      if (!ignore) setStats(d);
    }).catch(() => {});
    return () => { ignore = true; };
  }, [reloadTick]);

  const fetcher = useCallback(
    async ({ search, filters, sort, page, pageSize }: {
      search: string; filters: Record<string, string>; sort: string; page: number; pageSize: number | "all";
    }) => {
      const p = new URLSearchParams({ page: String(page), limit: String(pageSize) });
      if (search) p.set("q", search);
      if (sort) p.set("sort", sort);
      if (filters.status) p.set("status", filters.status);
      const d = await api.get<{ categories: AdminCategory[]; pagination: { total: number } }>(
        `/admin/categories?${p.toString()}`
      );
      return { rows: d.categories as unknown as Record<string, unknown>[], total: d.pagination.total };
    },
    []
  );

  const del = useCallback(async (row: Record<string, unknown>) => {
    const c = row as unknown as AdminCategory;
    if (!window.confirm(`Delete the "${c.name}" category? Wallpapers keep their category label.`)) return;
    try {
      await api.delete(`/categories/${c.slug}`);
      reload();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Delete failed");
    }
  }, [reload]);

  // Activate / deactivate — deactivated categories disappear from the nav + upload form.
  const toggleActive = useCallback(async (row: Record<string, unknown>) => {
    const c = row as unknown as AdminCategory;
    try {
      await api.patch(`/categories/${c.slug}`, { isActive: c.status !== "active" });
      reload();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Action failed");
    }
  }, [reload]);

  const cards: StatCardDef[] = useMemo(() => {
    const s = stats;
    const pct = s && s.total ? Math.round((s.active / s.total) * 1000) / 10 : 0;
    return [
      { label: "Total Categories", value: s ? fmt(s.total) : "—", sub: "taxonomy size", icon: <LayoutGrid size={18} /> },
      { label: "Active Categories", value: s ? fmt(s.active) : "—", sub: s ? `${pct}% of total` : "", icon: <CheckCircle size={18} />, accent: "#05df8b" },
      { label: "Total Wallpapers", value: s ? fmt(s.totalWallpapers) : "—", sub: "across all categories", icon: <ImageIcon size={18} /> },
      { label: "Total Downloads", value: s ? fmt(s.totalDownloads) : "—", sub: "across all categories", icon: <Download size={18} /> },
      { label: "Most Popular", value: s?.mostPopular?.name || "—", sub: s?.mostPopular ? `${fmt(s.mostPopular.downloads)} downloads` : "", icon: <Star size={18} />, accent: "#f59e0b" },
    ];
  }, [stats]);

  const config: ListPageConfig = useMemo(() => ({
    title: "Categories",
    breadcrumb: ["Dashboard", "Categories"],
    primaryAction: { label: "Add Category", onClick: () => setShowAdd(true) },
    stats: cards,
    showIndex: true,
    searchPlaceholder: "Search categories…",
    fetcher,
    rowId: (r) => String((r as unknown as AdminCategory).id),
    gridTitleKey: "name",
    gridImage: (r) => imgSrc((r as unknown as AdminCategory).image),
    filters: [
      {
        key: "status", placeholder: "All Status",
        options: [
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
        ],
      },
    ],
    sortOptions: [
      { label: "Newest", value: "latest" },
      { label: "Oldest", value: "oldest" },
      { label: "Most wallpapers", value: "wallpapers" },
      { label: "Most downloads", value: "downloads" },
      { label: "Name A–Z", value: "name" },
    ],
    columns: [
      {
        key: "category", header: "Category",
        cell: (r) => {
          const c = r as unknown as AdminCategory;
          const src = imgSrc(c.image);
          return (
            <div className="flex items-center gap-3">
              <div className="thumb">{src ? <img src={src} alt={c.name} /> : null}</div>
              <div>
                <div className="wtitle">{c.name}</div>
                <div className="wtags">/{c.slug}</div>
              </div>
            </div>
          );
        },
      },
      {
        key: "description", header: "Description",
        cell: (r) => (
          <span className="text-[var(--text2)]">
            {(r as unknown as AdminCategory).description || "—"}
          </span>
        ),
      },
      { key: "wallpapers", header: "Wallpapers", cell: (r) => <span className="restext">{fmt((r as unknown as AdminCategory).wallpaperCount)}</span> },
      { key: "downloads", header: "Downloads", cell: (r) => <span className="restext">{fmt((r as unknown as AdminCategory).downloads)}</span> },
      { key: "status", header: "Status", cell: (r) => <StatusBadge value={(r as unknown as AdminCategory).status === "active" ? "Active" : "Inactive"} /> },
      { key: "created", header: "Created", cell: (r) => <span className="ddate">{fmtDate((r as unknown as AdminCategory).createdAt)}</span> },
    ],
    actions: [
      {
        type: "toggle",
        title: "Activate / deactivate",
        isActive: (r) => (r as unknown as AdminCategory).status === "active",
        onClick: (r) => toggleActive(r),
      },
      { type: "edit", title: "Edit", onClick: (r) => setEditRow(r as unknown as AdminCategory) },
      { type: "delete", title: "Delete", onClick: del },
    ],
  }), [cards, fetcher, del, toggleActive]);

  return (
    <>
      <AdminListPage config={config} refreshKey={reloadTick} />
      {showAdd ? (
        <CategoryFormModal onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); reload(); }} />
      ) : null}
      {editRow ? (
        <CategoryFormModal initial={editRow} onClose={() => setEditRow(null)} onSaved={() => { setEditRow(null); reload(); }} />
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

function CategoryFormModal({
  initial, onClose, onSaved,
}: {
  initial?: AdminCategory;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!initial;
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [isPremium, setIsPremium] = useState(initial?.isPremium ?? false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    if (!name.trim()) { setError("Category name is required."); return; }
    setBusy(true);
    try {
      const body = { name: name.trim(), description: description.trim(), image: image.trim() || undefined, isPremium };
      if (isEdit) await api.patch(`/categories/${initial!.slug}`, body);
      else await api.post("/categories", body);
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save category.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminModalOverlay>
      <form onSubmit={submit} style={adminModalPanelStyle(440)}>
        <AdminModalCloseButton onClose={onClose} />
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{isEdit ? "Edit Category" : "Add Category"}</h2>
        <p style={{ fontSize: 12.5, color: "var(--text2)" }}>{isEdit ? "Update this category." : "Create a new wallpaper category."}</p>

        {error ? (
          <div style={{ marginTop: 12, background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.3)", color: "#f7a7a7", fontSize: 12.5, padding: "9px 12px", borderRadius: 9 }}>{error}</div>
        ) : null}

        <label style={label}>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Nature" style={inputStyle} />

        <label style={label}>Description</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" style={inputStyle} />

        <label style={label}>Cover image URL (optional)</label>
        <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://…" style={inputStyle} />

        <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, fontSize: 13, color: "var(--text)", cursor: "pointer" }}>
          <input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} />
          Premium category
        </label>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          <button type="button" onClick={onClose} style={{ padding: "9px 16px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", border, background: "var(--bg3)", color: "var(--text2)" }}>Cancel</button>
          <button type="submit" disabled={busy} style={{ padding: "9px 18px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: busy ? "default" : "pointer", border: "none", background: "var(--brand)", color: "#04120c", opacity: busy ? 0.7 : 1 }}>
            {busy ? "Saving…" : isEdit ? "Save changes" : "Create"}
          </button>
        </div>
      </form>
    </AdminModalOverlay>
  );
}

export default CategoriesManagementPage;
