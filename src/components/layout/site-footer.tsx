import Image from "next/image";
import Link from "next/link";
import playstore from "../../../public/authicon/playstore.svg";
import tiktok from "../../../public/authicon/tiktok.svg";
import insta from "../../../public/authicon/insta.svg";
import ncn from "../../../public/authicon/ncn.svg";
const footerLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Copyright Policy", href: "/copyright-policy" },
  { label: "DMCA", href: "/dmca" },
  { label: "Content Policy", href: "/content-policy" },
  { label: "Contact Us", href: "/contact" },
];

const socialButtonClass =
  "flex h-9 items-center gap-1.5 rounded-[5px] bg-[#323639] px-[18px] text-[15px] font-medium text-[#A8A299] transition-colors hover:bg-hw-pill2-hover hover:text-white";

function PlayStoreIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="11 10 12.6 14.2"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M19.0951 16.6469L13.1523 10.6882L20.7133 15.0287L19.0951 16.6469ZM11.6018 10.3379C11.2515 10.521 11.0176 10.8549 11.0176 11.2883V23.1709C11.0176 23.6043 11.2519 23.9382 11.6018 24.1213L18.5114 17.2281L11.6018 10.3379ZM23.0505 16.4125L21.4647 15.4944L19.6957 17.2311L21.4647 18.9678L23.0828 18.0497C23.5675 17.6649 23.5675 16.7977 23.0505 16.4125ZM13.1527 23.7745L20.7137 19.4339L19.0956 17.8157L13.1527 23.7745Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function NcnIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="5 12.8 24 8.6"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M7.20438 16.6907V20.7295H5.54884V13.3341L11.1659 17.7186V13.6798H12.8214V21.0706L7.20438 16.6907ZM14.2064 13.6798H20.6421V15.067H15.0296V19.3423H20.6421V20.7295H14.2064C13.976 20.7295 13.7789 20.6476 13.6152 20.4839C13.4514 20.3202 13.3696 20.1231 13.3696 19.8926V14.5167C13.3696 14.2892 13.4514 14.0937 13.6152 13.9299C13.7789 13.7632 13.976 13.6798 14.2064 13.6798ZM22.8458 16.6907V20.7295H21.1903V13.3341L26.8073 17.7186V13.6798H28.4628V21.0706L22.8458 16.6907Z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.18 8.18 0 0 0 4.77 1.52V6.88a4.85 4.85 0 0 1-1.01-.19z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t-[var(--lp-footer-border)] border-hw-line bg-hw-footer px-4 py-8 lg:px-0">
      <div className="lp-container flex flex-col items-center gap-4">
        <nav
          className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-center  text-hw-muted"
          aria-label="Footer"
        >
          {footerLinks.map((link, i) => (
            <span key={link.label} className="flex items-center">
              {i > 0 && (
                <span className="mx-2 text-hw-line" aria-hidden>
                  |
                </span>
              )}
              <Link
                href={link.href}
                className="text-[12px] font-medium text-hw-foreground transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </nav>

        <div className="flex flex-wrap items-center justify-center gap-2 md:flex hidden">
          <a href="https://play.google.com/store/apps" target="_blank" rel="noopener noreferrer" className={socialButtonClass}>
            <PlayStoreIcon className="size-3.5" />
            Google Play
          </a>
          <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className={socialButtonClass}>
            <TikTokIcon className="size-3.5" />
            TikTok
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className={socialButtonClass}>
            <InstagramIcon className="size-3.5" />
            Instagram
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className={socialButtonClass} aria-label="NCN">
            <NcnIcon className="h-3.5 w-auto" />
          </a>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 md:hidden ">
          <Image src={playstore} alt="playstore" />
          <Image src={tiktok} alt="playstore" />
          <Image src={insta} alt="playstore" />
          <Image src={ncn} alt="playstore" />
        </div>
        <p className="text-center text-[12px] font-medium text-hw-foreground">
          © 2026 HalalWalls.com
        </p>
      </div>
    </footer>
  );
}
