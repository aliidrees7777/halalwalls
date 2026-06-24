import type { ReactNode } from "react";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

/**
 * Reusable legal/policy page layout. Matches the Figma legal frames:
 * centered title #C8C3BC · bordered card #181A1B / #3A3E41 (6px radius) ·
 * blue section headings #75B2D0 · body text in soft off-white · underlined links.
 * Shared by Privacy, Terms, Disclaimer, Copyright Policy, DMCA, Content Policy.
 */
export type LegalBlock =
  | { type: "p"; text: ReactNode }
  | { type: "p-em"; text: ReactNode }
  | { type: "ul"; items: ReactNode[] }
  | { type: "ol"; items: ReactNode[] };

export interface LegalSection {
  heading?: string;
  blocks: LegalBlock[];
}

export interface LegalContent {
  title: string;
  sections: LegalSection[];
}

const bodyText = "text-[21px] leading-relaxed text-hw-content fony-medium";

function Block({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "p":
      return <p className={bodyText}>{block.text}</p>;
    case "p-em":
      return <p className={`${bodyText} italic`}>{block.text}</p>;
    case "ul":
      return (
        <ul className="list-disc space-y-1.5 pl-5">
          {block.items.map((it, i) => (
            <li key={i} className={bodyText}>
              {it}
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="list-decimal space-y-1.5 pl-5">
          {block.items.map((it, i) => (
            <li key={i} className={bodyText}>
              {it}
            </li>
          ))}
        </ol>
      );
  }
}

export function LegalPage({ content }: { content: LegalContent }) {
  return (
    <div className="flex min-h-screen flex-col bg-hw-bg">
      <SiteHeader />

      <main className="mx-auto  lg:w-[1650px] flex-1 px-4 py-10 lg:py-14">
        <h1 className="mb-6 text-center text-[40px] font-bold text-hw-content">
          {content.title}
        </h1>

        <div className="rounded-md border border-hw-line bg-hw-input p-5 sm:p-8">
          <div className="space-y-7">
            {content.sections.map((section, i) => (
              <section key={i} className="space-y-3">
                {section.heading ? (
                  <h2 className="text-[21px] font-bold text-[#75B2D0]">
                    {section.heading}
                  </h2>
                ) : null}
                {section.blocks.map((block, j) => (
                  <Block key={j} block={block} />
                ))}
              </section>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
