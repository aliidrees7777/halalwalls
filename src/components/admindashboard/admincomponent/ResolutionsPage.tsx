"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Monitor, CheckCircle, Download, FolderOpen, TrendingUp } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { AdminListPage } from "../reusable/AdminListPage";
import { StatusBadge } from "../reusable/cells";
import type { ListPageConfig, StatCardDef } from "../reusable/types";

interface AdminResolution {
  id: string;
  key: string;
  label: string;
  width: number;
  height: number;
  aspectRatio: string;
  device: string;
  fileSizeMB: number;
  isActive: boolean;
  status: "active" | "inactive";
  wallpaperCount: number;
  downloads: number;
  managed: boolean;
  createdAt: string | null;
}

interface ResStats {
  total: number;
  active: number;
  totalDownloads: number;
  wallpapersAssigned: number;
  mostPopular: { label: string; count: number } | null;
}

const fmt = (n: number) => n.toLocaleString("en-US");
const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const ResolutionsPage = () => {
  const [reloadTick, setReloadTick] = useState(0);
  const [stats, setStats] = useState<ResStats | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editRow, setEditRow] = useState<AdminResolution | null>(null);
  const reload = useCallback(() => setReloadTick((t) => t + 1), []);

  useEffect(() => {
    let ignore = false;
    api.get<ResStats>("/admin/resolutions/stats").then((d) => { if (!ignore) setStats(d); }).catch(() => {});
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
      if (filters.device) p.set("device", filters.device);
      const d = await api.get<{ resolutions: AdminResolution[]; pagination: { total: number } }>(`/admin/resolutions?${p.toString()}`);
      return { rows: d.resolutions as unknown as Record<string, unknown>[], total: d.pagination.total };
    },
    []
  );

  const del = useCallback(async (row: Record<string, unknown>) => {
    const r = row as unknown as AdminResolution;
    if (!window.confirm(`Delete the "${r.label}" resolution from the catalog?`)) return;
    try { await api.delete(`/admin/resolutions/${r.key}`); reload(); }
    catch (e) { alert(e instanceof ApiError ? e.message : "Delete failed"); }
  }, [reload]);

  const toggleActive = useCallback(async (row: Record<string, unknown>) => {
    const r = row as unknown as AdminResolution;
    try { await api.patch(`/admin/resolutions/${r.key}`, { isActive: r.status !== "active" }); reload(); }
    catch (e) { alert(e instanceof ApiError ? e.message : "Action failed"); }
  }, [reload]);

  const cards: StatCardDef[] = useMemo(() => {
    const s = stats;
    const pct = s && s.total ? Math.round((s.active / s.total) * 1000) / 10 : 0;
    return [
      { label: "Total Resolutions", value: s ? fmt(s.total) : "—", sub: "in the catalog", icon: <Monitor size={18} /> },
      { label: "Active Resolutions", value: s ? fmt(s.active) : "—", sub: s ? `${pct}% of total` : "", icon: <CheckCircle size={18} />, accent: "#05df8b" },
      { label: "Total Downloads", value: s ? fmt(s.totalDownloads) : "—", sub: "across all resolutions", icon: <Download size={18} /> },
      { label: "Wallpapers Assigned", value: s ? fmt(s.wallpapersAssigned) : "—", sub: "with a native resolution", icon: <FolderOpen size={18} />, accent: "#f59e0b" },
      { label: "Most Popular", value: s?.mostPopular?.label || "—", sub: s?.mostPopular ? `${fmt(s.mostPopular.count)} wallpapers` : "", icon: <TrendingUp size={18} />, accent: "#14b8a6" },
    ];
  }, [stats]);

  const config: ListPageConfig = useMemo(() => ({
    title: "Resolutions",
    breadcrumb: ["Dashboard", "Resolutions"],
    primaryAction: { label: "Add Resolution", onClick: () => setShowAdd(true) },
    stats: cards,
    showIndex: true,
    searchPlaceholder: "Search resolutions…",
    fetcher,
    rowId: (r) => String((r as unknown as AdminResolution).key),
    filters: [
      { key: "status", placeholder: "All Status", options: [{ label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }] },
      { key: "device", placeholder: "All Devices", options: [{ label: "Desktop", value: "desktop" }, { label: "Mobile", value: "mobile" }] },
    ],
    sortOptions: [
      { label: "Width (High to Low)", value: "width" },
      { label: "Width (Low to High)", value: "widthAsc" },
      { label: "Most wallpapers", value: "wallpapers" },
      { label: "Most downloads", value: "downloads" },
      { label: "Newest", value: "latest" },
    ],
    columns: [
      { key: "resolution", header: "Resolution", cell: (r) => <div className="wtitle">{(r as unknown as AdminResolution).label}</div> },
      { key: "aspect", header: "Aspect Ratio", cell: (r) => <span className="restext">{(r as unknown as AdminResolution).aspectRatio || "—"}</span> },
      { key: "wallpapers", header: "Wallpapers", cell: (r) => <span className="restext">{fmt((r as unknown as AdminResolution).wallpaperCount)}</span> },
      { key: "downloads", header: "Downloads", cell: (r) => <span className="restext">{fmt((r as unknown as AdminResolution).downloads)}</span> },
      { key: "status", header: "Status", cell: (r) => <StatusBadge value={(r as unknown as AdminResolution).status === "active" ? "Active" : "Inactive"} /> },
      { key: "created", header: "Created", cell: (r) => <span className="ddate">{fmtDate((r as unknown as AdminResolution).createdAt)}</span> },
    ],
    actions: [
      { type: "toggle", title: "Activate / deactivate", isActive: (r) => (r as unknown as AdminResolution).status === "active", onClick: (r) => toggleActive(r) },
      { type: "edit", title: "Edit", onClick: (r) => setEditRow(r as unknown as AdminResolution) },
      { type: "delete", title: "Delete", onClick: del },
    ],
  }), [cards, fetcher, del, toggleActive]);

  return (
    <>
      <AdminListPage config={config} refreshKey={reloadTick} />
      {showAdd ? <ResolutionFormModal onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); reload(); }} /> : null}
      {editRow ? <ResolutionFormModal initial={editRow} onClose={() => setEditRow(null)} onSaved={() => { setEditRow(null); reload(); }} /> : null}
    </>
  );
};

const border = "1px solid rgba(255,255,255,0.08)";
const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--bg3)", border: "1px solid var(--border2)",
  borderRadius: 8, color: "var(--text)", fontSize: 13, padding: "9px 12px", outline: "none",
};
const label: React.CSSProperties = { display: "block", fontSize: 12, color: "var(--text2)", margin: "12px 0 6px" };

function ResolutionFormModal({ initial, onClose, onSaved }: { initial?: AdminResolution; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!initial;
  const [width, setWidth] = useState(initial ? String(initial.width) : "");
  const [height, setHeight] = useState(initial ? String(initial.height) : "");
  const [labelText, setLabelText] = useState(initial?.label ?? "");
  const [device, setDevice] = useState(initial?.device ?? "desktop");
  const [fileSizeMB, setFileSizeMB] = useState(initial ? String(initial.fileSizeMB || "") : "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    const w = parseInt(width, 10), h = parseInt(height, 10);
    if (!w || !h) { setError("Width and height are required."); return; }
    setBusy(true);
    try {
      const body = { width: w, height: h, label: labelText.trim() || undefined, device, fileSizeMB: fileSizeMB ? Number(fileSizeMB) : undefined };
      if (isEdit) await api.patch(`/admin/resolutions/${initial!.key}`, body);
      else await api.post("/admin/resolutions", body);
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save resolution.");
    } finally { setBusy(false); }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "grid", placeItems: "center", padding: 20, zIndex: 70 }}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} style={{ width: "100%", maxWidth: 440, background: "var(--bg2)", border, borderRadius: 16, padding: 22, boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{isEdit ? "Edit Resolution" : "Add Resolution"}</h2>
        <p style={{ fontSize: 12.5, color: "var(--text2)" }}>{isEdit ? "Update this resolution." : "Add a resolution to the catalog (shown on the user side)."}</p>
        {error ? <div style={{ marginTop: 12, background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.3)", color: "#f7a7a7", fontSize: 12.5, padding: "9px 12px", borderRadius: 9 }}>{error}</div> : null}
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label style={label}>Width (px)</label>
            <input value={width} onChange={(e) => setWidth(e.target.value)} placeholder="3840" disabled={isEdit} style={{ ...inputStyle, opacity: isEdit ? 0.6 : 1 }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={label}>Height (px)</label>
            <input value={height} onChange={(e) => setHeight(e.target.value)} placeholder="2160" disabled={isEdit} style={{ ...inputStyle, opacity: isEdit ? 0.6 : 1 }} />
          </div>
        </div>
        <label style={label}>Label (optional)</label>
        <input value={labelText} onChange={(e) => setLabelText(e.target.value)} placeholder="3840 × 2160 (4K UHD)" style={inputStyle} />
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label style={label}>Device</label>
            <select value={device} onChange={(e) => setDevice(e.target.value)} style={{ ...inputStyle, appearance: "auto" }}>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={label}>File size (MB)</label>
            <input value={fileSizeMB} onChange={(e) => setFileSizeMB(e.target.value)} placeholder="4.86" style={inputStyle} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          <button type="button" onClick={onClose} style={{ padding: "9px 16px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", border, background: "var(--bg3)", color: "var(--text2)" }}>Cancel</button>
          <button type="submit" disabled={busy} style={{ padding: "9px 18px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: busy ? "default" : "pointer", border: "none", background: "var(--brand)", color: "#04120c", opacity: busy ? 0.7 : 1 }}>{busy ? "Saving…" : isEdit ? "Save changes" : "Create"}</button>
        </div>
      </form>
    </div>
  );
}

export default ResolutionsPage;
