import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/context/auth-context";
import { AuthModal } from "@/components/auth/auth-modal";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "HalalWalls — Free HD & 4K Halal Wallpapers",
  description:
    "Download free Islamic, anime, gaming, and superhero wallpapers in HD and 4K resolutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full pb-[72px] font-sans antialiased md:pb-0">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <MobileBottomNav />
            <AuthModal />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
