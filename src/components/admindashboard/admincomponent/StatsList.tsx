import React from "react";
import StatCard from "./StatCard";

const statsData = [
  {
    id: 1,
    label: "Total Wallpapers",
    value: "11,539",
    growth: "12.5%",
    monthly: "+1,289 this month",
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    id: 2,
    label: "Total Users",
    value: "25,847",
    growth: "8.7%",
    monthly: "+2,073 this month",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: 3,
    label: "Premium Users",
    value: "3,642",
    growth: "14.3%",
    monthly: "+455 this month",
    iconBg: "rgba(245,158,11,.1)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: 4,
    label: "Total Downloads",
    value: "356,421",
    growth: "10.2%",
    monthly: "+32,225 this month",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
  },
  {
    id: 5,
    label: "Total Revenue",
    value: "$24,593",
    growth: "18.6%",
    monthly: "+$3,893 this month",
    icon: (
      <svg viewBox="0 0 24 24">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
];

const StatsList = () => {
  return (
    <div className="stats">
      {statsData.map((stat) => (
        <StatCard key={stat.id} {...stat} />
      ))}
    </div>
  );
};

export default StatsList;
