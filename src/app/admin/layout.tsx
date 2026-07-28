import type { ReactNode } from "react";
import { AdminThemeLock } from "@/components/admindashboard/admincomponent/AdminThemeLock";

/** Admin routes are dark-only (no light mode). */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AdminThemeLock />
      {children}
    </>
  );
}
