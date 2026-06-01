import Image from "next/image";
import Link from "next/link";
import type { IProject } from "@/types/profile.type";
import { stripHtml } from "./wireframe-utils";

export function WireframeProjects({ projects }: { projects: IProject[] }) {
  return (
    <section style={{ padding: "84px 0" }} id="projects">
      <div
        className="wf-reveal"
        style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 38 }}
      >
        <span className="wf-m" style={{ fontSize: 14, color: "var(--wf-accent)" }}>
          03
        </span>
        <h2 className="wf-h" style={{ fontSize: 40 }}>
          Projects
        </h2>
        <span
          className="wf-m"
          style={{ fontSize: 14, color: "var(--wf-ink-soft)", marginLeft: "auto" }}
        >
          // stuff i actually built
        </span>
      </div>

      <div
        className="wf-proj-grid"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}
      >
        {projects.map((proj, i) => (
          <article
            key={proj.id}
            className={`wf-sketch wf-proj wf-reveal${i % 2 === 1 ? " d1" : ""}`}
            style={{ background: "var(--wf-paper-2)", display: "flex", flexDirection: "column" }}
          >
            <Link
              href={`/projects/${proj.id}`}
              style={{
                display: "block",
                height: 188,
                position: "relative",
                overflow: "hidden",
                borderBottom: "1.5px solid var(--wf-ink-soft)",
                textDecoration: "none",
              }}
            >
              <Image
                src={proj.thumbnail}
                alt={proj.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 540px"
                className="wf-proj-img"
              />
              <span className="wf-view-cue">open</span>
            </Link>
            <div
              style={{
                padding: "18px 20px 20px",
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <h3 className="wf-h" style={{ fontSize: 22 }}>
                <Link
                  href={`/projects/${proj.id}`}
                  style={{ color: "var(--wf-accent)", textDecoration: "none" }}
                >
                  {proj.title}
                </Link>
              </h3>
              <p
                className="wf-m"
                style={{
                  fontSize: 14,
                  color: "var(--wf-ink-soft)",
                  lineHeight: 1.5,
                  margin: "8px 0 14px",
                  flex: 1,
                }}
              >
                {stripHtml(proj.description)}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 14 }}>
                {proj.technologies?.map((t) => (
                  <span
                    key={t.name}
                    className="wf-m"
                    style={{ fontSize: 13, color: "var(--wf-ink-soft)" }}
                  >
                    {t.name}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Link
                  href={`/projects/${proj.id}`}
                  className="wf-sketch wf-btn wf-btn-solid"
                  style={{ fontSize: 14 }}
                >
                  details →
                </Link>
                {proj.href && (
                  <a
                    href={proj.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wf-sketch wf-btn"
                    style={{ fontSize: 14, color: "var(--wf-accent)" }}
                  >
                    live
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
