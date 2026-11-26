"use client";

import { useState, type CSSProperties } from "react";

interface Props {
  images: string[];
}

// Until a photo loads its shape is unknown, so it takes a common camera shape.
const FALLBACK_RATIO = 4 / 3;
// Very tall or very wide photos are cropped a little so no row turns into a sliver.
const MIN_RATIO = 0.6;
const MAX_RATIO = 2;

/**
 * Justified rows: each photo keeps its own shape, every row fills the full width,
 * and photos in a row share one height. The layout itself is CSS (.wf-gallery-grid):
 * each photo only needs its width ÷ height, read from the image once it loads.
 */
export function WireframeGallery({ images }: Props) {
  const [ratios, setRatios] = useState<Record<number, number>>({});

  if (images.length === 0) return null;

  const record = (index: number, img: HTMLImageElement) => {
    if (!img.naturalWidth || !img.naturalHeight) return;
    const ratio = Math.min(MAX_RATIO, Math.max(MIN_RATIO, img.naturalWidth / img.naturalHeight));
    setRatios((prev) => (prev[index] === ratio ? prev : { ...prev, [index]: ratio }));
  };

  return (
    <section className="wf-section" id="gallery">
      <div
        className="wf-reveal wf-section-head"
        style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 38 }}
      >
        <span className="wf-m" style={{ fontSize: 14, color: "var(--wf-accent)" }}>
          07
        </span>
        <h2 className="wf-h" style={{ fontSize: "clamp(26px, 5vw, 40px)" }}>
          Gallery
        </h2>
        <span
          className="wf-m wf-section-hint"
          style={{ fontSize: 14, color: "var(--wf-ink-soft)" }}
        >
          // moments
        </span>
      </div>
      <div className="wf-reveal wf-gallery-grid">
        {images.map((src, i) => (
          <div
            key={i}
            className="wf-sketch wf-photo wf-gallery-item"
            style={{ "--wf-ratio": ratios[i] ?? FALLBACK_RATIO } as CSSProperties}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Gallery ${i + 1}`}
              decoding="async"
              // A cached photo can finish loading before React attaches onLoad.
              ref={(img) => {
                if (img?.complete) record(i, img);
              }}
              onLoad={(event) => record(i, event.currentTarget)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
