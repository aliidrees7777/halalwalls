"use client";
import { Fragment, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Shield, Lock, UserCog, ShieldCheck, SquarePen,
  Check, X, ChevronUp, ChevronDown, Pencil, Trash2,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";
import {
  AdminModalCloseButton,
  AdminModalOverlay,
  adminModalPanelStyle,
} from "./AdminModal";
import { LoadingBlock } from "@/components/shared/loading-spinner";
import { useAuth } from "@/context/auth-context";
import { effectivePermissions, hasPermission } from "@/lib/admin-permissions";

/** Staff roles shown in the admin panel (Moderator / Viewer / custom are hidden). */
const VISIBLE_ROLE_KEYS = new Set(["super-admin", "admin", "editor"]);

interface Role {
  id: string;
  name: string;
  key: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
}
interface CatalogModule { module: string; permissions: { key: string; label: string }[] }
interface Stats { totalRoles: number; newThisMonth: number; systemPermissions: number; customRoles: number; admins: number }

const ROLE_COLORS: Record<string, string> = {
  "super-admin": "#05df8b", admin: "#60a5fa", editor: "#a78bfa",
};
const PALETTE = ["#05df8b", "#60a5fa", "#a78bfa", "#f59e0b"];
const roleColor = (r: Role, i: number) => ROLE_COLORS[r.key] || PALETTE[i % PALETTE.length];
const roleIcon = (r: Role): ReactNode => {
  const m: Record<string, ReactNode> = {
    "super-admin": <ShieldCheck size={15} />,
    admin: <Shield size={15} />,
    editor: <SquarePen size={15} />,
  };
  return m[r.key] || <Shield size={15} />;
};

const TABS = ["Permissions Matrix", "Role Management"] as const;

export function RolesPermissions() {
  const { user } = useAuth();
  const permissions = effectivePermissions(user);
  const canManageRoles = hasPermission(permissions, "roles.manage");
  const visibleTabs = useMemo(
    () => (canManageRoles ? TABS : TABS.filter((t) => t !== "Role Management")),
    [canManageRoles],
  );

  const [roles, setRoles] = useState<Role[]>([]);
  const [catalog, setCatalog] = useState<CatalogModule[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<(typeof TABS)[number]>(TABS[0]);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [editRole, setEditRole] = useState<Role | null>(null);

  useEffect(() => {
    if (!canManageRoles && tab === "Role Management") {
      setTab("Permissions Matrix");
    }
  }, [canManageRoles, tab]);

  const load = useCallback(() => {
    setLoading(true);
    api.get<{ roles: Role[]; catalog: CatalogModule[]; stats: Stats }>("/admin/roles")
      .then((d) => {
        const visible = (d.roles || []).filter((r) => VISIBLE_ROLE_KEYS.has(r.key));
        setRoles(visible);
        setCatalog(d.catalog);
        setStats(d.stats);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const toggleModule = (m: string) =>
    setCollapsed((prev) => { const n = new Set(prev); n.has(m) ? n.delete(m) : n.add(m); return n; });

  const del = async (role: Role) => {
    if (!window.confirm(`Delete the "${role.name}" role?`)) return;
    try { await api.delete(`/admin/roles/${role.id}`); load(); }
    catch (e) { alert(e instanceof ApiError ? e.message : "Delete failed"); }
  };

  const STAT_CARDS = useMemo(() => [
    { label: "Total Roles", value: stats ? String(Math.min(stats.totalRoles, VISIBLE_ROLE_KEYS.size)) : "—", sub: "Super Admin, Admin, Editor", icon: <Shield size={18} /> },
    { label: "System Permissions", value: stats ? String(stats.systemPermissions) : "—", sub: "Across all modules", icon: <Lock size={18} /> },
    { label: "Admins", value: stats ? String(stats.admins) : "—", sub: "With admin panel access", icon: <UserCog size={18} /> },
  ], [stats]);

  return (
    <div className="px-4 py-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Roles &amp; Permissions</h1>
          <p className="mt-1 text-sm text-[var(--text2)]">Manage user roles and control system permissions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {STAT_CARDS.map((s, i) => (
          <div className="sc" key={i}>
            <div className="sc-icon">{s.icon}</div>
            <div className="sc-body">
              <div className="sc-lbl">{s.label}</div>
              <div className="sc-val" style={{ color: "var(--text)" }}>{s.value}</div>
              <div className="sc-mo">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-[10px] border border-[var(--border)] bg-[var(--bg2)]">
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] px-4">
          {visibleTabs.map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={"border-b-2 px-4 py-3 text-sm font-medium transition-colors " +
                (tab === t ? "border-[var(--brand)] text-[var(--brand)]" : "border-transparent text-[var(--text2)] hover:text-[var(--text)]")}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingBlock className="p-16" size="lg" />
        ) : tab === "Permissions Matrix" ? (
          <div className="overflow-x-auto p-4">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text2)]">Module / Permission</th>
                  {roles.map((r, i) => (
                    <th key={r.id} className="px-3 py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="grid size-7 place-items-center rounded-full" style={{ background: `${roleColor(r, i)}1f`, color: roleColor(r, i) }}>{roleIcon(r)}</span>
                        <span className="text-xs font-semibold normal-case text-[var(--text)]">{r.name}</span>
                        <span className="text-[10px] normal-case text-[var(--text2)]">System</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {catalog.map((m) => {
                  const open = !collapsed.has(m.module);
                  return (
                    <Fragment key={m.module}>
                      <tr className="cursor-pointer border-t border-[var(--border)]" onClick={() => toggleModule(m.module)}>
                        <td className="bg-[var(--bg3)]/60 px-4 py-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[var(--text)]">{m.module}</span>
                            {open ? <ChevronUp size={16} className="text-[var(--text2)]" /> : <ChevronDown size={16} className="text-[var(--text2)]" />}
                          </div>
                        </td>
                        <td colSpan={roles.length} className="bg-[var(--bg3)]/60" />
                      </tr>
                      {open ? m.permissions.map((p) => (
                        <tr key={p.key} className="border-t border-[var(--border)]">
                          <td className="px-4 py-2.5 pl-8 text-[var(--text2)]">{p.label}</td>
                          {roles.map((r) => {
                            const on = r.permissions.includes(p.key);
                            return (
                              <td key={r.id} className="px-3 py-2.5 text-center">
                                <span
                                  className="mx-auto grid place-items-center"
                                  title={on ? "Granted" : "Denied"}
                                  aria-label={on ? "Granted" : "Denied"}
                                >
                                  {on ? <Check size={16} className="text-[var(--brand)]" strokeWidth={2.5} /> : <X size={16} className="text-[var(--danger)]" strokeWidth={2.5} />}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      )) : null}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {roles.map((r, i) => (
              <div key={r.id} className="rounded-[10px] border border-[var(--border)] bg-[var(--bg3)] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="grid size-8 place-items-center rounded-full" style={{ background: `${roleColor(r, i)}1f`, color: roleColor(r, i) }}>{roleIcon(r)}</span>
                    <span className="font-semibold text-[var(--text)]">{r.name}</span>
                  </span>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "rgba(142,155,160,0.12)", color: "var(--text2)" }}>
                    System
                  </span>
                </div>
                <p className="mb-3 min-h-[32px] text-xs text-[var(--text2)]">{r.description || "—"}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text3)]">{r.permissions.length} / {stats?.systemPermissions ?? 0} permissions</span>
                  <span className="flex gap-1.5">
                    <button type="button" onClick={() => setEditRole(r)} className="grid size-7 place-items-center rounded-md border border-[var(--border2)] bg-[var(--bg4)] text-[var(--text2)] hover:text-[var(--text)]" title="Edit role"><Pencil size={13} /></button>
                    {!r.isSystem ? (
                      <button type="button" onClick={() => del(r)} className="grid size-7 place-items-center rounded-md border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.08)] text-[var(--danger)] hover:bg-[var(--danger)] hover:text-white" title="Delete role"><Trash2 size={13} /></button>
                    ) : null}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editRole ? <RoleFormModal initial={editRole} catalog={catalog} onClose={() => setEditRole(null)} onSaved={() => { setEditRole(null); load(); }} /> : null}
    </div>
  );
}

const border = "1px solid rgba(255,255,255,0.08)";
const inputStyle: React.CSSProperties = { width: "100%", background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 8, color: "var(--text)", fontSize: 13, padding: "9px 12px", outline: "none" };
const label: React.CSSProperties = { display: "block", fontSize: 12, color: "var(--text2)", margin: "12px 0 6px" };

function RoleFormModal({ initial, catalog, onClose, onSaved }: { initial: Role; catalog: CatalogModule[]; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description);
  const [perms, setPerms] = useState<Set<string>>(new Set(initial.permissions));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toggle = (k: string) => setPerms((s) => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    if (!name.trim()) { setError("Role name is required."); return; }
    setBusy(true);
    try {
      await api.patch(`/admin/roles/${initial.id}`, {
        name: name.trim(),
        description: description.trim(),
        permissions: [...perms],
      });
      onSaved();
    } catch (err) { setError(err instanceof ApiError ? err.message : "Could not save role."); }
    finally { setBusy(false); }
  };

  return (
    <AdminModalOverlay>
      <form onSubmit={submit} style={adminModalPanelStyle(520, { maxHeight: "90vh", overflowY: "auto" })}>
        <AdminModalCloseButton onClose={onClose} />
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Edit Role</h2>
        <p style={{ fontSize: 12.5, color: "var(--text2)" }}>Update this role and its permissions.</p>
        {error ? <div style={{ marginTop: 12, background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.3)", color: "#f7a7a7", fontSize: 12.5, padding: "9px 12px", borderRadius: 9 }}>{error}</div> : null}
        <label style={label}>Role name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Support Agent" style={inputStyle} />
        <label style={label}>Description</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" style={inputStyle} />
        <label style={label}>Permissions</label>
        <div style={{ border, borderRadius: 10, padding: 4, maxHeight: 260, overflowY: "auto" }}>
          {catalog.map((m) => (
            <div key={m.module} style={{ padding: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", margin: "4px 6px" }}>{m.module}</div>
              {m.permissions.map((p) => (
                <label key={p.key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 6px", fontSize: 13, color: "var(--text)", cursor: "pointer" }}>
                  <input type="checkbox" checked={perms.has(p.key)} onChange={() => toggle(p.key)} /> {p.label}
                </label>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 18 }}>
          <button type="button" onClick={onClose} style={{ padding: "9px 16px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", border, background: "var(--bg3)", color: "var(--text2)" }}>Cancel</button>
          <button type="submit" disabled={busy} style={{ padding: "9px 18px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: busy ? "default" : "pointer", border: "none", background: "var(--brand)", color: "#04120c", opacity: busy ? 0.7 : 1 }}>{busy ? "Saving…" : "Save changes"}</button>
        </div>
      </form>
    </AdminModalOverlay>
  );
}
