import type { IEducation, IRecommendation } from "@/types/profile.type";
import { fmt } from "./wireframe-utils";

interface Props {
  education: IEducation[];
  recommendations: IRecommendation[];
}

export function WireframeEducation({ education, recommendations }: Props) {
  return (
    <section style={{ padding: "84px 0" }} id="edu">
      <div
        className="wf-reveal"
        style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 38 }}
      >
        <span className="wf-m" style={{ fontSize: 14, color: "var(--wf-accent)" }}>
          05
        </span>
        <h2 className="wf-h" style={{ fontSize: 40 }}>
          Education &amp; Kind Words
        </h2>
      </div>

      <div
        className="wf-edu-grid"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, alignItems: "start" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {education.map((edu, i) => (
            <a
              key={edu.id}
              href={edu.href ?? "#"}
              target={edu.href ? "_blank" : undefined}
              rel="noopener noreferrer"
              className={`wf-sketch wf-edu-card wf-reveal${i > 0 ? " d1" : ""}`}
              style={{
                background: "var(--wf-paper-2)",
                padding: "22px 24px",
                position: "relative",
                textDecoration: "none",
                color: "var(--wf-ink)",
                display: "block",
              }}
            >
              <h3 className="wf-h" style={{ fontSize: 21 }}>
                {edu.school}
              </h3>
              <div
                className="wf-m"
                style={{ fontSize: 14, color: "var(--wf-ink-soft)", marginTop: 4 }}
              >
                {edu.degree}
              </div>
              <div
                className="wf-m"
                style={{ fontSize: 13, color: "var(--wf-accent)", marginTop: 8 }}
              >
                {fmt(edu.startDate)} — {fmt(edu.endDate)}
              </div>
            </a>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {recommendations.map((rec, i) => (
            <div
              key={rec.id}
              className={`wf-sketch wf-quote wf-reveal d${Math.min(i + 2, 3)}`}
              style={{ background: "var(--wf-paper-2)", padding: "30px 34px", position: "relative" }}
            >
              <div
                className="wf-h"
                style={{
                  fontSize: 74,
                  color: "var(--wf-accent)",
                  lineHeight: 0.5,
                  position: "absolute",
                  top: 24,
                  left: 20,
                  opacity: 0.5,
                }}
              >
                &ldquo;
              </div>
              <p
                className="wf-m"
                style={{
                  fontSize: 17,
                  lineHeight: 1.6,
                  color: "var(--wf-ink)",
                  margin: "0 0 16px",
                  paddingLeft: 30,
                }}
              >
                {rec.recommendationText}
              </p>
              <div
                style={{ display: "flex", alignItems: "center", gap: 12, paddingLeft: 30 }}
              >
                <div
                  className="wf-sketch wf-badge"
                  style={{
                    width: 42,
                    height: 42,
                    flexShrink: 0,
                    display: "grid",
                    placeItems: "center",
                    background: "var(--wf-paper-2)",
                  }}
                >
                  <span className="wf-h" style={{ fontSize: 16, fontWeight: 700 }}>
                    {rec.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                </div>
                <div>
                  <div className="wf-h" style={{ fontSize: 19, fontWeight: 700 }}>
                    {rec.name}
                  </div>
                  <div
                    className="wf-m"
                    style={{ fontSize: 12, color: "var(--wf-ink-soft)", maxWidth: 280, lineHeight: 1.35 }}
                  >
                    {rec.position}
                  </div>
                </div>
              </div>
              {i === 0 && (
                <div
                  className="wf-note"
                  style={{ top: -18, right: 18, transform: "rotate(4deg)" }}
                >
                  real reference ✓
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
