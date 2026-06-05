import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalContent } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Terms of Service | HalalWalls" };

const lk = "underline underline-offset-2 hover:text-white";

const content: LegalContent = {
  title: "Terms of Service",
  sections: [
    {
      heading: "Terms of Service",
      blocks: [
        {
          type: "p",
          text: "This document outlines what constitutes acceptable use of the halalwalls.com website, its associated web services, and server infrastructure. It also covers our content moderation policy and what you can expect regarding performance and availability.",
        },
        {
          type: "p",
          text: (
            <>
              If you have questions about what you are legally permitted to do with
              content found on this website, please consult our{" "}
              <Link href="/copyright-policy" className={lk}>
                Copyright Policy
              </Link>
              .
            </>
          ),
        },
      ],
    },
    {
      heading: "Access",
      blocks: [
        {
          type: "p",
          text: "This website is intended to be accessed via standard web browser software such as the ones present on our Compatible Browsers section and similar products via direct interaction by a human. With the exception of publicly accessible RSS feeds provided in XML format, the website and its associated files are not meant to be accessed via any automated means, such as by scripts or bots or automated applications.",
        },
        {
          type: "p",
          text: "Be aware that if you utilize an automated means of accessing or downloading this website, in whole or in part, your access to the site may be prevented, terminated, delayed, or slowed either temporarily or permanently, especially if you attempt to download too many large files simultaneously. This is necessary in order to protect the user experience of the website for those who access it in the manner envisioned by its authors.",
        },
        {
          type: "p",
          text: "Please understand that automated access to the site, via scripts, bots, or other similar means, can have the effect of seriously degrading the performance of the website or incurring significant additional costs to its operators without sufficient revenue generated to cover those costs. Keep in mind that even minor infractions against this policy can have a large negative effect when combined with similar actions by other users.",
        },
        {
          type: "p",
          text: "We ask that you respect the above guidelines so that we may continue to offer the website as a free resource to the world. We prefer to use our resources, both human and financial, to improve and expand the features and content of the website. Your cooperation is essential.",
        },
      ],
    },
    {
      heading: "Linking",
      blocks: [
        {
          type: "p",
          text: "Direct hyperlinking to images and other large files hosted by halalwalls.com is strictly prohibited without our permission. You may, of course, link directly to individual HTML or XML-based web pages. Direct linking to our small preview images is permitted but not guaranteed.",
        },
        {
          type: "p",
          text: "With the exception of publicly available RSS feeds in XML format, no files or services hosted on this web site are to be integrated into any other online service or application without the expressed written permission of the operators of this web site.",
        },
      ],
    },
    {
      heading: "User-Submitted Content",
      blocks: [
        {
          type: "p",
          text: "halalwalls.com is a community-supported website, relying on its user community for the bulk of its primary content. The majority of wallpapers on this site are user-uploaded or collected from various publicly available sources across the internet. Currently we accept content submissions in the form of desktop wallpapers. In order to maintain the quality of our content offerings, only a subset of submissions are selected to be published to publicly accessible portions of the website.",
        },
        {
          type: "p",
          text: "By submitting content to halalwalls.com, users represent and warrant that they have the right to share such content and that it does not infringe upon any third party's intellectual property rights. We act as a hosting platform and do not claim ownership of user-submitted content.",
        },
        {
          type: "p",
          text: "Some of halalwalls.com's content may be commented on publicly, with user-submitted text appearing directly on the site and associated with the appropriate content. It is the intention of the operators and architects of this site that the commenting feature be used only for constructive feedback and other discussions directly related to the content in question. It is not to be used for personal insults, explicit or implied; off-topic discussions; racially or culturally insensitive material; sexual content; or other material not suited for a family audience, including small children. Additionally, we ask that personally identifiable information not be posted to the website, regardless of whether it pertains to yourself or another individual. Children under the age of 13 shall only post comments or other content under the supervision of a parent, guardian, or other responsible adult.",
        },
        {
          type: "p",
          text: "We reserve the right to moderate the content posted on halalwalls.com, both during and after the submission process. The moderators may delete or edit content at any time, manually or via automated means, including the use of user-generated data to determine what is and is not acceptable to our audience. Moderation criteria may vary over time.",
        },
      ],
    },
    {
      heading: "Copyright Compliance & DMCA",
      blocks: [
        {
          type: "p",
          text: "halalwalls.com respects intellectual property rights and complies with the Digital Millennium Copyright Act (DMCA). We have a zero-tolerance policy for copyright infringement. Any content found to be infringing upon copyright will be removed immediately upon notification.",
        },
        {
          type: "p",
          text: (
            <>
              If you believe that content on our site infringes your copyright, please
              refer to our comprehensive{" "}
              <Link href="/copyright-policy" className={lk}>
                Copyright Policy
              </Link>{" "}
              and{" "}
              <Link href="/dmca" className={lk}>
                DMCA
              </Link>{" "}
              pages for information on how to submit a takedown request. Valid DMCA
              notices will be processed within 24-72 hours, and infringing content will
              be removed promptly.
            </>
          ),
        },
        {
          type: "p",
          text: "Repeat copyright infringers will have their accounts terminated. We are committed to maintaining a platform that respects the intellectual property rights of content creators.",
        },
      ],
    },
    {
      heading: "Performance",
      blocks: [
        {
          type: "p",
          text: "The operators of the web site make a reasonable attempt to maintain the availability and performance of halalwalls.com and its associated services. However, uptime and accessibility cannot be guaranteed. The website may occasionally be inaccessible, in whole or in part, due to planned or emergency maintenance, feature upgrades, bug fixes, server migrations, hardware upgrades and failures, or simply to prevent unauthorized use, hacking, or exploitation of the website or its resources.",
        },
      ],
    },
    {
      heading: "Liability",
      blocks: [
        {
          type: "p",
          text: "halalwalls.com, its owners, employees, contractors, and partners shall not be held legally liable or financially responsible for any loss, damage, or injury incurred as a result of the use or existence of halalwalls.com, its associated sites, content, services, or infrastructure.",
        },
        {
          type: "p",
          text: (
            <>
              That being said, if you have any concerns about the website, please make
              them known to the operators via the{" "}
              <Link href="/contact" className={lk}>
                Contact Us
              </Link>{" "}
              link.
            </>
          ),
        },
      ],
    },
  ],
};

export default function TermsPage() {
  return <LegalPage content={content} />;
}
