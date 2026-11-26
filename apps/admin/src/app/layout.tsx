import type { Metadata } from "next";
import "./globals.css";
import { ColorSchemeScript } from "@portfolio/ui/color-scheme";
import { Toaster } from "@portfolio/ui/sonner";
import { hostGrotesk, jetbrainsMono } from "./fonts";

export const metadata: Metadata = {
  title: { default: "Portfolio CMS", template: "%s | Portfolio CMS" },
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body
        className={`${hostGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
