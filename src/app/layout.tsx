import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ScrollProgress from "@/components/ui/scroll-progress";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
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
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ScrollProgress />
        {children}
        <Toaster richColors theme="light" position="top-center" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
