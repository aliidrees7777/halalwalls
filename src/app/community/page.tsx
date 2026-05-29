"use client";

import { useState } from "react";
import { PenLine, TrendingUp, Clock } from "lucide-react";
import { communityPosts } from "@/data/posts";
import { PostCard } from "@/components/community/post-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export default function CommunityPage() {
  const [filter, setFilter] = useState("latest");
  const [draft, setDraft] = useState("");

  const sorted = [...communityPosts].sort((a, b) => {
    if (filter === "trending") return b.likes - a.likes;
    return 0;
  });

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Community"
          title="The Halal Wall"
          description="Reviews, tips, and conversations from halal food lovers around the world."
          align="center"
          className="mx-auto mb-10"
        />

        <div className="mb-8 rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white">
              Y
            </div>
            <div className="flex-1">
              <Input
                placeholder="Share a halal find, review, or question..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="border-0 bg-muted/50 shadow-none focus-visible:ring-emerald-500/30"
              />
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Demo mode — posts are not saved
                </p>
                <Button
                  size="sm"
                  disabled={!draft.trim()}
                  className="gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                >
                  <PenLine className="size-3.5" />
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={filter} onValueChange={setFilter} className="mb-8">
          <TabsList className="w-full justify-center">
            <TabsTrigger value="latest" className="gap-1.5">
              <Clock className="size-3.5" />
              Latest
            </TabsTrigger>
            <TabsTrigger value="trending" className="gap-1.5">
              <TrendingUp className="size-3.5" />
              Trending
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-6">
          {sorted.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
