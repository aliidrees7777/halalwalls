import type { ReactNode } from "react";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { cn } from "@/lib/utils";

/**
 * Reusable legal/policy page layout. Matches the Figma legal frames:
 * Light: page white · content box #EEEEEE · title black · headings #30A6E0 · body black.
 * Dark: title/body #C8C3BC · card #181A1B / border #3A3E41 · headings #75B2D0.
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

interface LegalPageProps {
  content: LegalContent;
  /** Optional overrides — e.g. mobile Figma typography for a specific page. */
  titleClassName?: string;
  headingClassName?: string;
  bodyClassName?: string;
  pageClassName?: string;
  mainClassName?: string;
  cardClassName?: string;
  stackClassName?: string;
}

/** Mobile type matching Terms of Use. Desktop restored at md. */
export const legalMobileFigmaProps = {
  titleClassName:
    "text-[28px] font-bold leading-[34px] dark:text-white md:text-[40px] md:leading-none md:dark:text-[#C8C3B2]",
  headingClassName:
    "text-[16px] font-bold leading-[26px] md:text-[21px] md:leading-none",
  bodyClassName:
    "text-[16px] font-normal leading-[26px] md:text-[21px] md:font-medium md:leading-relaxed",
} as const;

const bodyText =
  "text-[21px] leading-relaxed text-black fony-medium dark:text-[#C8C3B2]";

function Block({
  block,
  className,
}: {
  block: LegalBlock;
  className?: string;
}) {
  const textClass = cn(bodyText, className);
  switch (block.type) {
    case "p":
      return <p className={textClass}>{block.text}</p>;
    case "p-em":
      return <p className={cn(textClass, "italic")}>{block.text}</p>;
    case "ul":
      return (
        <ul className="list-disc space-y-1.5 pl-5">
          {block.items.map((it, i) => (
            <li key={i} className={textClass}>
              {it}
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="list-decimal space-y-1.5 pl-5">
          {block.items.map((it, i) => (
            <li key={i} className={textClass}>
              {it}
            </li>
          ))}
        </ol>
      );
  }
}

export function LegalPage({
  content,
  titleClassName,
  headingClassName,
  bodyClassName,
  pageClassName,
  mainClassName,
  cardClassName,
  stackClassName,
}: LegalPageProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col bg-white dark:bg-hw-bg",
        pageClassName,
      )}
    >
      <SiteHeader />

      <main
        className={cn(
          "mx-auto flex-1 px-4 py-10 lg:w-[1650px] lg:py-14",
          mainClassName,
        )}
      >
        <h1
          className={cn(
            "mb-6 text-center text-[40px] font-bold text-black dark:text-[#C8C3B2]",
            titleClassName,
          )}
        >
          {content.title}
        </h1>

        <div
          className={cn(
            "rounded-md border border-hw-line bg-[#EEEEEE] p-5 sm:p-8 dark:bg-[#181A1B]",
            cardClassName,
          )}
        >
          <div className={cn("space-y-7", stackClassName)}>
            {content.sections.map((section, i) => (
              <section key={i} className="space-y-2 md:space-y-3">
                {section.heading ? (
                  <h2
                    className={cn(
                      "mb-0 text-[21px] font-bold text-[#30A6E0] dark:text-[#75B2D0] md:mb-0",
                      headingClassName,
                    )}
                  >
                    {section.heading}
                  </h2>
                ) : null}
                {section.blocks.map((block, j) => (
                  <Block key={j} block={block} className={bodyClassName} />
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
