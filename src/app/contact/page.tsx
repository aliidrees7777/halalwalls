import type { Metadata } from "next";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact Us | HalalWalls",
  description:
    "Get in touch with HalalWalls — copyright requests, feedback, and general inquiries.",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-hw-bg">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 lg:py-14">
        <h1 className="mb-8 text-center text-2xl font-bold text-[#C8C3BC] sm:text-3xl">
          Contact Us
        </h1>
        <ContactForm />
      </main>

      <SiteFooter />
    </div>
  );
}
