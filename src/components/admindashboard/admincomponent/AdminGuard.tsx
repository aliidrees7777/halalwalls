"use client";
import { useAuth } from "@/context/auth-context";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import AdminLogin from "./AdminLogin";

/**
 * Gates the admin panel: only a signed-in user whose role is `admin` sees the
 * dashboard. Anyone else (guest, or a signed-in non-admin) gets the admin login.
 * Reuses the app-wide auth session (hw_token) — no separate admin token store.
 */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "var(--bg)",
        }}
      >
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (user?.role === "admin") return <>{children}</>;

  return <AdminLogin nonAdmin={!!user} />;
}
