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
        <div className="wf-reveal wf-fx wf-hero-left">
          {isAvailable && (
            <div
              className="wf-hero-badge"
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
          <div className="wf-eyebrow wf-hero-eyebrow" style={{ marginBottom: 10 }}>
            // hello world, this is
          </div>
          <h1 className="wf-h wf-hero-name" style={{ fontSize: 84, lineHeight: 0.92 }}>
            {name.split(" ").map((word, i, words) => (
              <span
                key={i}
                className="wf-hero-word-mask"
                style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}
              >
                <span className="wf-hero-word" style={{ display: "inline-block" }}>
                  {word}
                  {i < words.length - 1 ? " " : ""}
                </span>
              </span>
            ))}
          </h1>
          <div
            className="wf-m wf-uline wf-hero-tagline"
            style={{
              fontSize: 22,
              color: "var(--wf-ink-soft)",
              marginTop: 10,
              display: "inline-block",
            }}
          >
            &ldquo;builds for the web&rdquo;
            <svg viewBox="0 0 220 14" preserveAspectRatio="none">
              <path d="M3,8 C70,2 160,12 217,5" className="wf-uline-path" pathLength={1} />
            </svg>
          </div>
          <p
            className="wf-m wf-hero-about"
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
          <div className="wf-hero-cta" style={{ display: "flex", gap: 14, marginTop: 30, flexWrap: "wrap" }}>
            <Link href="#projects" className="wf-sketch wf-btn wf-btn-solid">
              <div className="wf-edge" />
              see the work →
            </Link>
            <Link href="#contact" className="wf-sketch wf-btn">
              <div className="wf-edge" />
              say hi 👋
            </Link>
          </div>
        </div>

        <div className="wf-reveal wf-fx wf-hero-photo-col" style={{ position: "relative" }}>
          <div
            className="wf-sketch wf-photo"
            style={{ width: "100%", aspectRatio: "4/5" }}
          >
            <div className="wf-tape" />
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, 45vw"
              className="object-cover"
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
