import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@portfolio/ui/sonner";
import { architectsDaughter, caveat, spaceGrotesk } from "@portfolio/ui/fonts";

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
      <body
        className={`${spaceGrotesk.className} ${architectsDaughter.variable} ${caveat.variable}`}
        suppressHydrationWarning
      >
        {children}
        <Toaster richColors theme="light" position="top-center" />
      </body>
    </html>
  );
}
