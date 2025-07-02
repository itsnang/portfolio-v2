import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Space_Grotesk } from "next/font/google";
import { ReactQueryProvider } from "@/providers/react-query-provider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lornsamnang.com/"),
  title: "Lorn Samnang | Software Developer",
  description:
    "Passionate and imaginative Software Developer who draws inspiration from every moment. Focused on crafting meaningful digital experiences.",
  keywords: [
    "Lorn Samnang",
    "Software Developer",
    "Web Development",
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "Portfolio",
    "Full Stack Developer",
  ],
  authors: [{ name: "Lorn Samnang" }],
  creator: "Lorn Samnang",
  publisher: "Lorn Samnang",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "https://lornsamnang.com/",
    siteName: "Lorn Samnang",
    title: "Lorn Samnang | Software Developer",
    description:
      "Passionate and imaginative Software Developer who draws inspiration from every moment. Focused on crafting meaningful digital experiences.",
    locale: "en_US",
    images: [
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
        alt: "Lorn Samnang Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lorn Samnang | Software Developer",
    description:
      "Passionate and imaginative Software Developer who draws inspiration from every moment. Focused on crafting meaningful digital experiences.",
    creator: "@lornsamnang",
    images: ["/favicon.ico"],
  },
  verification: {
    google: "your-google-site-verification", // Add your Google Search Console verification code
  },
  alternates: {
    canonical: "https://lornsamnang.com/",
  },
  category: "technology",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Portfolio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${spaceGrotesk.className}`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster richColors theme="light" position="top-center" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
