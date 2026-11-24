import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { architectsDaughter, caveat, spaceGrotesk } from "@portfolio/ui/fonts";
import { MaintenanceBanner } from "@portfolio/ui/maintenance-banner";
import { getAppConfig } from "@/lib/queries";
import { siteMetadata } from "@/lib/metadata";
import { preconnect } from "react-dom";
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
  const htmlClass = config.theme === "wireframe" ? "wireframe" : "dark";

  return (
    <html lang="en" className={htmlClass} suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.className} ${architectsDaughter.variable} ${caveat.variable}`}
        suppressHydrationWarning
      >
        {config.maintenance && <MaintenanceBanner />}
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
