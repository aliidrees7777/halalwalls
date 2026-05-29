import Link from "next/link";
import { MapPin, Share2, Rss, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  Product: [
    { label: "Explore", href: "/explore" },
    { label: "Community", href: "/community" },
    { label: "Add a Restaurant", href: "#" },
    { label: "Mobile App", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Resources: [
    { label: "Halal Guide", href: "#" },
    { label: "Certification FAQ", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Support", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                <MapPin className="size-4.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold">
                Halal<span className="text-emerald-500">Walls</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Discover trusted halal restaurants, read community reviews, and
              share your finds — built for Muslims who love great food.
            </p>
            <div className="mt-6 flex gap-3">
              {[Share2, Rss, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex size-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-emerald-500/50 hover:text-emerald-500"
                  aria-label="Social link"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-emerald-500"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>© 2026 HalalWalls. Demo presentation build.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
