import type { Metadata } from "next";
import { ProfilePage } from "@/components/profile/profile-page";

export const metadata: Metadata = {
  title: "My Account | HalalWalls",
  description: "Manage your HalalWalls profile, uploads, and favorites.",
};

export default function Page() {
  return <ProfilePage />;
}
