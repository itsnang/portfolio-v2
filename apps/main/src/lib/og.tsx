import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Shared OpenGraph card in the site's hand-drawn wireframe style.
 *
 * Rendered by satori (via next/og), which supports only a subset of CSS —
 * every element needs an explicit `display: flex`, and there is no
 * line-clamp, so text is trimmed in JS before it reaches the layout.
 */

const OG_SIZE = { width: 1200, height: 630 };

const PAPER = "#fbfaf5";
const PAPER_2 = "#f3f1e8";
const INK = "#25252a";
const INK_SOFT = "#5b5b62";
const ACCENT = "#e2402c";

const loadFont = (file: string) =>
  readFile(join(process.cwd(), "src/app/fonts", file));

const truncate = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

interface WireframeOgOptions {
  /** Small uppercase line above the title, e.g. a date or section label. */
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  /** Pill in the top-right corner, e.g. the post's category. */
  tag?: string | null;
}

/** Builds the 1200x630 wireframe OG card as a PNG ImageResponse. */
export async function renderWireframeOgImage({
  eyebrow,
  title,
  description,
  tag,
}: WireframeOgOptions) {
  const [caveat, architectsDaughter] = await Promise.all([
    loadFont("Caveat-Bold.ttf"),
    loadFont("ArchitectsDaughter-Regular.ttf"),
  ]);

  const safeTitle = truncate(title, 110);
  const safeDescription = description ? truncate(description, 150) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: PAPER,
          fontFamily: "Architects Daughter",
          color: INK,
          border: `10px solid ${INK}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 26,
            color: INK_SOFT,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: ACCENT }}>[</span>
            <span style={{ color: INK, fontFamily: "Caveat", fontSize: 40 }}>SN</span>
            <span style={{ color: ACCENT }}>]</span>
          </div>
          {tag && (
            <div
              style={{
                display: "flex",
                padding: "8px 22px",
                borderRadius: 999,
                background: PAPER_2,
                border: `2px solid ${INK}`,
                fontSize: 24,
                color: INK,
              }}
            >
              {tag}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000 }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: ACCENT,
              marginBottom: 18,
            }}
          >
            {eyebrow ?? "// notes from the notebook"}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Caveat",
              fontSize: safeTitle.length > 60 ? 76 : 92,
              lineHeight: 1.05,
              color: INK,
            }}
          >
            {safeTitle}
          </div>
          {safeDescription && (
            <div
              style={{
                display: "flex",
                fontSize: 28,
                lineHeight: 1.5,
                color: INK_SOFT,
                marginTop: 24,
              }}
            >
              {safeDescription}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
            color: INK_SOFT,
          }}
        >
          <div style={{ display: "flex" }}>lornsamnang.com</div>
          <div style={{ display: "flex", color: INK }}>Lorn Samnang</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Caveat", data: caveat, style: "normal", weight: 700 },
        {
          name: "Architects Daughter",
          data: architectsDaughter,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
