import { generateMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@portfolio/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { architectsDaughter, caveat, spaceGrotesk } from "@portfolio/ui/fonts";
import { getAppConfig } from "@/features/app-config/queries";

export const metadata: Metadata = generateMetadata({});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getAppConfig();
  const htmlClass = config.theme === "wireframe" ? "wireframe" : "dark";

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
    <html lang="en" className={htmlClass} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${spaceGrotesk.className} ${architectsDaughter.variable} ${caveat.variable}`}
        suppressHydrationWarning
      >
        {children}
        <Toaster richColors theme="light" position="top-center" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
