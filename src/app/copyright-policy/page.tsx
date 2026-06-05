import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalContent } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Copyright Policy | HalalWalls" };

const lk = "underline underline-offset-2 hover:text-white";

const content: LegalContent = {
  title: "Copyright Policy",
  sections: [
    {
      heading: "Copyright Policy",
      blocks: [
        {
          type: "p",
          text: "halalwalls.com respects the intellectual property rights of others and expects its users to do the same. We comply with the Digital Millennium Copyright Act (DMCA) and respond promptly to valid copyright infringement claims.",
        },
      ],
    },
    {
      heading: "User-Generated Content",
      blocks: [
        {
          type: "p",
          text: "The majority of content on halalwalls.com is user-submitted or collected from various publicly available sources across the internet. All wallpapers published on this website are copyrighted by their respective authors unless explicitly marked as public domain. Only wallpapers that contain the © halalwalls.com watermark or text like 'By halalwalls.com' are property of halalwalls.com.",
        },
      ],
    },
    {
      heading: "DMCA Takedown Procedure",
      blocks: [
        {
          type: "p",
          text: (
            <>
              If you believe that content on halalwalls.com infringes your copyright,
              please send a DMCA takedown notice to{" "}
              <a href="mailto:contact@halalwalls.com" className={lk}>
                contact@halalwalls.com
              </a>{" "}
              with the following required information:
            </>
          ),
        },
        {
          type: "ul",
          items: [
            "A physical or electronic signature of the copyright owner or authorized representative",
            "Identification of the copyrighted work claimed to have been infringed (or a representative list if multiple works)",
            "Identification of the material claimed to be infringing, including the URL or specific location on our site",
            "Your contact information including address, telephone number, and email address",
            "A statement that you have a good faith belief that the use of the material is not authorized by the copyright owner, its agent, or the law",
            "A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the copyright owner",
          ],
        },
        {
          type: "p",
          text: "Upon receiving a valid DMCA notice, we will remove or disable access to the allegedly infringing content within 24-72 hours. We take copyright infringement seriously and will terminate repeat infringers' accounts.",
        },
      ],
    },
    {
      heading: "Content Usage Rights",
      blocks: [
        {
          type: "p",
          text: (
            <>
              You are allowed to use and distribute wallpapers marked with halalwalls.com
              watermark as long as you do not remove any copyright or trademark notices.
              For all other content, you must obtain permission from the respective
              copyright holders. For additional information about content on our site,
              please read our{" "}
              <Link href="/disclaimer" className={lk}>
                Disclaimer
              </Link>
              .
            </>
          ),
        },
      ],
    },
    {
      heading: "Contact for Copyright Concerns",
      blocks: [
        {
          type: "p",
          text: (
            <>
              For any copyright-related questions or concerns, please contact us at{" "}
              <a href="mailto:contact@halalwalls.com" className={lk}>
                contact@halalwalls.com
              </a>
              . We are committed to respecting intellectual property rights and will work
              promptly to address valid copyright claims.
            </>
          ),
        },
      ],
    },
  ],
};

export default function CopyrightPolicyPage() {
  return <LegalPage content={content} />;
}
