import type { Metadata } from "next";
import { ExploreClient } from "@/components/explore/explore-client";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "Explore Halal Restaurants",
};

export default function ExplorePage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Explore"
          title="Find halal food near you"
          description="Browse verified restaurants filtered by cuisine, certification, and community ratings."
          className="mb-10"
        />
        <ExploreClient />
      </div>
    </div>
  );
}
