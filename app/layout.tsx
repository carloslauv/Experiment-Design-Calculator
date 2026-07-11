import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Experiment Builder — Signal through noise",
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
      <body className={openSans.variable}>
        {children}
      </body>
    </html>
  );
}
