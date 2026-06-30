import React from "react";
import SideBar from "../adminlayout/SideBar";
import Header from "../adminlayout/Header";
import StatsList from "./StatsList";
import ChartsRow from "./ChartsRow";
import RecentUploadsPage from "./RecentUploadsPage";
import Rightpanel from "./Rightpanel";

type Props = {};

const Dashboard = (props: Props) => {
  return (
    <div>
      <Header />
      <div id="content" className="ml-60">
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
              stroke-width="2.5"
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
      </div>
      <SideBar />
    </div>
  );
};

export default Dashboard;
