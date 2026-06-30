import React, { ReactNode } from "react";

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  growth: string;
  monthly: string;
  iconBg?: string; // Optional custom background
};

const StatCard = ({
  icon,
  label,
  value,
  growth,
  monthly,
  iconBg,
}: StatCardProps) => {
  return (
    <div className="sc">
      <div className="sc-icon" style={iconBg ? { background: iconBg } : {}}>
        {icon}
      </div>
      <div className="sc-body">
        <div className="sc-lbl">{label}</div>
        <div className="sc-val">
          {value} <span className="sc-up">▲ {growth}</span>
        </div>
        <div className="sc-mo">{monthly}</div>
      </div>
    </div>
  );
};

export default StatCard;
