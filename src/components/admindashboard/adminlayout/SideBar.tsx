"use client";
import React from "react";
import {
  LayoutDashboard,
  ImageIcon,
  LayoutGrid,
  Tag,
  Maximize,
  // Megaphone,
  Users,
  ShieldCheck,
  // CreditCard,
  UserCheck,
  // Receipt,
  // ArrowLeftRight,
  // UploadCloud,
  // AlertTriangle,
  Settings,
  // Wrench,
  // FileText,
  // LifeBuoy,
} from "lucide-react";

interface SideBarProps {
  active: string;
  onSelect: (item: string) => void;
  /** Mobile drawer open state (ignored ≥ lg, where the sidebar is always shown). */
  open?: boolean;
}

const SideBar = ({ active, onSelect, open = false }: SideBarProps) => {
  const activeItem = active;
  const setActiveItem = onSelect;

  // Off-canvas drawer below lg; always visible at lg+.
  const drawer = open ? "translate-x-0" : "-translate-x-full lg:translate-x-0";

  return (
    <nav
      id="sb"
      className={drawer}
      style={{ position: "fixed", top: 0, zIndex: 60, transition: "transform 0.3s ease" }}
    >
      <button
        type="button"
        className="sb-logo"
        onClick={() => setActiveItem("Dashboard")}
        aria-label="Go to dashboard"
      >
        <img
          src="data:image/png;base64,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"
          alt="HalalWalls"
        />
        <span className="sb-logo-txt text-[#ffffff]">
          Halal<em>Walls</em>
        </span>
      </button>

      <div className="sb-body">
        {/* Dashboard */}
        <div className="sb-sec">
          <div
            className={`sb-item ${activeItem === "Dashboard" ? "on" : ""}`}
            onClick={() => setActiveItem("Dashboard")}
          >
            <LayoutDashboard size={20} /> Dashboard
          </div>
        </div>

        {/* Manage Content */}
        <div className="sb-sec">
          <span className="sb-lbl">Manage Content</span>
          {[
            { name: "Wallpapers", icon: <ImageIcon size={20} /> },
            { name: "Categories", icon: <LayoutGrid size={20} /> },
            { name: "Tags", icon: <Tag size={20} /> },
            { name: "Resolutions", icon: <Maximize size={20} /> },
            // { name: "Ads", icon: <Megaphone size={20} /> },
          ].map((item) => (
            <div
              key={item.name}
              className={`sb-item ${activeItem === item.name ? "on" : ""}`}
              onClick={() => setActiveItem(item.name)}
            >
              {item.icon} {item.name}
            </div>
          ))}
        </div>

        {/* User & Access */}
        <div className="sb-sec">
          <span className="sb-lbl">User & Access</span>
          <div
            className={`sb-item ${activeItem === "Users" ? "on" : ""}`}
            onClick={() => setActiveItem("Users")}
          >
            <Users size={20} /> Users
          </div>
          {/* <div
            className={`sb-item ${activeItem === "Roles" ? "on" : ""}`}
            onClick={() => setActiveItem("Roles")}
          >
            <ShieldCheck size={20} /> Roles & Permissions
          </div> */}
        </div>

        {/* Subscriptions */}
        <div className="sb-sec">
          <span className="sb-lbl">Subscriptions & Payments</span>
          {/* <div
            className={`sb-item ${activeItem === "Plans" ? "on" : ""}`}
            onClick={() => setActiveItem("Plans")}
          >
            <CreditCard size={20} /> Plans
          </div> */}
          <div
            className={`sb-item ${activeItem === "Subscribers" ? "on" : ""}`}
            onClick={() => setActiveItem("Subscribers")}
          >
            <UserCheck size={20} /> Subscribers
          </div>
          {/* <div
            className={`sb-item ${activeItem === "Payments" ? "on" : ""}`}
            onClick={() => setActiveItem("Payments")}
          >
            <Receipt size={20} /> Payments
          </div>
          <div
            className={`sb-item ${activeItem === "Transactions" ? "on" : ""}`}
            onClick={() => setActiveItem("Transactions")}
          >
            <ArrowLeftRight size={20} /> Transactions
          </div> */}
        </div>

        {/* Uploads & Reviews */}
        {/* <div className="sb-sec">
          <span className="sb-lbl">Uploads & Reviews</span>
          <div
            className={`sb-item ${activeItem === "Pending" ? "on" : ""}`}
            onClick={() => setActiveItem("Pending")}
          >
            <UploadCloud size={20} /> Pending Uploads{" "}
            <span className="sb-badge">12</span>
          </div>
          <div
            className={`sb-item ${activeItem === "Reported" ? "on" : ""}`}
            onClick={() => setActiveItem("Reported")}
          >
            <AlertTriangle size={20} /> Reported Items{" "}
            <span className="sb-badge warn">5</span>
          </div>
        </div> */}

        {/* System */}
        <div className="sb-sec">
          <span className="sb-lbl">System</span>
          <div
            className={`sb-item ${activeItem === "Settings" ? "on" : ""}`}
            onClick={() => setActiveItem("Settings")}
          >
            <Settings size={20} /> Settings
          </div>
          {/* <div
            className={`sb-item ${activeItem === "Maintenance" ? "on" : ""}`}
            onClick={() => setActiveItem("Maintenance")}
          >
            <Wrench size={20} /> Maintenance
          </div>
          <div
            className={`sb-item ${activeItem === "Logs" ? "on" : ""}`}
            onClick={() => setActiveItem("Logs")}
          >
            <FileText size={20} /> Logs
          </div> */}
        </div>
      </div>

      {/* <div className="sb-footer">
        <div
          className={`sb-item ${activeItem === "Support" ? "on" : ""}`}
          onClick={() => setActiveItem("Support")}
        >
          <LifeBuoy size={20} /> Support
        </div>
      </div> */}
    </nav>
  );
};

export default SideBar;
