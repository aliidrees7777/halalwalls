import type { Metadata } from "next";
import { LegalPage, type LegalContent } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Content Policy | HalalWalls" };

const lk = "underline underline-offset-2 hover:text-white";

const content: LegalContent = {
  title: "Content Policy",
  sections: [
    {
      blocks: [
        {
          type: "p",
          text: "To keep HalalWalls safe and welcoming, the following types of content are strictly prohibited. Repeated violations may lead to permanent account suspension.",
        },
      ],
    },
    {
      heading: "Explicit, Adult & Suggestive Content",
      blocks: [
        {
          type: "p",
          text: "Sexual content, nudity, exposed genitalia, sexually suggestive poses, revealing attire, or any imagery designed for sexual arousal — even if blurred or edited. This applies to all art styles, including anime and illustrations.",
        },
      ],
    },
    {
      heading: "Minors",
      blocks: [
        {
          type: "p",
          text: "Any depiction of individuals under 18 in sexual, violent, degrading, or substance-related contexts is absolutely forbidden.",
        },
      ],
    },
    {
      heading: "Violence & Gore",
      blocks: [
        {
          type: "p",
          text: "Graphic violence, gore, mutilation, self-harm, or content glorifying violent acts or terror.",
        },
      ],
    },
    {
      heading: "Weapons & Explosives",
      blocks: [
        {
          type: "p",
          text: "Instructional or promotional content related to manufacturing or use of weapons and explosives.",
        },
      ],
    },
    {
      heading: "Drugs & Alcohol",
      blocks: [
        {
          type: "p",
          text: "Imagery depicting, encouraging, or normalizing illegal substance use or excessive alcohol consumption.",
        },
      ],
    },
    {
      heading: "Hate & Discrimination",
      blocks: [
        {
          type: "p",
          text: "Content targeting any group based on race, gender, religion, nationality, disability, or orientation.",
        },
      ],
    },
    {
      heading: "Gambling",
      blocks: [
        {
          type: "p",
          text: "Ads or promotions for casinos, betting platforms, bonus codes, or gambling services.",
        },
      ],
    },
    {
      heading: "Copyright & Intellectual Property",
      blocks: [
        {
          type: "p",
          text: "Uploading copyrighted characters, logos, trademarks, or artwork without proper authorization is prohibited. Users who repeatedly infringe on intellectual property rights will have their upload access permanently revoked. If you are a copyright holder and believe your work has been uploaded without permission, please report it to us, and we will take appropriate action under applicable laws, including DMCA.",
        },
      ],
    },
    {
      heading: "Stock Images",
      blocks: [
        {
          type: "p",
          text: "Images sourced from stock photography or paid image libraries without proper distribution rights.",
        },
      ],
    },
    {
      heading: "Harassment",
      blocks: [
        {
          type: "p",
          text: "Wallpapers designed to bully, insult, or humiliate, including offensive text or symbols.",
        },
      ],
    },
    {
      heading: "Extremism & Terrorism",
      blocks: [
        {
          type: "p",
          text: "Content promoting or glorifying terrorist organizations, extremist ideologies, or radical movements.",
        },
      ],
    },
    {
      heading: "Personal Data",
      blocks: [
        {
          type: "p",
          text: "Exposing private information — names, addresses, contacts, or photos used without consent.",
        },
      ],
    },
    {
      heading: "Low Quality",
      blocks: [
        {
          type: "p",
          text: "Blurry, pixelated, poorly cropped, or wallpapers that don't meet HalalWalls' quality standards.",
        },
      ],
    },
    {
      blocks: [
        {
          type: "p-em",
          text: "These guidelines may be updated at any time. HalalWalls reserves the right to remove any content at its sole discretion.",
        },
        {
          type: "p-em",
          text: (
            <>
              Found something that violates these guidelines? Report it directly through
              the app or email us at{" "}
              <a href="mailto:contact@halalwalls.com" className={lk}>
                contact@halalwalls.com
              </a>
              .
            </>
          ),
        },
      ],
    },
  ],
};

export default function ContentPolicyPage() {
  return <LegalPage content={content} />;
}
