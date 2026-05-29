import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { communityPosts } from "@/data/posts";
import { PostCard } from "@/components/community/post-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/motion-wrapper";
import { Button } from "@/components/ui/button";

export function CommunityPreview() {
  const preview = communityPosts.slice(0, 2);

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Community"
            title="Latest from the wall"
            description="Real reviews and recommendations from the HalalWalls community."
          />
          <FadeIn>
            <Button
              variant="outline"
              className="gap-2"
              nativeButton={false}
              render={<Link href="/community" />}
            >
              See all posts
              <ArrowRight className="size-4" />
            </Button>
          </FadeIn>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {preview.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
