import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { BRAND } from "@/lib/brand";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], weight: ["500", "600", "700", "800"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: `${BRAND.name} — your exchange, sorted`, template: `%s · ${BRAND.name}` },
  description: "Prep checklists, weekend adventures and your semester crew — one starting point for incoming exchange students.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable} antialiased`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
