"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { restaurants } from "@/data/restaurants";
import { categories } from "@/data/categories";
import { RestaurantCard } from "@/components/restaurants/restaurant-card";
import { SearchBar } from "@/components/shared/search-bar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StaggerContainer, StaggerItem } from "@/components/shared/motion-wrapper";
import type { CuisineType } from "@/types";

const cuisineFilters: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  ...categories
    .filter((c) => c.id !== "all")
    .map((c) => ({ value: c.label, label: c.label })),
];

export function ExploreClient() {
  const [activeCuisine, setActiveCuisine] = useState("all");
  const [sortBy, setSortBy] = useState<"rating" | "distance">("rating");

  const filtered = useMemo(() => {
    let result = [...restaurants];
    if (activeCuisine !== "all") {
      result = result.filter((r) => r.cuisine === activeCuisine);
    }
    result.sort((a, b) =>
      sortBy === "rating" ? b.rating - a.rating : parseFloat(a.distance) - parseFloat(b.distance)
    );
    return result;
  }, [activeCuisine, sortBy]);

  return (
    <div>
      <SearchBar className="mb-8" />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeCuisine} onValueChange={setActiveCuisine}>
          <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
            {cuisineFilters.slice(0, 6).map((f) => (
              <TabsTrigger
                key={f.value}
                value={f.value}
                className="rounded-full border border-border/60 px-4 data-active:border-emerald-500/50 data-active:bg-emerald-500/10 data-active:text-emerald-600 dark:data-active:text-emerald-400"
              >
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button
            variant={sortBy === "rating" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSortBy("rating")}
          >
            Top rated
          </Button>
          <Button
            variant={sortBy === "distance" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSortBy("distance")}
          >
            Nearest
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <SlidersHorizontal className="size-3.5" />
            Filters
          </Button>
        </div>
      </div>

      <p className="mb-6 text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{filtered.length}</span>{" "}
        restaurants
      </p>

      <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((restaurant) => (
          <StaggerItem key={restaurant.id}>
            <RestaurantCard restaurant={restaurant} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
