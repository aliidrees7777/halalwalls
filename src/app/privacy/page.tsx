import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalContent } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Privacy Policy | HalalWalls" };

const lk = "underline underline-offset-2 hover:text-white";

const content: LegalContent = {
  title: "Privacy Policy",
  sections: [
    {
      heading: "Privacy policy",
      blocks: [
        {
          type: "p",
          text: "The owners and operators of halalwalls.com take your online privacy seriously. This document outlines the types of information collected by our servers and provides links to the privacy policies of our third-party advertising partners.",
        },
      ],
    },
    {
      heading: "User-Generated Content Platform",
      blocks: [
        {
          type: "p",
          text: "halalwalls.com operates as a community-supported platform that hosts user-generated content. The wallpapers and images on this site come from multiple sources:",
        },
        {
          type: "ul",
          items: [
            "Content uploaded by registered users from our community",
            "Content collected from various publicly available sources across the internet",
            "Images sourced from free wallpaper and image websites",
            "Public domain and freely licensed content repositories",
          ],
        },
        {
          type: "p",
          text: (
            <>
              We act as a hosting platform and intermediary service, not as the original
              creator or owner of most content. For copyright and content-related
              concerns, please refer to our{" "}
              <Link href="/copyright-policy" className={lk}>
                Copyright Policy
              </Link>{" "}
              and{" "}
              <Link href="/dmca" className={lk}>
                DMCA
              </Link>{" "}
              pages.
            </>
          ),
        },
      ],
    },
    {
      heading: "User Accounts",
      blocks: [
        {
          type: "p",
          text: "Membership is an optional part of the halalwalls.com website. No user account is required in order to browse or download the content we provide. However, creating an account enables extra features such as (but not limited to) the ability to submit content, create a list of your own wallpapers, or post comments.",
        },
        {
          type: "p",
          text: "By creating an account, you are volunteering certain information about yourself that will be stored on our servers. This data includes at a minimum a username, password, and valid email address. Additional information may optionally be added by you to your account profile. Your profile information is public and may appear on our website, with the exception of your email address and password.",
        },
      ],
    },
    {
      heading: "Personally Identified Data",
      blocks: [
        {
          type: "p",
          text: "We strongly discourage users from entering their full name, phone number, physical address, or other sensitive information in user profiles, comments, or other areas of the site. Furthermore, we request that minors and any individuals with limited decision-making ability not create an account on this site without the approval and supervision of a guardian.",
        },
        {
          type: "p",
          text: "We make a reasonable attempt to monitor for cases where users post personally identifiable information about other individuals to public portions of the website and remove the offending material.",
        },
      ],
    },
    {
      heading: "Server Logs",
      blocks: [
        {
          type: "p",
          text: "Like most websites, halalwalls.com logs web-, database-, and other server-software usage and access information. This information may include your internet protocol (IP) address, which in many cases can be translated to an affiliation (such as your work, school, or internet service provider) or a geographical location. We only use this information for debugging purposes and for aggregating anonymous usage and traffic statistics.",
        },
      ],
    },
    {
      heading: "Cookies",
      blocks: [
        {
          type: "p",
          text: "While browsing halalwalls.com, a small number of text files referred to as 'cookies' may be created on your local file system by your web browser at the request of our servers. These files allow us to personalize the browsing experience for both registered and non-registered users. You are free to delete them at any time or configure your browser not to create them. However, we do not promise that every feature of halalwalls.com will function as expected without cookies enabled.",
        },
      ],
    },
    {
      heading: "Third-Party Advertisers",
      blocks: [
        {
          type: "p",
          text: "In order to cover the costs of providing halalwallpapers as a free resource to the public, we have relationships with many third-party advertising networks. The practices of our advertising partners are not directly covered by halalwalls.com's privacy policy. We recommend that you read their policies. For your convenience, we provide a list of our advertising partners below. Unfortunately, we cannot guarantee it is always comprehensive and up-to-date.",
        },
        { type: "p-em", text: "Google AdSense:" },
        {
          type: "p",
          text: "We present you the following information about Google and the DoubleClick DART cookie:",
        },
        {
          type: "ul",
          items: [
            "Google, as a third-party vendor, uses cookies to serve ads on your site.",
            "Google's use of the DART cookie enables it to serve ads to your users based on their visit to your sites and other sites on the Internet.",
            "Users may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy.",
          ],
        },
        { type: "p-em", text: "Tribal Fusion:" },
        {
          type: "p",
          text: "Tribal Fusion cookies do NOT collect personally identifiable information.",
        },
      ],
    },
    {
      heading: "Sharing/Selling of Data",
      blocks: [
        {
          type: "p",
          text: "halalwalls.com does not share or sell personally identifiable data with third parties such as spammers or direct marketers. We respect your privacy.",
        },
      ],
    },
    {
      heading: "Account Cancellation",
      blocks: [
        {
          type: "p",
          text: "Upon request, your halalwalls.com account can be canceled. Your user profile will no longer appear on the website, and your submissions will no longer be listed publicly for download. Any comments you have posted will still appear and include your username but will not be linked to your profile. After cancellation, you will not be available for log-in.",
        },
      ],
    },
    {
      heading: "Data Retention",
      blocks: [
        {
          type: "p",
          text: "The data submitted to and generated by this website may be copied to additional machines for redundancy and backup purposes.",
        },
        {
          type: "p",
          text: (
            <>
              For any problems or questions, don&rsquo;t hesitate to{" "}
              <Link href="/contact" className={lk}>
                contact us.
              </Link>
            </>
          ),
        },
      ],
    },
  ],
};

export default function PrivacyPage() {
  return <LegalPage content={content} />;
}
