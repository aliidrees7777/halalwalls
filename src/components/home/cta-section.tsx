"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/motion-wrapper";

export function CtaSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 p-8 sm:p-12 lg:p-16"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
            <div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10 blur-2xl" />

            <div className="relative flex flex-col items-center text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
              <div className="max-w-xl">
                <div className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  <Users className="size-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  Share your halal finds on the wall
                </h2>
                <p className="mt-4 text-lg text-emerald-50/90">
                  Join thousands of food lovers posting reviews, tips, and
                  photos. Help the ummah discover great halal food everywhere.
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0">
                <Button
                  size="lg"
                  className="bg-white text-emerald-700 hover:bg-white/90"
                  nativeButton={false}
                  render={<Link href="/community" />}
                >
                  View Community Wall
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-transparent text-white hover:bg-white/10"
                >
                  Submit a Review
                </Button>
              </div>
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
