"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/search-bar";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/90 via-background to-background dark:from-emerald-950/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.25),transparent)]" />
      <div className="absolute -right-32 top-20 size-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute -left-32 bottom-0 size-80 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-24 lg:px-8 lg:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <Sparkles className="size-4" />
            Trusted by 120+ cities worldwide
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.1]">
            Find halal food you can{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 bg-clip-text text-transparent">
              trust
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Discover certified halal restaurants, read real community reviews,
            and share your favorite spots on the wall.
          </p>

          <div className="mt-10">
            <SearchBar size="large" className="mx-auto max-w-3xl" />
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 sm:w-auto"
              nativeButton={false}
              render={<Link href="/explore" />}
            >
              Explore Restaurants
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
              nativeButton={false}
              render={<Link href="/community" />}
            >
              Join the Community
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
