"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Users, Star, ShieldCheck, Shield, UserPlus } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { AdminListPage } from "../reusable/AdminListPage";
import { StatusBadge } from "../reusable/cells";
import type { ListPageConfig, StatCardDef } from "../reusable/types";

interface AdminUser {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
  isPremium: boolean;
  subscriptionPlan: string | null;
  isDeleted: boolean;
  status: "active" | "deactivated";
  emailVerified: boolean;
  avatar: string | null;
  uploadsCount: number;
  favoritesCount: number;
  createdAt: string;
}

interface UserStats {
  total: number;
  premium: number;
  verified: number;
  admins: number;
  newThisMonth: number;
  growth: number;
}

const fmt = (n: number) => n.toLocaleString("en-US");
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

function Pill({ text, color }: { text: string; color: string }) {
  return (
    <span style={{ background: `${color}1a`, color, padding: "3px 10px", borderRadius: 50, fontSize: "0.68rem", fontWeight: 700 }}>{text}</span>
  );
}

const UsersPage = () => {
  const [reloadTick, setReloadTick] = useState(0);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editRow, setEditRow] = useState<AdminUser | null>(null);
  const reload = useCallback(() => setReloadTick((t) => t + 1), []);

  useEffect(() => {
    let ignore = false;
    api.get<UserStats>("/admin/users/stats").then((d) => { if (!ignore) setStats(d); }).catch(() => {});
    return () => { ignore = true; };
  }, [reloadTick]);

  const fetcher = useCallback(
    async ({ search, filters, sort, page, pageSize }: {
      search: string; filters: Record<string, string>; sort: string; page: number; pageSize: number | "all";
    }) => {
      const p = new URLSearchParams({ page: String(page), limit: String(pageSize) });
      if (search) p.set("q", search);
      if (sort) p.set("sort", sort);
      if (filters.role) p.set("role", filters.role);
      if (filters.status) p.set("status", filters.status);
      if (filters.plan === "premium") p.set("isPremium", "true");
      if (filters.plan === "free") p.set("isPremium", "false");
      const d = await api.get<{ users: AdminUser[]; pagination: { total: number } }>(`/admin/users?${p.toString()}`);
      return { rows: d.users as unknown as Record<string, unknown>[], total: d.pagination.total };
    },
    []
  );

  const del = useCallback(async (row: Record<string, unknown>) => {
    const u = row as unknown as AdminUser;
    if (!window.confirm(`Permanently delete "${u.name || u.email}"? This cannot be undone.`)) return;
    try { await api.delete(`/admin/users/${u.id}`); reload(); }
    catch (e) { alert(e instanceof ApiError ? e.message : "Delete failed"); }
  }, [reload]);

  const toggleStatus = useCallback(async (row: Record<string, unknown>) => {
    const u = row as unknown as AdminUser;
    try { await api.patch(`/admin/users/${u.id}`, { isDeleted: u.status === "active" }); reload(); }
    catch (e) { alert(e instanceof ApiError ? e.message : "Action failed"); }
  }, [reload]);

  const cards: StatCardDef[] = useMemo(() => {
    const s = stats;
    const pctP = s && s.total ? Math.round((s.premium / s.total) * 1000) / 10 : 0;
    const pctV = s && s.total ? Math.round((s.verified / s.total) * 1000) / 10 : 0;
    return [
      { label: "Total Users", value: s ? fmt(s.total) : "—", sub: s ? `+${fmt(s.newThisMonth)} this month` : "", icon: <Users size={18} /> },
      { label: "Premium Members", value: s ? fmt(s.premium) : "—", sub: s ? `${pctP}% of total` : "", icon: <Star size={18} />, accent: "#f59e0b" },
      { label: "Verified", value: s ? fmt(s.verified) : "—", sub: s ? `${pctV}% of total` : "", icon: <ShieldCheck size={18} />, accent: "#05df8b" },
      { label: "Admins", value: s ? fmt(s.admins) : "—", sub: "administrators", icon: <Shield size={18} />, accent: "#14b8a6" },
      { label: "New This Month", value: s ? fmt(s.newThisMonth) : "—", sub: s ? `${s.growth >= 0 ? "+" : ""}${s.growth}% vs last month` : "", icon: <UserPlus size={18} /> },
    ];
  }, [stats]);

  const config: ListPageConfig = useMemo(() => ({
    title: "Users",
    breadcrumb: ["Dashboard", "Users"],
    primaryAction: { label: "Add User", onClick: () => setShowAdd(true) },
    stats: cards,
    showIndex: true,
    searchPlaceholder: "Search users by name or email…",
    fetcher,
    rowId: (r) => String((r as unknown as AdminUser).id),
    filters: [
      { key: "role", placeholder: "All Roles", options: [{ label: "User", value: "user" }, { label: "Admin", value: "admin" }] },
      { key: "plan", placeholder: "All Plans", options: [{ label: "Premium", value: "premium" }, { label: "Free", value: "free" }] },
      { key: "status", placeholder: "All Status", options: [{ label: "Active", value: "active" }, { label: "Deactivated", value: "deactivated" }] },
    ],
    sortOptions: [
      { label: "Newest", value: "latest" },
      { label: "Oldest", value: "oldest" },
      { label: "Name A–Z", value: "name" },
      { label: "Most uploads", value: "uploads" },
    ],
    columns: [
      {
        key: "user", header: "User",
        cell: (r) => {
          const u = r as unknown as AdminUser;
          return (
            <div className="flex items-center gap-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold" style={{ background: "var(--brand-dim)", color: "var(--brand)" }}>
                {(u.name || u.email || "?").charAt(0).toUpperCase()}
              </div>
              <div><div className="wtitle">{u.name || "—"}</div><div className="uemail">{u.email}</div></div>
            </div>
          );
        },
      },
      { key: "role", header: "Role", cell: (r) => { const u = r as unknown as AdminUser; return <Pill text={u.role === "admin" ? "Admin" : "User"} color={u.role === "admin" ? "#05df8b" : "#8e9ba0"} />; } },
      { key: "plan", header: "Plan", cell: (r) => { const u = r as unknown as AdminUser; return <Pill text={u.isPremium ? "Premium" : "Free"} color={u.isPremium ? "#f59e0b" : "#8e9ba0"} />; } },
      { key: "status", header: "Status", cell: (r) => <StatusBadge value={(r as unknown as AdminUser).status === "active" ? "Active" : "Deactivated"} /> },
      { key: "verified", header: "Verified", cell: (r) => <StatusBadge value={(r as unknown as AdminUser).emailVerified ? "Verified" : "Unverified"} /> },
      { key: "uploads", header: "Uploads", cell: (r) => <span className="restext">{fmt((r as unknown as AdminUser).uploadsCount)}</span> },
      { key: "joined", header: "Joined", cell: (r) => <span className="ddate">{fmtDate((r as unknown as AdminUser).createdAt)}</span> },
    ],
    actions: [
      { type: "toggle", title: "Activate / deactivate", isActive: (r) => (r as unknown as AdminUser).status === "active", onClick: (r) => toggleStatus(r) },
      { type: "edit", title: "Edit", onClick: (r) => setEditRow(r as unknown as AdminUser) },
      { type: "delete", title: "Delete", onClick: del },
    ],
  }), [cards, fetcher, del, toggleStatus]);

  return (
    <>
      <AdminListPage config={config} refreshKey={reloadTick} />
      {showAdd ? <UserFormModal onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); reload(); }} /> : null}
      {editRow ? <UserFormModal initial={editRow} onClose={() => setEditRow(null)} onSaved={() => { setEditRow(null); reload(); }} /> : null}
    </>
  );
};

const border = "1px solid rgba(255,255,255,0.08)";
const inputStyle: React.CSSProperties = { width: "100%", background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 8, color: "var(--text)", fontSize: 13, padding: "9px 12px", outline: "none" };
const label: React.CSSProperties = { display: "block", fontSize: 12, color: "var(--text2)", margin: "12px 0 6px" };
const check: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, marginTop: 14, fontSize: 13, color: "var(--text)", cursor: "pointer" };

function UserFormModal({ initial, onClose, onSaved }: { initial?: AdminUser; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!initial;
  const [firstName, setFirstName] = useState(initial?.firstName ?? "");
  const [lastName, setLastName] = useState(initial?.lastName ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">(initial?.role ?? "user");
  const [isPremium, setIsPremium] = useState(initial?.isPremium ?? false);
  const [emailVerified, setEmailVerified] = useState(initial?.emailVerified ?? true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    if (!firstName.trim() || (!isEdit && !email.trim())) { setError("Name and email are required."); return; }
    if (!isEdit && password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setBusy(true);
    try {
      if (isEdit) {
        await api.patch(`/admin/users/${initial!.id}`, { firstName: firstName.trim(), lastName: lastName.trim(), role, isPremium, emailVerified });
      } else {
        await api.post("/admin/users", { firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), password, role, isPremium, emailVerified });
      }
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save user.");
    } finally { setBusy(false); }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "grid", placeItems: "center", padding: 20, zIndex: 70 }}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} style={{ width: "100%", maxWidth: 460, background: "var(--bg2)", border, borderRadius: 16, padding: 22, boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{isEdit ? "Edit User" : "Add User"}</h2>
        <p style={{ fontSize: 12.5, color: "var(--text2)" }}>{isEdit ? "Update this user's account." : "Create a new account."}</p>
        {error ? <div style={{ marginTop: 12, background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.3)", color: "#f7a7a7", fontSize: 12.5, padding: "9px 12px", borderRadius: 9 }}>{error}</div> : null}
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}><label style={label}>First name</label><input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jane" style={inputStyle} /></div>
          <div style={{ flex: 1 }}><label style={label}>Last name</label><input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" style={inputStyle} /></div>
        </div>
        <label style={label}>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@email.com" disabled={isEdit} style={{ ...inputStyle, opacity: isEdit ? 0.6 : 1 }} />
        {!isEdit ? (<><label style={label}>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" style={inputStyle} /></>) : null}
        <label style={label}>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value as "user" | "admin")} style={{ ...inputStyle, appearance: "auto" }}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <label style={check}><input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} /> Premium member</label>
        <label style={check}><input type="checkbox" checked={emailVerified} onChange={(e) => setEmailVerified(e.target.checked)} /> Email verified</label>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          <button type="button" onClick={onClose} style={{ padding: "9px 16px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", border, background: "var(--bg3)", color: "var(--text2)" }}>Cancel</button>
          <button type="submit" disabled={busy} style={{ padding: "9px 18px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: busy ? "default" : "pointer", border: "none", background: "var(--brand)", color: "#04120c", opacity: busy ? 0.7 : 1 }}>{busy ? "Saving…" : isEdit ? "Save changes" : "Create"}</button>
        </div>
      </form>
    </div>
  );
}

export default UsersPage;
