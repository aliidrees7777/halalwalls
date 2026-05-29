"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { HalalBadge } from "@/components/shared/halal-badge";
import type { Restaurant } from "@/types";
import { cn } from "@/lib/utils";

interface RestaurantCardProps {
  restaurant: Restaurant;
  className?: string;
}

export function RestaurantCard({ restaurant, className }: RestaurantCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn("group", className)}
    >
      <Link href={`/restaurants/${restaurant.id}`}>
        <Card className="overflow-hidden border-border/60 bg-card/50 p-0 transition-shadow duration-300 hover:shadow-xl hover:shadow-emerald-500/5">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={restaurant.image}
              alt={restaurant.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute left-3 top-3">
              <HalalBadge certification={restaurant.certification} />
            </div>
            {restaurant.openNow !== undefined && (
              <div className="absolute right-3 top-3">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-md",
                    restaurant.openNow
                      ? "bg-emerald-500/90 text-white"
                      : "bg-black/50 text-white/80"
                  )}
                >
                  <Clock className="size-3" />
                  {restaurant.openNow ? "Open now" : "Closed"}
                </span>
              </div>
            )}
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-xs font-medium text-white/80">
                {restaurant.cuisine} · {restaurant.priceRange}
              </p>
              <h3 className="mt-0.5 text-lg font-bold text-white">
                {restaurant.name}
              </h3>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold">{restaurant.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({restaurant.reviewCount})
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {restaurant.distance}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0 text-emerald-500" />
              <span className="truncate">{restaurant.city}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {restaurant.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.article>
  );
}
