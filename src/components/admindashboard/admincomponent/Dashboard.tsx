"use client";
import React, { useState } from "react";
import SideBar from "../adminlayout/SideBar";
import Header from "../adminlayout/Header";
import StatsList from "./StatsList";
import ChartsRow from "./ChartsRow";
import RecentUploadsPage from "./RecentUploadsPage";
import Rightpanel from "./Rightpanel";
import { AdminListPage } from "../reusable/AdminListPage";
import { ADMIN_PAGES } from "../reusable/adminPages";

const Dashboard = () => {
  const [active, setActive] = useState("Dashboard");
  const config = ADMIN_PAGES[active];

  return (
    <div>
      <Header />
      <div id="content" className="ml-60">
        {active === "Dashboard" ? (
          <>
            <div className="pg-hdr ">
              <div>
                <h1>Dashboard</h1>
                <p>
                  Welcome back, <em>Admin!</em>
                </p>
              </div>
              <button className="view-site">
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
            <ChartsRow />
            <div className="bot-row">
              <RecentUploadsPage />
              <Rightpanel />
            </div>
          </>
        ) : config ? (
          <AdminListPage config={config} />
        ) : (
          <div className="px-4 py-24 text-center">
            <h1 className="text-2xl font-bold text-white">{active}</h1>
            <p className="mt-2 text-[#8a9199]">This section is coming soon.</p>
          </div>
        )}
      </div>
      <SideBar active={active} onSelect={setActive} />
    </div>
  );
};

export default Dashboard;
