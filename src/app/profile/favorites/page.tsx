import type { Metadata } from "next";
import { FavoritesPage } from "@/components/profile/favorites-page";

export const metadata: Metadata = {
  title: "Your Favorites | HalalWalls",
  description: "All wallpapers you have saved to your HalalWalls favorites.",
};

export default function Page() {
  return <FavoritesPage />;
}
