import type { Metadata } from "next";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AddAuthorForm } from "@/components/add-author/add-author-form";

export const metadata: Metadata = {
  title: "Add An Author | HalalWalls",
  description:
    "Help identify the original author of a HalalWalls wallpaper.",
};

export default function AddAuthorPage() {
  return (
    <div className="flex min-h-screen flex-col bg-hw-bg">
      <SiteHeader />

      <main className="flex-1 px-4 pb-10 pt-[26px] lg:mx-auto lg:w-[1650px] lg:px-0 lg:pb-14 lg:pt-[30px]">
        <h1 className="mb-8 text-center text-[26px] font-bold leading-tight text-[#555555] dark:text-[#C8C3BC] lg:mb-11 lg:text-[39.111px]">
          Ad An Author
        </h1>
        <AddAuthorForm />
      </main>

      <SiteFooter />
    </div>
  );
}
