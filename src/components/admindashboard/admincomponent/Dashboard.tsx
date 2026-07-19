"use client";
import React, { useState } from "react";
import SideBar from "../adminlayout/SideBar";
import Header from "../adminlayout/Header";
import StatsList from "./StatsList";
import ChartsRow from "./ChartsRow";
import RecentUploadsPage from "./RecentUploadsPage";
import Rightpanel from "./Rightpanel";
import CategoriesPanel from "./CategoriesPanel";
import ActivityFeed from "./ActivityFeed";
import WallpapersPage from "./WallpapersPage";
import CategoriesManagementPage from "./CategoriesManagementPage";
import SubscribersPage from "./SubscribersPage";
import TagsPage from "./TagsPage";
import ResolutionsPage from "./ResolutionsPage";
import UsersPage from "./UsersPage";
import SettingsPage from "./SettingsPage";
import { AdminListPage } from "../reusable/AdminListPage";
import { ADMIN_PAGES } from "../reusable/adminPages";
import { RolesPermissions } from "../reusable/RolesPermissions";
import { useAuth } from "@/context/auth-context";

const Dashboard = () => {
  const { user } = useAuth();
  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const config = ADMIN_PAGES[active];
  const welcomeName =
    user?.name?.trim() ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    user?.email?.split("@")[0] ||
    "Admin";

  return (
    <div>
      <Header onMenuClick={() => setSidebarOpen((v) => !v)} />
      {/* Mobile drawer backdrop */}
      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-[55] bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}
      <div id="content" className="lg:ml-60">
        {active === "Dashboard" ? (
          <>
            <div className="pg-hdr ">
              <div>
                <h1>Dashboard</h1>
                <p>
                  Welcome back, <em>{welcomeName}!</em>
                </p>
              </div>
              <button
                className="view-site"
                onClick={() => window.open("/", "_blank")}
              >
                View Site
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </button>
            </div>
            <StatsList />
            <ChartsRow
              onViewActivity={() => setActive("Activity")}
              onViewSubscribers={() => setActive("Subscribers")}
            />
            <div className="bot-row">
              <RecentUploadsPage
                variant="widget"
                onViewAll={() => setActive("Moderation")}
              />
              <Rightpanel onViewAll={() => setActive("TopCategories")} />
            </div>
          </>
        ) : active === "Moderation" ? (
          <RecentUploadsPage
            variant="full"
            onBack={() => setActive("Dashboard")}
          />
        ) : active === "TopCategories" ? (
          <CategoriesPanel
            variant="full"
            onBack={() => setActive("Dashboard")}
          />
        ) : active === "Categories" ? (
          <CategoriesManagementPage />
        ) : active === "Subscribers" ? (
          <SubscribersPage />
        ) : active === "Tags" ? (
          <TagsPage />
        ) : active === "Resolutions" ? (
          <ResolutionsPage />
        ) : active === "Users" ? (
          <UsersPage />
        ) : active === "Activity" ? (
          <ActivityFeed onBack={() => setActive("Dashboard")} />
        ) : active === "Wallpapers" ? (
          <WallpapersPage />
        ) : active === "Roles" ? (
          <RolesPermissions />
        ) : active === "Settings" ? (
          <SettingsPage />
        ) : config ? (
          <AdminListPage config={config} />
        ) : (
          <div className="px-4 py-24 text-center">
            <h1 className="text-2xl font-bold text-white">{active}</h1>
            <p className="mt-2 text-[#8a9199]">This section is coming soon.</p>
          </div>
        )}
      </div>
      <SideBar
        active={active}
        onSelect={(item) => {
          setActive(item);
          setSidebarOpen(false);
        }}
        open={sidebarOpen}
      />
    </div>
  );
};

export default Dashboard;
