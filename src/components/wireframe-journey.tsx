import { achievements } from "@/data/achievement";

const sorted = [...achievements].sort((a, b) => Number(a.year) - Number(b.year));

export function WireframeJourney() {
  return (
    <section style={{ padding: "84px 0" }}>
      <div
        className="wf-reveal"
        style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 48 }}
      >
        <span className="wf-m" style={{ fontSize: 14, color: "var(--wf-accent)" }}>
          04
        </span>
        <h2 className="wf-h" style={{ fontSize: 40 }}>
          The Journey
        </h2>
        <span
          className="wf-m"
          style={{ fontSize: 14, color: "var(--wf-ink-soft)", marginLeft: "auto" }}
        >
          // every milestone counts
        </span>
      </div>

      <div className="wf-vtimeline">
        <div className="wf-vtroad" />
        {sorted.map((a, i) => (
          <div
            key={a.id}
            className={`wf-vt-item wf-reveal${i > 0 ? ` d${Math.min(i, 3)}` : ""}`}
          >
            <div className={`wf-vt-dot wf-vt-dot--${a.category.toLowerCase()}`} />
            <div className="wf-sketch wf-stack wf-vt-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 8,
                }}
              >
                <span className="wf-vt-year">{a.year}</span>
                <span className="wf-vt-cat">{a.category}</span>
              </div>
              <h3 className="wf-vt-title">{a.title}</h3>
              <p className="wf-vt-desc">{a.description}</p>
              {a.links && a.links.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  {a.links.map((link, j) => (
                    <a
                      key={j}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="wf-sketch wf-btn"
                      style={{ fontSize: 13 }}
                    >
                      {link.title} →
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
