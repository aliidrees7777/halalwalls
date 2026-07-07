import Image from "next/image";
import Link from "next/link";
import { Send } from "lucide-react";
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
  "flex items-center gap-2 rounded-lg border border-hw-line bg-[#323639] px-4 py-2.5 text-base font-medium text-hw-fcolor transition-colors hover:bg-hw-pill2-hover hover:text-hw-foreground";

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

        <div className="flex flex-wrap items-center justify-center gap-3 md:flex hidden">
          <a href="https://play.google.com/store/apps" target="_blank" rel="noopener noreferrer" className={socialButtonClass}>
            <Image
              src="/google-play-logo.png"
              alt=""
              width={18}
              height={18}
              className="size-[18px] object-contain"
            />
            Google Play
          </a>
          <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className={socialButtonClass}>
            <Send className="size-4" />
            Telegram
          </a>
          <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className={socialButtonClass}>
            <TikTokIcon className="size-4" />
            TikTok
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className={socialButtonClass}>
            <InstagramIcon className="size-4" />
            Instagram
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
