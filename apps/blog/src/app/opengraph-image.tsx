import { renderWireframeOgImage } from "@portfolio/wireframe/og";

// The Blog Site's own cover image, used by the Post list. Each Post has its own.
export const alt = "The Blog — Lorn Samnang";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderWireframeOgImage({
    eyebrow: "// notes from the notebook",
    title: "The Blog",
    description: "Write-ups on things I build, break, and learn — mostly software, sometimes not.",
    tag: null,
  });
}
