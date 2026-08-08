import Image from "next/image";
import type { ISocial } from "@/types/profile.type";

export function WireframeFooter({ socials }: { socials: ISocial[] }) {
  return (
    <footer
      id="contact"
      style={{
        borderTop: "2px solid var(--wf-ink)",
        padding: "46px 0 60px",
        marginTop: 40,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: -2,
          height: 3,
          background: "var(--wf-ink)",
          filter: "url(#wobble)",
        }}
      />
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 28px",
          textAlign: "center",
        }}
      >
        <div className="wf-eyebrow wf-reveal" style={{ marginBottom: 10 }}>
          // let&apos;s talk
        </div>
        <h2 className="wf-h wf-reveal" style={{ fontSize: 52 }}>
          Let&apos;s build something
        </h2>
        <p
          className="wf-m wf-reveal"
          style={{
            fontSize: 16,
            color: "var(--wf-ink-soft)",
            margin: "12px auto 26px",
            maxWidth: 420,
          }}
        >
          Open to new projects, collabs, or just talking shop.
        </p>
        <div
          className="wf-reveal"
          style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}
        >
          {socials.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="wf-btn"
              style={{ display: "inline-flex", alignItems: "center", gap: 7 }}
            >
              {social.icon && (
                <Image
                  src={social.icon}
                  alt={social.name}
                  width={16}
                  height={16}
                  style={{ objectFit: "contain", flexShrink: 0 }}
                />
              )}
              {social.name}
            </a>
          ))}
        </div>
        <div
          className="wf-note"
          style={{
            position: "static",
            display: "inline-block",
            marginTop: 34,
            transform: "rotate(-2deg)",
            color: "var(--wf-ink-faint)",
          }}
        >
          drawn by hand · built to click · © Lorn Samnang 2026
        </div>
      </div>
    </footer>
  );
}
