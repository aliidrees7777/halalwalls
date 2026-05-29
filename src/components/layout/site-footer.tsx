import Image from "next/image";
import Link from "next/link";
import { Send } from "lucide-react";

const footerLinks = [
  "Privacy Policy",
  "Terms of Service",
  "Disclaimer",
  "Copyright Policy",
  "DMCA",
  "Content Policy",
  "Contact Us",
];

const socialButtonClass =
  "flex items-center gap-2 rounded-lg bg-[#262626] px-4 py-2.5 text-sm text-hw-muted transition-colors hover:bg-[#333333] hover:text-hw-foreground";

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
    <footer className="bg-hw-sidebar px-4 py-12 lg:px-6">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-6">
        <nav
          className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-center text-[13px] text-hw-muted"
          aria-label="Footer"
        >
          {footerLinks.map((link, i) => (
            <span key={link} className="flex items-center">
              {i > 0 && (
                <span className="mx-2 text-[#3a3f3d]" aria-hidden>
                  |
                </span>
              )}
              <Link
                href="#"
                className="transition-colors hover:text-hw-foreground"
              >
                {link}
              </Link>
            </span>
          ))}
        </nav>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="#" className={socialButtonClass}>
            <Image
              src="/google-play-logo.png"
              alt=""
              width={18}
              height={18}
              className="size-[18px] object-contain"
            />
            Google Play
          </Link>
          <Link href="#" className={socialButtonClass}>
            <Send className="size-4" />
            Telegram
          </Link>
          <Link href="#" className={socialButtonClass}>
            <TikTokIcon className="size-4" />
            TikTok
          </Link>
          <Link href="#" className={socialButtonClass}>
            <InstagramIcon className="size-4" />
            Instagram
          </Link>
        </div>

        <p className="text-center text-[13px] text-hw-muted">
          © 2026 HalalWalls.com
        </p>
      </div>
    </footer>
  );
}
