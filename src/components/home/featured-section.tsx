import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { featuredRestaurants } from "@/data/restaurants";
import { RestaurantCard } from "@/components/restaurants/restaurant-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerContainer, StaggerItem, FadeIn } from "@/components/shared/motion-wrapper";
import { Button } from "@/components/ui/button";

export function FeaturedSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Featured"
            title="Top-rated halal spots near you"
            description="Hand-picked restaurants with verified certifications and outstanding community reviews."
          />
          <FadeIn>
            <Button
              variant="outline"
              className="shrink-0 gap-2"
              nativeButton={false}
              render={<Link href="/explore" />}
            >
              View all
              <ArrowRight className="size-4" />
            </Button>
          </FadeIn>
        </div>

        <StaggerContainer className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredRestaurants.map((restaurant) => (
            <StaggerItem key={restaurant.id}>
              <RestaurantCard restaurant={restaurant} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
