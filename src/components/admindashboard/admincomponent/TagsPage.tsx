"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Tag as TagIcon, CheckCircle, Image as ImageIcon, Download, TrendingUp } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { AdminListPage } from "../reusable/AdminListPage";
import { StatusBadge } from "../reusable/cells";
import type { ListPageConfig, StatCardDef } from "../reusable/types";

interface AdminTag {
  id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  status: "active" | "inactive";
  wallpaperCount: number;
  downloads: number;
  managed: boolean;
  createdAt: string | null;
}

interface TagStats {
  total: number;
  active: number;
  totalWallpapers: number;
  totalDownloads: number;
  mostUsed: { name: string; count: number } | null;
}

const fmt = (n: number) => n.toLocaleString("en-US");
const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const CAT_CLASSES = ["cat-n", "cat-g", "cat-m", "cat-i", "cat-c"];
const tagClass = (name: string) => CAT_CLASSES[(name.charCodeAt(0) || 0) % CAT_CLASSES.length];

const TagsPage = () => {
  const [reloadTick, setReloadTick] = useState(0);
  const [stats, setStats] = useState<TagStats | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editRow, setEditRow] = useState<AdminTag | null>(null);

  const reload = useCallback(() => setReloadTick((t) => t + 1), []);

  useEffect(() => {
    let ignore = false;
    api.get<TagStats>("/admin/tags/stats").then((d) => { if (!ignore) setStats(d); }).catch(() => {});
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
      const d = await api.get<{ tags: AdminTag[]; pagination: { total: number } }>(`/admin/tags?${p.toString()}`);
      return { rows: d.tags as unknown as Record<string, unknown>[], total: d.pagination.total };
    },
    []
  );

  const del = useCallback(async (row: Record<string, unknown>) => {
    const t = row as unknown as AdminTag;
    if (!window.confirm(`Delete the "#${t.name}" tag? It will be removed from all wallpapers.`)) return;
    try { await api.delete(`/admin/tags/${t.slug}`); reload(); }
    catch (e) { alert(e instanceof ApiError ? e.message : "Delete failed"); }
  }, [reload]);

  const toggleActive = useCallback(async (row: Record<string, unknown>) => {
    const t = row as unknown as AdminTag;
    try { await api.patch(`/admin/tags/${t.slug}`, { name: t.name, isActive: t.status !== "active" }); reload(); }
    catch (e) { alert(e instanceof ApiError ? e.message : "Action failed"); }
  }, [reload]);

  const cards: StatCardDef[] = useMemo(() => {
    const s = stats;
    const pct = s && s.total ? Math.round((s.active / s.total) * 1000) / 10 : 0;
    return [
      { label: "Total Tags", value: s ? fmt(s.total) : "—", sub: "unique tags", icon: <TagIcon size={18} /> },
      { label: "Active Tags", value: s ? fmt(s.active) : "—", sub: s ? `${pct}% of total` : "", icon: <CheckCircle size={18} />, accent: "#05df8b" },
      { label: "Tagged Wallpapers", value: s ? fmt(s.totalWallpapers) : "—", sub: "have ≥1 tag", icon: <ImageIcon size={18} /> },
      { label: "Total Downloads", value: s ? fmt(s.totalDownloads) : "—", sub: "across all tags", icon: <Download size={18} /> },
      { label: "Most Used Tag", value: s?.mostUsed ? `#${s.mostUsed.name}` : "—", sub: s?.mostUsed ? `${fmt(s.mostUsed.count)} wallpapers` : "", icon: <TrendingUp size={18} />, accent: "#f59e0b" },
    ];
  }, [stats]);

  const config: ListPageConfig = useMemo(() => ({
    title: "Tags",
    breadcrumb: ["Dashboard", "Tags"],
    primaryAction: { label: "Add Tag", onClick: () => setShowAdd(true) },
    stats: cards,
    showIndex: true,
    searchPlaceholder: "Search tags…",
    fetcher,
    rowId: (r) => String((r as unknown as AdminTag).slug),
    filters: [
      { key: "status", placeholder: "All Status", options: [{ label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }] },
    ],
    sortOptions: [
      { label: "Most used", value: "wallpapers" },
      { label: "Most downloads", value: "downloads" },
      { label: "Name A–Z", value: "name" },
      { label: "Newest", value: "latest" },
      { label: "Oldest", value: "oldest" },
    ],
    columns: [
      { key: "tag", header: "Tag", cell: (r) => { const t = r as unknown as AdminTag; return <span className={`catb ${tagClass(t.name)}`}>#{t.name}</span>; } },
      { key: "description", header: "Description", cell: (r) => <span className="text-[var(--text2)]">{(r as unknown as AdminTag).description || "—"}</span> },
      { key: "wallpapers", header: "Wallpapers", cell: (r) => <span className="restext">{fmt((r as unknown as AdminTag).wallpaperCount)}</span> },
      { key: "downloads", header: "Downloads", cell: (r) => <span className="restext">{fmt((r as unknown as AdminTag).downloads)}</span> },
      { key: "status", header: "Status", cell: (r) => <StatusBadge value={(r as unknown as AdminTag).status === "active" ? "Active" : "Inactive"} /> },
      { key: "created", header: "Created", cell: (r) => <span className="ddate">{fmtDate((r as unknown as AdminTag).createdAt)}</span> },
    ],
    actions: [
      { type: "toggle", title: "Activate / deactivate", isActive: (r) => (r as unknown as AdminTag).status === "active", onClick: (r) => toggleActive(r) },
      { type: "edit", title: "Edit", onClick: (r) => setEditRow(r as unknown as AdminTag) },
      { type: "delete", title: "Delete", onClick: del },
    ],
  }), [cards, fetcher, del, toggleActive]);

  return (
    <>
      <AdminListPage config={config} refreshKey={reloadTick} />
      {showAdd ? <TagFormModal onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); reload(); }} /> : null}
      {editRow ? <TagFormModal initial={editRow} onClose={() => setEditRow(null)} onSaved={() => { setEditRow(null); reload(); }} /> : null}
    </>
  );
};

const border = "1px solid rgba(255,255,255,0.08)";
const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--bg3)", border: "1px solid var(--border2)",
  borderRadius: 8, color: "var(--text)", fontSize: 13, padding: "9px 12px", outline: "none",
};
const label: React.CSSProperties = { display: "block", fontSize: 12, color: "var(--text2)", margin: "12px 0 6px" };

function TagFormModal({ initial, onClose, onSaved }: { initial?: AdminTag; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!initial;
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    if (!name.trim()) { setError("Tag name is required."); return; }
    setBusy(true);
    try {
      const body = { name: name.trim().replace(/^#/, ""), description: description.trim() };
      if (isEdit) await api.patch(`/admin/tags/${initial!.slug}`, body);
      else await api.post("/admin/tags", body);
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save tag.");
    } finally { setBusy(false); }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "grid", placeItems: "center", padding: 20, zIndex: 70 }}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} style={{ width: "100%", maxWidth: 420, background: "var(--bg2)", border, borderRadius: 16, padding: 22, boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{isEdit ? "Edit Tag" : "Add Tag"}</h2>
        <p style={{ fontSize: 12.5, color: "var(--text2)" }}>{isEdit ? "Update this tag." : "Create a new tag for discovery."}</p>
        {error ? <div style={{ marginTop: 12, background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.3)", color: "#f7a7a7", fontSize: 12.5, padding: "9px 12px", borderRadius: 9 }}>{error}</div> : null}
        <label style={label}>Tag name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. nature" style={inputStyle} />
        <label style={label}>Description</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" style={inputStyle} />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          <button type="button" onClick={onClose} style={{ padding: "9px 16px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", border, background: "var(--bg3)", color: "var(--text2)" }}>Cancel</button>
          <button type="submit" disabled={busy} style={{ padding: "9px 18px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: busy ? "default" : "pointer", border: "none", background: "var(--brand)", color: "#04120c", opacity: busy ? 0.7 : 1 }}>{busy ? "Saving…" : isEdit ? "Save changes" : "Create"}</button>
        </div>
      </form>
    </div>
  );
}

export default TagsPage;
