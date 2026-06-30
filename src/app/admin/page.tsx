import Dashboard from "@/components/admindashboard/admincomponent/Dashboard";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="admin-panel" id="main">
      <Dashboard />
    </div>
  );
};

export default page;
