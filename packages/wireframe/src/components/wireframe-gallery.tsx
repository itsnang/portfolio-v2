"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";

interface Props {
  images: string[];
}

// Until a photo loads its shape is unknown, so it takes a common camera shape.
const FALLBACK_RATIO = 4 / 3;
// Very tall or very wide photos are cropped a little so no row turns into a sliver.
const MIN_RATIO = 0.6;
const MAX_RATIO = 2;
// A row with only a few photos stops growing at this multiple of the target height.
const MAX_ROW_STRETCH = 1.5;

interface Box {
  width: number;
  /** The row height to aim for, from --wf-row. */
  rowHeight: number;
  gap: number;
}

// The server doesn't know the width; this is the desktop column, corrected on mount.
const INITIAL_BOX: Box = { width: 970, rowHeight: 340, gap: 16 };

/**
 * Splits photos, in order, into `rows` rows whose total widths (sum of width ÷ height)
 * are as even as possible, so every row fills the width at a similar height.
 */
function balanceRows(ratios: number[], rows: number): number[][] {
  const n = ratios.length;
  const prefix = [0];
  for (const ratio of ratios) prefix.push(prefix[prefix.length - 1] + ratio);
  const ideal = prefix[n] / rows;
  const cost = (from: number, to: number) => (prefix[to] - prefix[from] - ideal) ** 2;

  // best[k][j]: the cheapest way to put the first j photos into k rows; cut[k][j]: where its last row starts.
  const best = Array.from({ length: rows + 1 }, () => new Array<number>(n + 1).fill(Infinity));
  const cut = Array.from({ length: rows + 1 }, () => new Array<number>(n + 1).fill(0));
  best[0][0] = 0;
  for (let k = 1; k <= rows; k++) {
    for (let j = k; j <= n; j++) {
      for (let i = k - 1; i < j; i++) {
        const total = best[k - 1][i] + cost(i, j);
        if (total < best[k][j]) {
          best[k][j] = total;
          cut[k][j] = i;
        }
      }
    }
  }

  const result: number[][] = [];
  for (let k = rows, end = n; k > 0; k--) {
    const start = cut[k][end];
    result.unshift(Array.from({ length: end - start }, (_, i) => start + i));
    end = start;
  }
  return result;
}

/**
 * Balanced justified rows: each photo keeps its own shape, photos in a row share one
 * height, and every row (the last one too) fills the width. The number of rows comes
 * from the gallery's width and the target row height in CSS (--wf-row). Photos are
 * stored as URLs only, so each one's shape is read from the image once it loads.
 */
export function WireframeGallery({ images }: Props) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<Box>(INITIAL_BOX);
  const [ratios, setRatios] = useState<Record<number, number>>({});

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const measure = () => {
      const style = getComputedStyle(grid);
      const next: Box = {
        width: grid.clientWidth,
        rowHeight: parseFloat(style.getPropertyValue("--wf-row")) || INITIAL_BOX.rowHeight,
        gap: parseFloat(style.rowGap) || 0,
      };
      setBox((prev) =>
        prev.width === next.width && prev.rowHeight === next.rowHeight && prev.gap === next.gap
          ? prev
          : next
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  if (images.length === 0) return null;

  const record = (index: number, img: HTMLImageElement) => {
    if (!img.naturalWidth || !img.naturalHeight) return;
    const ratio = Math.min(MAX_RATIO, Math.max(MIN_RATIO, img.naturalWidth / img.naturalHeight));
    setRatios((prev) => (prev[index] === ratio ? prev : { ...prev, [index]: ratio }));
  };

  const shapes = images.map((_, i) => ratios[i] ?? FALLBACK_RATIO);
  const totalWidth = shapes.reduce((sum, ratio) => sum + ratio, 0) * box.rowHeight;
  const rowCount = Math.min(images.length, Math.max(1, Math.round(totalWidth / box.width)));
  const rows = balanceRows(shapes, rowCount);

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
      <div ref={gridRef} className="wf-reveal wf-gallery-grid">
        {rows.map((row) => {
          const rowRatio = row.reduce((sum, i) => sum + shapes[i], 0);
          const gaps = (row.length - 1) * box.gap;
          // Stops a short row (one or two photos) from growing taller than MAX_ROW_STRETCH allows.
          const maxWidth = rowRatio * box.rowHeight * MAX_ROW_STRETCH + gaps;
          return (
            <div key={row[0]} className="wf-gallery-row" style={{ maxWidth }}>
              {row.map((i) => (
                <div
                  key={i}
                  className="wf-sketch wf-photo wf-gallery-item"
                  style={{ "--wf-ratio": shapes[i] } as CSSProperties}
                >
                  <Image
                    src={images[i]}
                    alt={`Gallery ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1080px) 35vw, 400px"
                    // Next fires this for a photo already loaded before hydration too.
                    onLoad={(event) => record(i, event.currentTarget)}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
