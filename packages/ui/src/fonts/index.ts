import localFont from "next/font/local";

// Self-hosted (latin subset, SIL Open Font License) so builds don't download
// from Google Fonts: a Google outage used to fail the deploy.

export const architectsDaughter = localFont({
  src: "./ArchitectsDaughter-Regular.woff2",
  weight: "400",
  variable: "--font-architects-daughter",
  display: "swap",
});

export const caveat = localFont({
  src: "./Caveat-Variable.woff2",
  weight: "400 700",
  variable: "--font-caveat",
  display: "swap",
});

export const spaceGrotesk = localFont({
  src: "./SpaceGrotesk-Variable.woff2",
  weight: "400 700",
  variable: "--font-space-grotesk",
  display: "swap",
  preload: true,
  fallback: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
});
