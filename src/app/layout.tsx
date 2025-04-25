import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lornsamnang.vercel.app/"),
  title: "Lorn Samnang",
  description:
    "I am a Software Developer, highly perceptive and very imaginative by seeking inspiration in every moment.",
  openGraph: {
    type: "website",
    url: "https://res.cloudinary.com/dnye8vqwb/image/upload/v1734708545/images/7824885_lj2gkw.jpg",
    title: "Lorn Samnang",
    description:
      "I am a Software Developer, highly perceptive and very imaginative by seeking inspiration in every moment.",
    images: [
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
        alt: "Og Image Alt",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning={true}>
      <body className={`${spaceGrotesk.className}`}>
        {children}
        <Toaster richColors theme="light" position="top-center" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
