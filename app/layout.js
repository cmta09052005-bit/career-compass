import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import "@/components/popups.css";
import SoundEffects from "@/components/SoundEffects";
import MarketingShell from "@/components/MarketingShell";
import TooltipProvider from "@/components/TooltipProvider";
import LanguageProvider from "@/components/LanguageProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata = {
  title: "Career Compass",
  description:
    "A web-based decision support system to help Senior High School students explore college courses and career paths.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-beige font-sans text-navy">
        <LanguageProvider>
        <SoundEffects />
        <TooltipProvider />
        <MarketingShell>{children}</MarketingShell>
        </LanguageProvider>
      </body>
    </html>
  );
}

