import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { architectsDaughter, caveat, spaceGrotesk } from "@portfolio/ui/fonts";
import { MaintenanceBanner } from "@/components/maintenance-banner";
import { getAppConfig } from "@/lib/queries";
import { blogUrl } from "@/lib/site-urls";

export const metadata: Metadata = {
  metadataBase: new URL(blogUrl),
  title: { default: "Blog | Lorn Samnang", template: "%s | Lorn Samnang" },
  description: "Write-ups on things I build, break, and learn — mostly software, sometimes not.",
  // Kept out of search results until the Blog Site replaces the Main Site's /blog.
  robots: { index: false, follow: false },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
