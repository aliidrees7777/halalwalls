"use client";
import { useEffect, useState } from "react";
import {
  Check,
  X,
  RotateCcw,
  Eye,
  Trash2,
  ExternalLink,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Search,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/media-url";
import {
  AdminModalCloseButton,
  AdminModalOverlay,
  adminModalPanelStyle,
} from "../reusable/AdminModal";

// ── types ──
interface AdminWallpaper {
  id: string;
  title: string;
  slug: string;
  description?: string;
  tags: string[];
  image: string | null;
  thumbnailUrl: string | null;
  resolution: string;
  width: number | null;
  height: number | null;
  sizeMB?: number;
  category: string | null;
  categorySlug: string | null;
  author: string;
  isPremium?: boolean;
  status: "pending" | "active" | "hidden";
  downloadCount?: number;
  views?: number;
  favoritesCount?: number;
  createdAt: string;
  uploadedBy: { id: string; name: string; email: string } | null;
}

interface Uploader {
  id: string;
  name: string;
  email: string;
  role: string;
  authProvider: string;
  emailVerified: boolean;
  isPremium: boolean;
  avatar: string | null;
  bio: string;
  uploadsCount: number;
  favoritesCount: number;
  createdAt: string;
}

type TabKey = "pending" | "active" | "hidden";
const TABS: { key: TabKey; label: string }[] = [
  { key: "pending", label: "Pending Review" },
  { key: "active", label: "Approved" },
  { key: "hidden", label: "Rejected" },
];

const CAT_CLASS: Record<string, string> = {
  nature: "cat-n",
  sport: "cat-n",
  space: "cat-i",
  islamic: "cat-i",
  movies: "cat-m",
  minimalist: "cat-m",
  gaming: "cat-g",
  anime: "cat-g",
  cars: "cat-c",
  superheroes: "cat-c",
};

function imgSrc(raw?: string | null): string {
  return resolveMediaUrl(raw);
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

function StatusBadge({ status }: { status: TabKey }) {
  if (status === "pending") return <span className="pend-tag">Pending</span>;
  const map = {
    active: { label: "Live", color: "#05df8b" },
    hidden: { label: "Rejected", color: "#ef4444" },
  } as const;
  const s = map[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: `${s.color}1a`,
        color: s.color,
        padding: "3px 9px",
        borderRadius: 50,
        fontSize: "0.68rem",
        fontWeight: 700,
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.color }} />
      {s.label}
    </span>
  );
}

const border = "1px solid rgba(255,255,255,0.08)";
const selectStyle: React.CSSProperties = {
  background: "var(--bg3)",
  border: "1px solid var(--border2)",
  color: "var(--text2)",
  fontSize: "0.77rem",
  padding: "8px 10px",
  borderRadius: "var(--rs)",
  cursor: "pointer",
  appearance: "auto",
};

interface Props {
  variant?: "widget" | "full";
  onViewAll?: () => void;
  onBack?: () => void;
}

const RecentUploadsPage = ({ variant = "widget", onViewAll, onBack }: Props) => {
  const isFull = variant === "full";

  const [tab, setTab] = useState<TabKey>("pending");
  const [rows, setRows] = useState<AdminWallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reloadTick, setReloadTick] = useState(0);
  const reload = () => setReloadTick((t) => t + 1);

  // full-view controls (search / sort / limit)
  const [qInput, setQInput] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("latest");
  const [limit, setLimit] = useState(isFull ? 12 : 7);

  // 3-dot menu (fixed-positioned, keyed by row id)
  const [menu, setMenu] = useState<{ row: AdminWallpaper; x: number; y: number } | null>(null);

  // detail modal
  const [detailOpen, setDetailOpen] = useState(false);
  const [detail, setDetail] = useState<{ wallpaper: AdminWallpaper; uploader: Uploader | null } | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Debounce the search box (full view only).
  useEffect(() => {
    if (!isFull) return;
    const t = setTimeout(() => {
      setQ(qInput);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [qInput, isFull]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({
      status: tab,
      limit: String(limit),
      page: String(page),
    });
    if (isFull && q) params.set("q", q);
    if (isFull) params.set("sort", sort);
    api
      .get<{ wallpapers: AdminWallpaper[]; pagination?: { totalPages: number } }>(
        `/admin/wallpapers?${params.toString()}`
      )
      .then((d) => {
        if (ignore) return;
        setRows(d.wallpapers || []);
        setTotalPages(d.pagination?.totalPages || 1);
      })
      .catch((e) => {
        if (!ignore) setError(e instanceof ApiError ? e.message : "Failed to load");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [tab, page, q, sort, limit, reloadTick, isFull]);

  const switchTab = (t: TabKey) => {
    setPage(1);
    setTab(t);
  };

  const moderate = async (id: string, action: "approve" | "reject") => {
    if (busyId) return;
    setBusyId(id);
    setMenu(null);
    try {
      await api.patch(`/admin/wallpapers/${id}/${action}`);
      reload();
      if (detail?.wallpaper.id === id) setDetailOpen(false);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Action failed");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    if (busyId) return;
    setMenu(null);
    if (!window.confirm("Permanently delete this wallpaper? This cannot be undone.")) return;
    setBusyId(id);
    try {
      await api.delete(`/admin/wallpapers/${id}`);
      reload();
      if (detail?.wallpaper.id === id) setDetailOpen(false);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  const openDetail = async (id: string) => {
    setMenu(null);
    setDetailOpen(true);
    setDetail(null);
    setDetailLoading(true);
    try {
      const wp = await api.get<{ wallpaper: AdminWallpaper }>(`/admin/wallpapers/${id}`);
      let uploader: Uploader | null = null;
      if (wp.wallpaper.uploadedBy?.id) {
        try {
          const u = await api.get<{ user: Uploader }>(`/admin/users/${wp.wallpaper.uploadedBy.id}`);
          uploader = u.user;
        } catch {
          /* uploader may have been deleted — show wallpaper only */
        }
      }
      setDetail({ wallpaper: wp.wallpaper, uploader });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load details");
      setDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const openMenu = (e: React.MouseEvent, row: AdminWallpaper) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenu(menu?.row.id === row.id ? null : { row, x: r.right, y: r.bottom + 4 });
  };

  return (
    <div className="ucard">
      <div className="ucard-top">
        {isFull ? (
          <button
            onClick={onBack}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "none",
              border: "none",
              color: "var(--text)",
              fontSize: "0.9rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={16} /> Wallpaper Moderation
          </button>
        ) : (
          <span>Recent Uploads</span>
        )}
        {!isFull && (
          <a className="vlink" style={{ cursor: "pointer" }} onClick={onViewAll}>
            View All
          </a>
        )}
      </div>

      <div className="utabs">
        {TABS.map((t) => (
          <div
            key={t.key}
            className={`utab ${tab === t.key ? "on" : ""}`}
            onClick={() => switchTab(t.key)}
          >
            {t.label}
          </div>
        ))}
      </div>

      {isFull && (
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <div style={{ position: "relative", flex: "1 1 260px", minWidth: 200 }}>
            <Search
              size={15}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text3)",
              }}
            />
            <input
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              placeholder="Search title, category or tag…"
              style={{
                width: "100%",
                background: "var(--bg3)",
                border: "1px solid var(--border2)",
                borderRadius: "var(--rs)",
                color: "var(--text)",
                fontSize: "0.8rem",
                padding: "8px 12px 8px 34px",
                outline: "none",
              }}
            />
          </div>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            style={selectStyle}
          >
            <option value="latest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="popular">Most downloaded</option>
            <option value="views">Most viewed</option>
            <option value="title">Title A–Z</option>
          </select>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            style={selectStyle}
          >
            {[12, 24, 48].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="tw">
        <table>
          <thead>
            <tr>
              <th>Preview</th>
              <th>Title</th>
              <th>Uploader</th>
              <th>Category</th>
              <th>Resolution</th>
              <th>Submitted</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((w) => {
              const catClass = w.categorySlug ? CAT_CLASS[w.categorySlug] || "cat-n" : "cat-n";
              const src = imgSrc(w.thumbnailUrl || w.image);
              return (
                <tr key={w.id} style={busyId === w.id ? { opacity: 0.5 } : undefined}>
                  <td>
                    <div
                      className="thumb"
                      style={{ cursor: "pointer" }}
                      onClick={() => openDetail(w.id)}
                    >
                      {src ? <img src={src} alt={w.title} /> : null}
                    </div>
                  </td>
                  <td>
                    <div
                      className="wtitle"
                      style={{ cursor: "pointer" }}
                      onClick={() => openDetail(w.id)}
                    >
                      {w.title}
                    </div>
                    <div className="wtags">
                      {(w.tags || []).slice(0, 3).map((t) => `#${t}`).join(" ")}
                    </div>
                  </td>
                  <td>
                    <div className="uname">{w.uploadedBy?.name || w.author || "HalalWalls"}</div>
                    <div className="uemail">{w.uploadedBy?.email || "—"}</div>
                  </td>
                  <td>
                    <span className={`catb ${catClass}`}>
                      {w.category || w.categorySlug || "—"}
                    </span>
                  </td>
                  <td>
                    <span className="restext">
                      {(w.resolution || (w.width && w.height ? `${w.width}x${w.height}` : "—")).replace("x", "×")}
                    </span>
                  </td>
                  <td>
                    <div className="ddate">{fmtDate(w.createdAt)}</div>
                    <div className="dtime">{fmtTime(w.createdAt)}</div>
                  </td>
                  <td>
                    <StatusBadge status={w.status} />
                  </td>
                  <td>
                    <div className="acts">
                      {tab !== "active" && (
                        <button
                          className="aapprove"
                          title={tab === "hidden" ? "Restore & approve" : "Approve"}
                          disabled={!!busyId}
                          onClick={() => moderate(w.id, "approve")}
                        >
                          {tab === "hidden" ? <RotateCcw /> : <Check />}
                        </button>
                      )}
                      {tab !== "hidden" && (
                        <button
                          className="areject"
                          title={tab === "active" ? "Unpublish (hide)" : "Reject"}
                          disabled={!!busyId}
                          onClick={() => moderate(w.id, "reject")}
                        >
                          <X />
                        </button>
                      )}
                      <button className="amore" title="More actions" onClick={(e) => openMenu(e, w)}>
                        <MoreVertical size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {loading && (
          <div style={{ padding: "22px 4px", color: "var(--text3)", fontSize: 13 }}>Loading…</div>
        )}
        {!loading && error && (
          <div style={{ padding: "22px 4px", color: "#f0a0a0", fontSize: 13 }}>{error}</div>
        )}
        {!loading && !error && rows.length === 0 && (
          <div style={{ padding: "22px 4px", color: "var(--text3)", fontSize: 13 }}>
            {tab === "pending"
              ? "No submissions waiting for review 🎉"
              : tab === "active"
                ? "No approved wallpapers yet."
                : "No rejected wallpapers."}
          </div>
        )}
      </div>

      {/* Pagination (full view only) */}
      {isFull && totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 14,
            fontSize: 13,
            color: "var(--text2)",
          }}
        >
          <button
            className="amore"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            style={{ opacity: page <= 1 ? 0.4 : 1 }}
          >
            <ChevronLeft size={15} />
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            className="amore"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            style={{ opacity: page >= totalPages ? 0.4 : 1 }}
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* 3-dot dropdown menu */}
      {menu && (
        <>
          <div onClick={() => setMenu(null)} style={{ position: "fixed", inset: 0, zIndex: 60 }} />
          <div
            style={{
              position: "fixed",
              top: menu.y,
              left: menu.x - 190,
              width: 190,
              background: "var(--bg2)",
              border,
              borderRadius: 12,
              boxShadow: "0 16px 40px rgba(0,0,0,0.45)",
              padding: 6,
              zIndex: 61,
            }}
          >
            <MenuItem icon={<Eye size={15} />} label="View details" onClick={() => openDetail(menu.row.id)} />
            {menu.row.status !== "active" && (
              <MenuItem
                icon={menu.row.status === "hidden" ? <RotateCcw size={15} /> : <Check size={15} />}
                label={menu.row.status === "hidden" ? "Restore & approve" : "Approve"}
                color="#05df8b"
                onClick={() => moderate(menu.row.id, "approve")}
              />
            )}
            {menu.row.status !== "hidden" && (
              <MenuItem
                icon={<X size={15} />}
                label={menu.row.status === "active" ? "Unpublish (hide)" : "Reject"}
                onClick={() => moderate(menu.row.id, "reject")}
              />
            )}
            {menu.row.status === "active" && (
              <MenuItem
                icon={<ExternalLink size={15} />}
                label="Open on site"
                onClick={() => {
                  window.open(`/wallpaper/${menu.row.slug}`, "_blank");
                  setMenu(null);
                }}
              />
            )}
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "5px 4px" }} />
            <MenuItem
              icon={<Trash2 size={15} />}
              label="Delete permanently"
              color="#f0a0a0"
              onClick={() => remove(menu.row.id)}
            />
          </div>
        </>
      )}

      {/* Detail modal */}
      {detailOpen && (
        <DetailModal
          loading={detailLoading}
          detail={detail}
          busy={!!busyId}
          onClose={() => setDetailOpen(false)}
          onApprove={(id) => moderate(id, "approve")}
          onReject={(id) => moderate(id, "reject")}
          onDelete={(id) => remove(id)}
        />
      )}
    </div>
  );
};

function MenuItem({
  icon,
  label,
  onClick,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 9,
        padding: "8px 10px",
        background: "none",
        border: "none",
        borderRadius: 8,
        color: color || "var(--text)",
        fontSize: 13,
        cursor: "pointer",
        textAlign: "left",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg3)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
    >
      {icon}
      {label}
    </button>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function DetailModal({
  loading,
  detail,
  busy,
  onClose,
  onApprove,
  onReject,
  onDelete,
}: {
  loading: boolean;
  detail: { wallpaper: AdminWallpaper; uploader: Uploader | null } | null;
  busy: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const w = detail?.wallpaper;
  const u = detail?.uploader;
  return (
    <AdminModalOverlay>
      <div
        style={adminModalPanelStyle(720, {
          maxHeight: "90vh",
          overflowY: "auto",
          padding: 0,
          paddingRight: 0,
        })}
      >
        <AdminModalCloseButton onClose={onClose} />
        {loading || !w ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text2)" }}>Loading…</div>
        ) : (
          <>
            <div style={{ display: "flex", gap: 16, padding: 20, flexWrap: "wrap" }}>
              <div
                style={{
                  width: 220,
                  flex: "1 1 220px",
                  maxWidth: 280,
                  aspectRatio: "16/10",
                  borderRadius: 12,
                  overflow: "hidden",
                  background: "var(--bg3)",
                }}
              >
                {imgSrc(w.image || w.thumbnailUrl) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imgSrc(w.image || w.thumbnailUrl)}
                    alt={w.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : null}
              </div>
              <div style={{ flex: "1 1 300px", minWidth: 240 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <StatusBadge status={w.status} />
                  {w.isPremium && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#F59E0B",
                        background: "rgba(245,158,11,0.12)",
                        padding: "3px 9px",
                        borderRadius: 50,
                      }}
                    >
                      Premium
                    </span>
                  )}
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
                  {w.title}
                </h2>
                {w.description ? (
                  <p style={{ fontSize: 12.5, color: "var(--text2)", marginBottom: 12, lineHeight: 1.5 }}>
                    {w.description}
                  </p>
                ) : null}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <Field label="Category" value={w.category || "—"} />
                  <Field label="Resolution" value={(w.resolution || "—").replace("x", "×")} />
                  <Field label="Size" value={w.sizeMB ? `${w.sizeMB} MB` : "—"} />
                  <Field label="Downloads" value={(w.downloadCount ?? 0).toLocaleString()} />
                  <Field label="Views" value={(w.views ?? 0).toLocaleString()} />
                  <Field label="Favorites" value={(w.favoritesCount ?? 0).toLocaleString()} />
                  <Field label="Submitted" value={`${fmtDate(w.createdAt)} · ${fmtTime(w.createdAt)}`} />
                  <Field
                    label="Tags"
                    value={(w.tags || []).length ? w.tags.map((t) => `#${t}`).join(" ") : "—"}
                  />
                </div>
              </div>
            </div>

            {/* Uploader panel */}
            <div style={{ padding: "0 20px 20px" }}>
              <div
                style={{
                  border,
                  borderRadius: 12,
                  padding: 16,
                  background: "var(--bg)",
                }}
              >
                <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 12, fontWeight: 700 }}>
                  UPLOADED BY
                </div>
                {u ? (
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: "50%",
                        background: "var(--brand-dim)",
                        color: "var(--brand)",
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 700,
                        fontSize: 18,
                        flexShrink: 0,
                      }}
                    >
                      {(u.name || u.email || "?").charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
                        {u.name || "—"}
                        {u.isPremium && (
                          <span style={{ color: "#F59E0B", fontSize: 11, marginLeft: 8 }}>★ Premium</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12.5, color: "var(--text2)", marginBottom: 10 }}>{u.email}</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <Field label="Member since" value={fmtDate(u.createdAt)} />
                        <Field label="Total uploads" value={u.uploadsCount} />
                        <Field label="Sign-in" value={u.authProvider} />
                        <Field
                          label="Email verified"
                          value={u.emailVerified ? "Yes" : "No"}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: "var(--text2)" }}>
                    Added by the HalalWalls team (no submitting user).
                  </div>
                )}
              </div>
            </div>

            {/* Footer actions */}
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "flex-end",
                padding: "14px 20px",
                borderTop: border,
                flexWrap: "wrap",
              }}
            >
              <button onClick={onClose} style={btn("ghost")}>
                Close
              </button>
              {w.status !== "hidden" && (
                <button disabled={busy} onClick={() => onReject(w.id)} style={btn("danger")}>
                  {w.status === "active" ? "Unpublish" : "Reject"}
                </button>
              )}
              {w.status !== "active" && (
                <button disabled={busy} onClick={() => onApprove(w.id)} style={btn("primary")}>
                  {w.status === "hidden" ? "Restore & approve" : "Approve"}
                </button>
              )}
              <button disabled={busy} onClick={() => onDelete(w.id)} style={btn("danger-solid")}>
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </AdminModalOverlay>
  );
}

function btn(kind: "ghost" | "primary" | "danger" | "danger-solid"): React.CSSProperties {
  const base: React.CSSProperties = {
    padding: "9px 16px",
    borderRadius: 9,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    border,
  };
  if (kind === "primary")
    return { ...base, background: "var(--brand)", color: "#04120c", border: "none" };
  if (kind === "danger-solid")
    return { ...base, background: "#ef4444", color: "#fff", border: "none" };
  if (kind === "danger")
    return { ...base, background: "rgba(239,68,68,0.10)", color: "#f0a0a0", border: "1px solid rgba(239,68,68,0.3)" };
  return { ...base, background: "var(--bg3)", color: "var(--text2)" };
}

export default RecentUploadsPage;
