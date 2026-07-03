"use client";
import { Fragment, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Shield, Lock, SlidersHorizontal, UserCog, ShieldCheck, Users, SquarePen, Eye,
  Check, X, ChevronUp, ChevronDown, Plus, Pencil, Trash2,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";

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
  "super-admin": "#05df8b", admin: "#60a5fa", moderator: "#2dd4bf", editor: "#a78bfa", viewer: "#9aa3ac",
};
const PALETTE = ["#05df8b", "#60a5fa", "#2dd4bf", "#a78bfa", "#f59e0b", "#ef4444", "#ec4899"];
const roleColor = (r: Role, i: number) => ROLE_COLORS[r.key] || PALETTE[i % PALETTE.length];
const roleIcon = (r: Role): ReactNode => {
  const m: Record<string, ReactNode> = {
    "super-admin": <ShieldCheck size={15} />, admin: <Shield size={15} />, moderator: <Users size={15} />,
    editor: <SquarePen size={15} />, viewer: <Eye size={15} />,
  };
  return m[r.key] || <Shield size={15} />;
};

const TABS = ["Permissions Matrix", "Role Management", "Permission Groups"];

export function RolesPermissions() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [catalog, setCatalog] = useState<CatalogModule[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(TABS[0]);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    api.get<{ roles: Role[]; catalog: CatalogModule[]; stats: Stats }>("/admin/roles")
      .then((d) => { setRoles(d.roles); setCatalog(d.catalog); setStats(d.stats); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const toggleModule = (m: string) =>
    setCollapsed((prev) => { const n = new Set(prev); n.has(m) ? n.delete(m) : n.add(m); return n; });

  // Toggle one permission for one role (optimistic → PATCH).
  const togglePerm = async (role: Role, key: string) => {
    const nextPerms = role.permissions.includes(key)
      ? role.permissions.filter((k) => k !== key)
      : [...role.permissions, key];
    setRoles((rs) => rs.map((r) => (r.id === role.id ? { ...r, permissions: nextPerms } : r)));
    try {
      await api.patch(`/admin/roles/${role.id}`, { permissions: nextPerms });
    } catch {
      setRoles((rs) => rs.map((r) => (r.id === role.id ? role : r))); // revert
    }
  };

  const del = async (role: Role) => {
    if (!window.confirm(`Delete the "${role.name}" role?`)) return;
    try { await api.delete(`/admin/roles/${role.id}`); load(); }
    catch (e) { alert(e instanceof ApiError ? e.message : "Delete failed"); }
  };

  const STAT_CARDS = useMemo(() => [
    { label: "Total Roles", value: stats ? String(stats.totalRoles) : "—", sub: stats ? `+${stats.newThisMonth} this month` : "", icon: <Shield size={18} /> },
    { label: "System Permissions", value: stats ? String(stats.systemPermissions) : "—", sub: "Across all modules", icon: <Lock size={18} /> },
    { label: "Custom Roles", value: stats ? String(stats.customRoles) : "—", sub: "Created by you", icon: <SlidersHorizontal size={18} /> },
    { label: "Admins", value: stats ? String(stats.admins) : "—", sub: "With the admin role", icon: <UserCog size={18} /> },
  ], [stats]);

  return (
    <div className="px-4 py-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Roles &amp; Permissions</h1>
          <p className="mt-1 text-sm text-[var(--text2)]">Manage user roles and control system permissions.</p>
        </div>
        <button type="button" onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-black transition-[filter] hover:brightness-95">
          <Plus size={16} /> Create Role
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_CARDS.map((s, i) => (
          <div className="sc" key={i}>
            <div className="sc-icon">{s.icon}</div>
            <div className="sc-body">
              <div className="sc-lbl">{s.label}</div>
              <div className="sc-val" style={{ color: "var(--text)" }}>{s.value}</div>
              <div className="sc-mo" style={s.sub.startsWith("+") ? { color: "var(--brand)" } : undefined}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-[10px] border border-[var(--border)] bg-[var(--bg2)]">
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] px-4">
          {TABS.map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={"border-b-2 px-4 py-3 text-sm font-medium transition-colors " +
                (tab === t ? "border-[var(--brand)] text-[var(--brand)]" : "border-transparent text-[var(--text2)] hover:text-[var(--text)]")}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="p-16 text-center text-[var(--text2)]">Loading…</div>
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
                        <span className="text-[10px] normal-case text-[var(--text2)]">{r.isSystem ? "System" : "Custom"}</span>
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
                                <button type="button" onClick={() => togglePerm(r, p.key)} title={on ? "Granted — click to revoke" : "Denied — click to grant"} className="mx-auto grid place-items-center">
                                  {on ? <Check size={16} className="text-[var(--brand)]" strokeWidth={2.5} /> : <X size={16} className="text-[var(--danger)]" strokeWidth={2.5} />}
                                </button>
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
        ) : tab === "Role Management" ? (
          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {roles.map((r, i) => (
              <div key={r.id} className="rounded-[10px] border border-[var(--border)] bg-[var(--bg3)] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="grid size-8 place-items-center rounded-full" style={{ background: `${roleColor(r, i)}1f`, color: roleColor(r, i) }}>{roleIcon(r)}</span>
                    <span className="font-semibold text-[var(--text)]">{r.name}</span>
                  </span>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: r.isSystem ? "rgba(142,155,160,0.12)" : "var(--brand-dim)", color: r.isSystem ? "var(--text2)" : "var(--brand)" }}>
                    {r.isSystem ? "System" : "Custom"}
                  </span>
                </div>
                <p className="mb-3 min-h-[32px] text-xs text-[var(--text2)]">{r.description || "—"}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text3)]">{r.permissions.length} / {stats?.systemPermissions ?? 0} permissions</span>
                  <span className="flex gap-1.5">
                    <button type="button" onClick={() => setEditRole(r)} className="grid size-7 place-items-center rounded-md border border-[var(--border2)] bg-[var(--bg4)] text-[var(--text2)] hover:text-[var(--text)]"><Pencil size={13} /></button>
                    {!r.isSystem ? (
                      <button type="button" onClick={() => del(r)} className="grid size-7 place-items-center rounded-md border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.08)] text-[var(--danger)] hover:bg-[var(--danger)] hover:text-white"><Trash2 size={13} /></button>
                    ) : null}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4">
            {catalog.map((m) => (
              <div key={m.module} className="mb-4">
                <div className="mb-2 text-sm font-semibold text-[var(--text)]">{m.module}</div>
                <div className="overflow-hidden rounded-[10px] border border-[var(--border)]">
                  {m.permissions.map((p, idx) => {
                    const count = roles.filter((r) => r.permissions.includes(p.key)).length;
                    return (
                      <div key={p.key} className={"flex items-center justify-between px-4 py-2.5 " + (idx ? "border-t border-[var(--border)]" : "")}>
                        <span className="text-sm text-[var(--text2)]">{p.label}</span>
                        <span className="text-xs text-[var(--text3)]">{count} / {roles.length} roles</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreate ? <RoleFormModal catalog={catalog} onClose={() => setShowCreate(false)} onSaved={() => { setShowCreate(false); load(); }} /> : null}
      {editRole ? <RoleFormModal initial={editRole} catalog={catalog} onClose={() => setEditRole(null)} onSaved={() => { setEditRole(null); load(); }} /> : null}
    </div>
  );
}

const border = "1px solid rgba(255,255,255,0.08)";
const inputStyle: React.CSSProperties = { width: "100%", background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 8, color: "var(--text)", fontSize: 13, padding: "9px 12px", outline: "none" };
const label: React.CSSProperties = { display: "block", fontSize: 12, color: "var(--text2)", margin: "12px 0 6px" };

function RoleFormModal({ initial, catalog, onClose, onSaved }: { initial?: Role; catalog: CatalogModule[]; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!initial;
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [perms, setPerms] = useState<Set<string>>(new Set(initial?.permissions ?? catalog.flatMap((m) => m.permissions).filter((p) => p.key.endsWith(".view")).map((p) => p.key)));
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
      const body = { name: name.trim(), description: description.trim(), permissions: [...perms] };
      if (isEdit) await api.patch(`/admin/roles/${initial!.id}`, body);
      else await api.post("/admin/roles", body);
      onSaved();
    } catch (err) { setError(err instanceof ApiError ? err.message : "Could not save role."); }
    finally { setBusy(false); }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "grid", placeItems: "center", padding: 20, zIndex: 70 }}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} style={{ width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", background: "var(--bg2)", border, borderRadius: 16, padding: 22, boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{isEdit ? "Edit Role" : "Create Role"}</h2>
        <p style={{ fontSize: 12.5, color: "var(--text2)" }}>{isEdit ? "Update this role and its permissions." : "Define a new role and its permissions."}</p>
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
          <button type="submit" disabled={busy} style={{ padding: "9px 18px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: busy ? "default" : "pointer", border: "none", background: "var(--brand)", color: "#04120c", opacity: busy ? 0.7 : 1 }}>{busy ? "Saving…" : isEdit ? "Save changes" : "Create role"}</button>
        </div>
      </form>
    </div>
  );
}
