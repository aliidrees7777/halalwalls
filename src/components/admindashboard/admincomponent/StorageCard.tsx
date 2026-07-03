"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Storage {
  usedBytes: number;
  quotaBytes: number;
  quotaGB: number;
  remainingBytes: number;
  percent: number;
  fileCount: number;
  disk: { totalBytes: number; freeBytes: number } | null;
}

const fmtSize = (bytes: number) => {
  if (bytes >= 1024 ** 4) return `${(bytes / 1024 ** 4).toFixed(1)} TB`;
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
};

const StorageCard = () => {
  const [s, setS] = useState<Storage | null>(null);

  useEffect(() => {
    let ignore = false;
    api
      .get<Storage>("/admin/storage")
      .then((d) => {
        if (!ignore) setS(d);
      })
      .catch(() => {
        /* not admin / offline — keep placeholders */
      });
    return () => {
      ignore = true;
    };
  }, []);

  const used = s ? fmtSize(s.usedBytes) : "—";
  const quota = s ? fmtSize(s.quotaBytes) : "—";
  const pct = s ? s.percent : 0;
  const remaining = s ? fmtSize(s.remainingBytes) : "—";

  return (
    <div className="rcard">
      <div className="rcard-ttl">
        Storage Usage <a>Details</a>
      </div>
      <div className="stor-hdr">
        <span className="stor-used">
          {used} / {quota}
        </span>
        <span className="stor-pct">{pct}% Used</span>
      </div>
      <div className="stor-sub">
        {remaining} remaining
        {s ? ` · ${s.fileCount.toLocaleString()} files` : ""}
      </div>
      <div className="stor-bg">
        <div className="stor-fill" style={{ width: `${Math.min(100, Math.max(pct, pct > 0 ? 1 : 0))}%` }} />
      </div>
    </div>
  );
};

export default StorageCard;
