import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import "@/components/popups.css";
import SoundEffects from "@/components/SoundEffects";
import MarketingShell from "@/components/MarketingShell";
import TooltipProvider from "@/components/TooltipProvider";
import OfflineMode from "@/components/OfflineMode";
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
    "Explore 85 college courses through 8 interest questions, 15 skill statements and 4 academic steps. See your top 5 matches and explore every course.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-beige font-sans text-navy">
        <LanguageProvider>
        <OfflineMode>
        <SoundEffects />
        <TooltipProvider />
        <MarketingShell>{children}</MarketingShell>
        </OfflineMode>
        </LanguageProvider>
      </body>
    </html>
  );
}

