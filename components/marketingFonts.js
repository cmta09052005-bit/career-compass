import { Poppins, Montserrat } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: "700", variable: "--story-heading", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: "600", variable: "--story-label", display: "swap" });

export const marketingFonts = `${poppins.variable} ${montserrat.variable}`;
