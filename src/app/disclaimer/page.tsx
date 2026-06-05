import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalContent } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Disclaimer | HalalWalls" };

const lk = "underline underline-offset-2 hover:text-white";

const content: LegalContent = {
  title: "Disclaimer",
  sections: [
    {
      heading: "User-Generated and Sourced Content",
      blocks: [
        {
          type: "p",
          text: "halalwalls.com is a community-supported platform that hosts user-generated content. The majority of wallpapers published on this site are the following:",
        },
        {
          type: "ul",
          items: [
            "Uploaded by registered users from our community",
            "Collected from various publicly available sources across the internet",
            "Gathered from free image and wallpaper websites.",
            "Sourced from public domain or freely licensed repositories",
          ],
        },
        {
          type: "p",
          text: "We act as a hosting platform and do not claim ownership of user-submitted content. All images on this website are copyrighted by their respective authors unless explicitly marked as public domain content.",
        },
      ],
    },
    {
      heading: "Copyright and Content Usage",
      blocks: [
        {
          type: "p",
          text: "Although published content is believed to be authorized for sharing and personal use as desktop wallpaper, either by the uploader, original author, or for being public domain licensed content, users must understand that all images remain copyrighted by their respective authors unless otherwise noted. If you wish to use any images for purposes beyond personal desktop wallpaper use, you must obtain permission from the respective copyright holders.",
        },
      ],
    },
    {
      heading: "DMCA Compliance and Content Removal",
      blocks: [
        {
          type: "p",
          text: "halalwalls.com respects intellectual property rights and complies with the Digital Millennium Copyright Act (DMCA). If you believe content on our site infringes your copyright, or if you object to a wallpaper for any reason, including:",
        },
        {
          type: "ul",
          items: [
            "You created the wallpaper and do not wish to share it",
            "The content violates your copyright.",
            "The content is explicit, unethical, or inappropriate.",
            "Any other valid concern",
          ],
        },
        {
          type: "p",
          text: (
            <>
              Please{" "}
              <Link href="/contact" className={lk}>
                contact us
              </Link>{" "}
              immediately with the wallpaper title or URL and your cause for concern. We
              will review and respond to valid requests within 24-72 hours and remove
              infringing or inappropriate content promptly.
            </>
          ),
        },
        {
          type: "p",
          text: (
            <>
              For formal DMCA takedown requests, please review our comprehensive{" "}
              <Link href="/copyright-policy" className={lk}>
                Copyright Policy
              </Link>
              , which includes the required information for filing a valid DMCA notice.
            </>
          ),
        },
      ],
    },
    {
      heading: "Content Moderation",
      blocks: [
        {
          type: "p",
          text: "halalwalls.com reserves the right to decide whether to host any wallpaper submitted by users. We actively moderate content and may remove material that violates our policies or applicable laws. The halalwalls.com watermark may be added to wallpapers to identify that halalwalls.com is hosting that content.",
        },
      ],
    },
    {
      heading: "Limitation of Liability",
      blocks: [
        {
          type: "p",
          text: "As a platform hosting user-generated and publicly sourced content, halalwalls.com makes reasonable efforts to ensure content complies with copyright laws. However, we cannot guarantee the copyright status of all content and rely on copyright holders to notify us of any infringement. We are committed to addressing valid copyright claims promptly and efficiently.",
        },
      ],
    },
  ],
};

export default function DisclaimerPage() {
  return <LegalPage content={content} />;
}
