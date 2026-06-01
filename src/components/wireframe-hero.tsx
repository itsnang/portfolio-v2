import Image from "next/image";
import Link from "next/link";

interface Props {
  name: string;
  isAvailable: boolean;
  abouts: string;
  imageUrl: string;
}

export function WireframeHero({ name, isAvailable, abouts, imageUrl }: Props) {
  return (
    <header
      style={{
        position: "relative",
        padding: "70px 0 40px",
        overflow: "visible",
      }}
    >
      <div
        className="wf-hero-grid"
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 28px",
          display: "grid",
          gridTemplateColumns: "1.25fr .9fr",
          gap: 40,
          alignItems: "center",
        }}
      >
        <div className="wf-reveal">
          {isAvailable && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                border: "1.5px dashed #4a7a5a",
                background: "#f0f7f2",
                padding: "3px 10px 3px 8px",
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#4a7a5a",
                  flexShrink: 0,
                }}
              />
              <span
                className="wf-m"
                style={{ fontSize: 12, color: "#4a7a5a", letterSpacing: "0.05em" }}
              >
                available for work
              </span>
            </div>
          )}
          <div className="wf-eyebrow" style={{ marginBottom: 10 }}>
            // hello world, this is
          </div>
          <h1 className="wf-h" style={{ fontSize: 84, lineHeight: 0.92 }}>
            {name}
          </h1>
          <div
            className="wf-m wf-uline"
            style={{
              fontSize: 22,
              color: "var(--wf-ink-soft)",
              marginTop: 10,
              display: "inline-block",
            }}
          >
            &ldquo;Software Developer&rdquo;
            <svg viewBox="0 0 220 14" preserveAspectRatio="none">
              <path d="M3,8 C70,2 160,12 217,5" />
            </svg>
          </div>
          <p
            className="wf-m"
            style={{
              fontSize: 16,
              color: "var(--wf-ink-soft)",
              lineHeight: 1.6,
              marginTop: 22,
              maxWidth: 440,
            }}
          >
            {abouts}
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 30, flexWrap: "wrap" }}>
            <Link href="#projects" className="wf-sketch wf-btn wf-btn-solid">
              see the work →
            </Link>
            <Link href="#contact" className="wf-sketch wf-btn">
              say hi 👋
            </Link>
          </div>
        </div>

        <div className="wf-reveal d2" style={{ position: "relative" }}>
          <div
            className="wf-sketch wf-photo"
            style={{ width: "100%", aspectRatio: "4/5", overflow: "hidden" }}
          >
            <div className="wf-tape" />
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, 45vw"
              className="object-cover"
              loading="eager"
              priority
            />
          </div>
          <div
            className="wf-note"
            style={{ top: -44, left: -120, width: 120, transform: "rotate(-6deg)" }}
          >
            real photo,
            <br />
            drawn frame
          </div>
        </div>
      </div>
    </header>
  );
}
