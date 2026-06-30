"use client";
import React, { useState } from "react";

export interface Column {
  header: string;
  accessor: (item: any) => React.ReactNode;
}

interface Props {
  title: string;
  columns: Column[];
  data: any[];
}

const DynamicTable = ({ title, columns, data: initialData }: Props) => {
  const [data] = useState(initialData);
  const [activeTab, setActiveTab] = useState("Pending");

  return (
    <div className="ucard">
      <div className="ucard-top">
        <span>{title}</span>
        <a className="vlink">View All</a>
      </div>

      <div className="utabs">
        {["Pending", "Approved", "Rejected"].map((tab) => (
          <div
            key={tab}
            className={`utab ${activeTab === tab ? "on" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "Pending" ? `Pending Review` : tab}
          </div>
        ))}
      </div>

      <div className="tw">
        <table>
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>{col.accessor(item)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DynamicTable;
