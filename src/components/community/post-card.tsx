"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CommunityPost } from "@/types";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: CommunityPost;
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [saved, setSaved] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-border/60 bg-card/50 overflow-hidden">
        <CardContent className="p-5">
          <header className="flex items-start gap-3">
            <Avatar className="size-11 ring-2 ring-emerald-500/20">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>
                {post.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{post.author.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {post.author.handle} · {post.timestamp}
                  </p>
                </div>
              </div>
              {post.restaurant && (
                <p className="mt-1 text-sm font-medium text-emerald-500">
                  @ {post.restaurant}
                </p>
              )}
            </div>
          </header>

          <p className="mt-4 text-[15px] leading-relaxed">{post.content}</p>

          {post.image && (
            <div className="relative mt-4 aspect-video overflow-hidden rounded-xl">
              <Image
                src={post.image}
                alt="Post image"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
              >
                #{tag}
              </span>
            ))}
          </div>

          <footer className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-1.5 text-muted-foreground",
                  liked && "text-rose-500 hover:text-rose-500"
                )}
                onClick={handleLike}
              >
                <Heart
                  className={cn("size-4", liked && "fill-rose-500 text-rose-500")}
                />
                {likeCount}
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                <MessageCircle className="size-4" />
                {post.comments}
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Share2 className="size-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className={cn(saved && "text-amber-500")}
              onClick={() => setSaved(!saved)}
              aria-label="Save post"
            >
              <Bookmark className={cn("size-4", saved && "fill-amber-500")} />
            </Button>
          </footer>
        </CardContent>
      </Card>
    </motion.article>
  );
}
