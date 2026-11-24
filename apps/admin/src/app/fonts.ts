import localFont from "next/font/local";

// The Admin Site's own pairing: Host Grotesk for text, JetBrains Mono for counts and code.
// Self-hosted (latin subset, SIL Open Font License) so builds never download fonts.

export const hostGrotesk = localFont({
  src: "./fonts/HostGrotesk-Variable.woff2",
  weight: "400 700",
  variable: "--font-host-grotesk",
  display: "swap",
});

export const jetbrainsMono = localFont({
  src: "./fonts/JetBrainsMono-Variable.woff2",
  weight: "400 500",
  variable: "--font-jetbrains-mono",
  display: "swap",
});
