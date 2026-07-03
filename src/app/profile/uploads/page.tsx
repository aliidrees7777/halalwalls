import type { Metadata } from "next";
import { UploadsPage } from "@/components/profile/uploads-page";

export const metadata: Metadata = {
  title: "Your Uploads | HalalWalls",
  description: "All wallpapers you have uploaded to HalalWalls.",
};

export default function Page() {
  return <UploadsPage />;
}
