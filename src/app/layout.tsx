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
  metadataBase: new URL("https://lornsamnang.vercel.app/"),
  title: "Lorn Samnang | Software Developer",
  description:
    "Passionate and imaginative Software Developer who draws inspiration from every moment. Focused on crafting meaningful digital experiences.",
  openGraph: {
    type: "website",
    url: "https://lornsamnang.vercel.app/",
    siteName: "Lorn Samnang",
    title: "Lorn Samnang | Software Developer",
    description:
      "Passionate and imaginative Software Developer who draws inspiration from every moment. Focused on crafting meaningful digital experiences.",
    images: [
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
        alt: "Lorn Samnang Portfolio",
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
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster richColors theme="light" position="top-center" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
