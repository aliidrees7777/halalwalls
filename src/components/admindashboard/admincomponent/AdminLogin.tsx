"use client";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/lib/api";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, LogOut } from "lucide-react";

const border = "1px solid rgba(255,255,255,0.08)";

export default function AdminLogin({ nonAdmin = false }: { nonAdmin?: boolean }) {
  const { login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(
    nonAdmin
      ? "You're signed in with a non-admin account. Sign in with an administrator account to continue."
      : null
  );
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const u = await login(email.trim().toLowerCase(), password);
      if (u.role !== "admin") {
        logout(); // valid credentials, but not an admin → deny + drop the session
        setError("This account doesn't have admin access.");
      }
      // On success the guard re-renders and shows the dashboard.
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const field: React.CSSProperties = {
    width: "100%",
    background: "var(--bg3)",
    border,
    borderRadius: 10,
    color: "var(--text)",
    fontSize: 14,
    padding: "12px 14px 12px 42px",
    outline: "none",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background:
          "radial-gradient(1100px 500px at 50% -10%, rgba(5,223,139,0.10), transparent 60%), var(--bg)",
        display: "grid",
        placeItems: "center",
        padding: 20,
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            justifyContent: "center",
            marginBottom: 22,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "linear-gradient(135deg, var(--brand), #00a86b)",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 6px 18px rgba(5,223,139,0.35)",
            }}
          >
            <ShieldCheck size={20} color="#0b1210" />
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, color: "var(--text)" }}>
            Halal<span style={{ color: "var(--brand)" }}>Walls</span>
          </div>
        </div>

        <div
          style={{
            background: "var(--bg2)",
            border,
            borderRadius: 16,
            padding: "28px 26px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              fontWeight: 600,
              color: "var(--brand)",
              background: "var(--brand-dim)",
              border: "1px solid var(--brand-dim2)",
              padding: "4px 10px",
              borderRadius: 999,
              marginBottom: 14,
            }}
          >
            <Lock size={12} /> Admin Panel
          </div>
          <h1 style={{ fontSize: 21, fontWeight: 700, color: "var(--text)" }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 4 }}>
            Sign in with your administrator account to continue.
          </p>

          {error && (
            <div
              style={{
                marginTop: 16,
                background: "rgba(239,68,68,0.10)",
                border: "1px solid rgba(239,68,68,0.30)",
                color: "#f7a7a7",
                fontSize: 12.5,
                lineHeight: 1.5,
                padding: "10px 12px",
                borderRadius: 10,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} style={{ marginTop: 18 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                color: "var(--text2)",
                marginBottom: 7,
              }}
            >
              Email address
            </label>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <Mail
                size={16}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text3)",
                }}
              />
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@halalwalls.com"
                style={field}
              />
            </div>

            <label
              style={{
                display: "block",
                fontSize: 12,
                color: "var(--text2)",
                marginBottom: 7,
              }}
            >
              Password
            </label>
            <div style={{ position: "relative", marginBottom: 22 }}>
              <Lock
                size={16}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text3)",
                }}
              />
              <input
                type={show ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ ...field, paddingRight: 42 }}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text3)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, var(--brand), #00a86b)",
                color: "#0b1210",
                fontWeight: 700,
                fontSize: 14.5,
                border: "none",
                borderRadius: 10,
                padding: "12px 0",
                cursor: submitting ? "default" : "pointer",
                opacity: submitting ? 0.7 : 1,
                boxShadow: "0 8px 20px rgba(5,223,139,0.25)",
              }}
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {nonAdmin && (
            <button
              onClick={logout}
              style={{
                width: "100%",
                marginTop: 12,
                background: "var(--bg3)",
                color: "var(--text2)",
                fontSize: 12.5,
                border,
                borderRadius: 10,
                padding: "9px 0",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <LogOut size={14} /> Sign out of the current account
            </button>
          )}
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: 11.5,
            color: "var(--text3)",
            marginTop: 18,
          }}
        >
          Restricted area · authorized administrators only
        </p>
      </div>
    </div>
  );
}
