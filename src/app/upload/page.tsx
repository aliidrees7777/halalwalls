import type { Metadata } from "next";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { UploadForm } from "@/components/upload/upload-form";

export const metadata: Metadata = {
  title: "Upload Wallpaper | HalalWalls",
  description: "Share your wallpaper with the HalalWalls community.",
};

export default function UploadPage() {
  return (
    <div className="flex min-h-screen flex-col bg-hw-bg">
      <SiteHeader />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 lg:py-14">
        <h1 className="mb-8 text-center text-2xl font-bold text-[#C8C3BC] sm:text-3xl">
          Upload Wallpaper
        </h1>
        <UploadForm />
      </main>

      <SiteFooter />
    </div>
  );
}
