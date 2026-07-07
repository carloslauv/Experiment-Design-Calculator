import type { Metadata } from "next";
import { Newsreader, Spline_Sans_Mono } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
});

const splineSansMono = Spline_Sans_Mono({
  subsets: ["latin"],
  variable: "--font-spline",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Clearcut — Signal through noise",
  description:
    "A rigorous sample-size and readout tool for PMs and growth teams. Know how many users you need, how long it takes, and whether you heard a real signal.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${newsreader.variable} ${splineSansMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
