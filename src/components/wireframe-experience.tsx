"use client";

import { useState } from "react";
import type { IExperience } from "@/types/profile.type";
import { fmt } from "./wireframe-utils";

export function WireframeExperience({ experience }: { experience: IExperience[] }) {
  const [openXp, setOpenXp] = useState<string | null>(experience[0]?.id ?? null);

  return (
    <section style={{ padding: "84px 0" }} id="work">
      <div
        className="wf-reveal"
        style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 38 }}
      >
        <span className="wf-m" style={{ fontSize: 14, color: "var(--wf-accent)" }}>
          02
        </span>
        <h2 className="wf-h" style={{ fontSize: 40 }}>
          Work Experience
        </h2>
        <span
          className="wf-m"
          style={{ fontSize: 14, color: "var(--wf-ink-soft)", marginLeft: "auto" }}
        >
          // click a card to expand ↓
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {experience.map((xp, i) => (
          <article
            key={xp.id}
            className={`wf-sketch wf-xp wf-reveal${i === 0 ? "" : ` d${Math.min(i, 3)}`}${openXp === xp.id ? " open" : ""}`}
            style={{
              position: "relative",
              padding: "22px 26px",
              background: "var(--wf-paper-2)",
              cursor: "pointer",
            }}
            onClick={() => setOpenXp(openXp === xp.id ? null : xp.id)}
          >
            <div
              className="wf-xp-header"
              style={{ display: "flex", alignItems: "flex-start", gap: 16 }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  flexShrink: 0,
                  display: "grid",
                  placeItems: "center",
                  background: "#fff",
                  overflow: "hidden",
                  borderRadius: 0,
                  padding: xp.imageUrl ? 4 : 0,
                }}
              >
                {xp.imageUrl ? (
                  <img
                    src={xp.imageUrl}
                    alt={xp.company}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                ) : (
                  <span className="wf-h" style={{ fontSize: 22, fontWeight: 700 }}>
                    {xp.company[0]}
                  </span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0, paddingTop: 1 }}>
                <h3 className="wf-h" style={{ fontSize: 22, lineHeight: 1.12 }}>
                  {xp.company}
                </h3>
                <div className="wf-m" style={{ fontSize: 15, color: "var(--wf-ink)", marginTop: 3 }}>
                  {xp.title}
                </div>
              </div>
              <div
                className="wf-xp-meta"
                style={{ marginLeft: "auto", textAlign: "right", flexShrink: 0 }}
              >
                <div
                  className="wf-m wf-xp-date"
                  style={{ fontSize: 13, color: "var(--wf-ink-soft)", whiteSpace: "nowrap" }}
                >
                  {fmt(xp.startDate)} — {fmt(xp.endDate)}
                </div>
                <div
                  className="wf-m"
                  style={{
                    color: "var(--wf-ink-soft)",
                    fontSize: 20,
                    marginTop: 4,
                    transition: "transform .25s ease",
                    transform: openXp === xp.id ? "rotate(90deg)" : "none",
                  }}
                >
                  ›
                </div>
              </div>
            </div>
            <div
              className="wf-xp-body"
              dangerouslySetInnerHTML={{ __html: xp.description ?? "" }}
            />
          </article>
        ))}
      </div>
    </section>
  );
}
