"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  MapPin,
  Clock,
  Phone,
  ArrowLeft,
  Heart,
  Share2,
  Navigation,
} from "lucide-react";
import { useState } from "react";
import type { Restaurant } from "@/types";
import { HalalBadge } from "@/components/shared/halal-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface RestaurantDetailProps {
  restaurant: Restaurant;
}

export function RestaurantDetail({ restaurant }: RestaurantDetailProps) {
  const [saved, setSaved] = useState(false);

  return (
    <article>
      <div className="relative h-[280px] sm:h-[360px] lg:h-[420px]">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <div className="absolute left-4 top-4 sm:left-8">
          <Button
            variant="secondary"
            size="sm"
            className="gap-1.5 bg-background/80 backdrop-blur-md"
            nativeButton={false}
            render={<Link href="/explore" />}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
        </div>

        <div className="absolute right-4 top-4 flex gap-2 sm:right-8">
          <Button
            variant="secondary"
            size="icon"
            className="bg-background/80 backdrop-blur-md"
            onClick={() => setSaved(!saved)}
            aria-label="Save restaurant"
          >
            <Heart
              className={cn("size-4", saved && "fill-rose-500 text-rose-500")}
            />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="bg-background/80 backdrop-blur-md"
            aria-label="Share"
          >
            <Share2 className="size-4" />
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="-mt-16 relative z-10"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <HalalBadge certification={restaurant.certification} />
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm">
                  {restaurant.cuisine}
                </span>
                <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm">
                  {restaurant.priceRange}
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {restaurant.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-foreground">
                    {restaurant.rating}
                  </span>
                  ({restaurant.reviewCount} reviews)
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4 text-emerald-500" />
                  {restaurant.address}, {restaurant.city}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500">
                <Navigation className="size-4" />
                Directions
              </Button>
              <Button variant="outline" className="gap-2">
                <Phone className="size-4" />
                Call
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-xl font-semibold">About</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {restaurant.description}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">Highlights</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                  {restaurant.highlights.map((h) => (
                    <li
                      key={h}
                      className="rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm font-medium"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold">Tags</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {restaurant.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-600 dark:text-emerald-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-4">
              <Card className="border-border/60">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="size-5 text-emerald-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Hours</p>
                      <p className="font-medium">{restaurant.hours}</p>
                      <p
                        className={cn(
                          "text-sm font-medium",
                          restaurant.openNow ? "text-emerald-500" : "text-muted-foreground"
                        )}
                      >
                        {restaurant.openNow ? "Open now" : "Currently closed"}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Phone className="size-5 text-emerald-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{restaurant.phone}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <MapPin className="size-5 text-emerald-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Distance</p>
                      <p className="font-medium">{restaurant.distance} away</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/5">
                <CardContent className="p-5">
                  <p className="font-semibold">Write a review</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Share your experience on the community wall.
                  </p>
                  <Button
                    className="mt-4 w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                    nativeButton={false}
                    render={<Link href="/community" />}
                  >
                    Post to Wall
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>
        </motion.div>
      </div>
    </article>
  );
}
