import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ContentProvider } from "@/lib/contentContext";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Roma Film Production — Love, Captured Beautifully",
  description:
    "Premium wedding photography and cinematic filmmaking that preserves your most meaningful moments with a creative, timeless style.",
  keywords: ["wedding photography", "wedding film", "cinematic wedding", "Roma Film Production", "Dallas wedding photographer"],
  openGraph: {
    title: "Roma Film Production — Love, Captured Beautifully",
    description: "Fine art wedding photography & cinematic filmmaking. Dallas, TX & worldwide.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roma Film Production",
    description: "Love, Captured Beautifully.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${cormorant.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col antialiased bg-[var(--background)] text-[var(--foreground)] transition-colors duration-500 relative"
      >
        {/* Film grain noise — pointer-events-none, decorative only, above content visually but non-blocking */}
        <div
          aria-hidden="true"
          className="noise-overlay pointer-events-none fixed inset-0 z-[9998]"
        />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ContentProvider>
            <Navbar />
            <main className="flex-grow w-full">
              {children}
            </main>
            <Footer />
            <FloatingWhatsApp />
          </ContentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
