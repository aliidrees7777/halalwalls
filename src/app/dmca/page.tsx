import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalContent } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "DMCA | HalalWalls" };

const lk = "underline underline-offset-2 hover:text-white";

const content: LegalContent = {
  title: "DMCA",
  sections: [
    {
      heading: "DMCA Takedown Policy",
      blocks: [
        {
          type: "p",
          text: "halalwalls.com respects the intellectual property rights of others and complies with the provisions of the Digital Millennium Copyright Act (DMCA). This page explains how copyright owners can request removal of content that infringes their rights.",
        },
      ],
    },
    {
      heading: "Content Removal Process",
      blocks: [
        {
          type: "p",
          text: "If you believe that content on halalwalls.com infringes your copyright, we are committed to addressing your concern promptly. We will review and respond to valid takedown requests within 24-72 hours and remove infringing content as quickly as possible.",
        },
      ],
    },
    {
      heading: "How to Request Content Removal",
      blocks: [
        {
          type: "p",
          text: "You can submit a DMCA takedown request through two methods:",
        },
        {
          type: "ol",
          items: [
            <>
              Contact Form: Visit our{" "}
              <Link href="/contact" className={lk}>
                Contact Us
              </Link>{" "}
              page and submit your request with all required information.
            </>,
            <>
              Email: Send your DMCA notice directly to{" "}
              <a href="mailto:contact@halalwalls.com" className={lk}>
                contact@halalwalls.com
              </a>
            </>,
          ],
        },
      ],
    },
    {
      heading: "Required Information for DMCA Notice",
      blocks: [
        {
          type: "p",
          text: "To ensure your takedown request can be processed quickly, please include the following information:",
        },
        {
          type: "ul",
          items: [
            "Your name and contact information (email address, phone number, physical address)",
            "A description of the copyrighted work that you claim has been infringed",
            "The URL(s) or specific location(s) of the infringing content on halalwalls.com",
            "A statement that you have a good faith belief that the use of the material is not authorized by the copyright owner, its agent, or the law",
            "A statement, under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or authorized to act on behalf of the copyright owner",
            "Your physical or electronic signature",
          ],
        },
      ],
    },
    {
      heading: "User-Generated Content Platform",
      blocks: [
        {
          type: "p",
          text: "Please understand that halalwalls.com operates as a platform hosting user-generated content. The majority of wallpapers on this site are the following:",
        },
        {
          type: "ul",
          items: [
            "Uploaded by registered users from our community",
            "Collected from various publicly available sources across the internet",
            "Sourced from free wallpaper and image websites",
          ],
        },
        {
          type: "p",
          text: "We act as an intermediary hosting service and do not claim ownership of user-submitted content. However, we take copyright protection seriously and will remove any content found to be infringing upon valid copyright claims.",
        },
      ],
    },
    {
      heading: "Quick Removal Guarantee",
      blocks: [
        {
          type: "p",
          text: "Upon receiving a valid DMCA notice with all required information, we guarantee:",
        },
        {
          type: "ul",
          items: [
            "Review of your request within 24-72 hours",
            "Removal of infringing content promptly upon verification",
            "Email confirmation once the content has been removed",
          ],
        },
      ],
    },
    {
      heading: "Repeat Infringer Policy",
      blocks: [
        {
          type: "p",
          text: "halalwalls.com has a zero-tolerance policy for copyright infringement. Users who repeatedly upload infringing content will have their accounts terminated.",
        },
      ],
    },
    {
      heading: "Contact Information",
      blocks: [
        {
          type: "p",
          text: "For DMCA takedown requests or any copyright-related concerns:",
        },
        {
          type: "ul",
          items: [
            <>
              <strong className="font-semibold text-hw-faint">Email:</strong>{" "}
              <a href="mailto:contact@halalwalls.com" className={lk}>
                contact@halalwalls.com
              </a>
            </>,
            <>
              <strong className="font-semibold text-hw-faint">Contact Form:</strong>{" "}
              <Link href="/contact" className={lk}>
                Contact Us Page
              </Link>
            </>,
          ],
        },
        {
          type: "p",
          text: (
            <>
              For more detailed information about our copyright policies, please also
              review our{" "}
              <Link href="/copyright-policy" className={lk}>
                Copyright Policy
              </Link>{" "}
              and{" "}
              <Link href="/disclaimer" className={lk}>
                Disclaimer
              </Link>{" "}
              pages.
            </>
          ),
        },
      ],
    },
  ],
};

export default function DmcaPage() {
  return <LegalPage content={content} />;
}
