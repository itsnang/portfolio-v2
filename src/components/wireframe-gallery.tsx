interface Props {
  images: string[];
}

export function WireframeGallery({ images }: Props) {
  if (images.length === 0) return null;

  return (
    <section style={{ padding: "84px 0" }} id="gallery">
      <div
        className="wf-reveal"
        style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 38 }}
      >
        <span className="wf-m" style={{ fontSize: 14, color: "var(--wf-accent)" }}>
          06
        </span>
        <h2 className="wf-h" style={{ fontSize: 40 }}>
          Gallery
        </h2>
        <span
          className="wf-m"
          style={{ fontSize: 14, color: "var(--wf-ink-soft)", marginLeft: "auto" }}
        >
          // moments
        </span>
      </div>
      <div className="wf-reveal wf-gallery-grid" style={{ columnCount: 4, columnGap: 16 }}>
        {images.map((src, i) => (
          <div
            key={i}
            className="wf-sketch wf-photo"
            style={{ width: "100%", marginBottom: 16, breakInside: "avoid" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Gallery ${i + 1}`}
              style={{ display: "block", width: "100%", height: "auto" }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
