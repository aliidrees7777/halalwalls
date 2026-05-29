import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRestaurantById, restaurants } from "@/data/restaurants";
import { RestaurantDetail } from "@/components/restaurants/restaurant-detail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return restaurants.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const restaurant = getRestaurantById(id);
  if (!restaurant) return { title: "Restaurant Not Found" };
  return {
    title: restaurant.name,
    description: restaurant.description,
  };
}

export default async function RestaurantPage({ params }: PageProps) {
  const { id } = await params;
  const restaurant = getRestaurantById(id);

  if (!restaurant) {
    notFound();
  }

  return <RestaurantDetail restaurant={restaurant} />;
}
