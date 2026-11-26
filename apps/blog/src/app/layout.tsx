import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { architectsDaughter, caveat, spaceGrotesk } from "@portfolio/ui/fonts";
import { MaintenanceBanner } from "@portfolio/ui/maintenance-banner";
import { getAppConfig } from "@/lib/queries";
import { siteMetadata } from "@/lib/metadata";
import { preconnect } from "react-dom";
import { ColorSchemeScript } from "@portfolio/ui/color-scheme";
import { ColorSchemeToggle } from "@portfolio/ui/color-scheme-toggle";
import { mainUrl } from "@/lib/site-urls";

export const metadata: Metadata = siteMetadata;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Crossing to the Main Site is a full page load; open the connection early.
  preconnect(mainUrl);
  const config = await getAppConfig();
  const theme = config.theme === "wireframe" ? "wireframe" : "modern";

  return (
    <html lang="en" className={theme === "wireframe" ? "wireframe" : undefined} suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body
        className={`${spaceGrotesk.className} ${architectsDaughter.variable} ${caveat.variable}`}
        suppressHydrationWarning
      >
        {config.maintenance && <MaintenanceBanner />}
        <ColorSchemeToggle variant={theme} />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
