import { generateMetadata } from "@/lib/metadata";
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

export const metadata: Metadata = generateMetadata({});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Lorn Samnang",
    url: "https://lornsamnang.com",
    sameAs: [
      "https://www.linkedin.com/in/lorn-samnang/",
      "https://github.com/lorn-samnang",
      "https://twitter.com/lornsamnang",
    ],
    jobTitle: "Software Developer",
    worksFor: {
      "@type": "Organization",
      name: "Self-Employed",
    },
  };

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${spaceGrotesk.className}`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster richColors theme="light" position="top-center" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
