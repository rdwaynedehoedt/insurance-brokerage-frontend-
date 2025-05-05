import type { Metadata } from "next";
import { Poppins, PT_Serif } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

const ptSerif = PT_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Insurance Brokerage System",
  description: "Modern insurance brokerage management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${ptSerif.variable}`}>
      <body className="font-poppins">
        {children}
      </body>
    </html>
  );
}
