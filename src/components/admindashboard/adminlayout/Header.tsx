"use client";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { LogOut } from "lucide-react";

interface HeaderProps {
  /** Toggles the mobile sidebar drawer. */
  onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName =
    user?.name?.trim() ||
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
    "Admin";
  const initial = (user?.firstName || user?.email || "A").charAt(0).toUpperCase();

  return (
    <div>
      <div id="topbar" className="lg:ml-60">
        <button className="ham-btn" title="Toggle sidebar" onClick={onMenuClick}>
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="top-search">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input type="text" placeholder="Search wallpapers, users..." />
        </div>
        <div className="top-right">
          <div className="notif" title="Notifications">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <div className="nbadge">6</div>
          </div>

          <div style={{ position: "relative" }}>
            <div
              className="admin-pill"
              role="button"
              tabIndex={0}
              onClick={() => setMenuOpen((o) => !o)}
              style={{ cursor: "pointer" }}
            >
              <div className="av">{initial}</div>
              <div className="admin-info">
                <div className="admin-name">{displayName}</div>
                <div className="admin-role">Administrator</div>
              </div>
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                style={{
                  color: "var(--text3)",
                  marginLeft: "2px",
                  transform: menuOpen ? "rotate(180deg)" : "none",
                  transition: "transform .2s",
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {menuOpen && (
              <>
                {/* click-catcher to close the menu */}
                <div
                  onClick={() => setMenuOpen(false)}
                  style={{ position: "fixed", inset: 0, zIndex: 40 }}
                />
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 8px)",
                    minWidth: 200,
                    background: "var(--bg2)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
                    padding: 6,
                    zIndex: 50,
                  }}
                >
                  <div
                    style={{
                      padding: "8px 10px 10px",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text)",
                      }}
                    >
                      {displayName}
                    </div>
                    <div
                      style={{
                        fontSize: 11.5,
                        color: "var(--text3)",
                        marginTop: 2,
                        wordBreak: "break-all",
                      }}
                    >
                      {user?.email}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      padding: "9px 10px",
                      background: "none",
                      border: "none",
                      borderRadius: 8,
                      color: "#f0a0a0",
                      fontSize: 13,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(239,68,68,0.10)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "none")
                    }
                  >
                    <LogOut size={15} /> Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
