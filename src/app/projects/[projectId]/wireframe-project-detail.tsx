"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProjectLinks, ProjectTechnology } from "@/types/profile.type";

interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  href: string | null;
  technologies: ProjectTechnology[];
  links: ProjectLinks[] | null;
  detailImage: string[] | null;
  number: number;
  total: number;
  prev: { id: string; title: string };
  next: { id: string; title: string };
}

/** Split TipTap HTML into overview paragraphs + list items */
function parseDescription(html: string) {
  if (typeof window === "undefined") return { overview: html, features: [] as string[] };
  const doc = new DOMParser().parseFromString(html, "text/html");
  const features: string[] = [];
  doc.querySelectorAll("li").forEach((li) => {
    const text = li.textContent?.trim();
    if (text) features.push(text);
    li.closest("ol, ul")?.remove();
  });
  const overview = doc.body.innerHTML.replace(/<p>\s*<\/p>/g, "").trim();
  return { overview, features };
}

function paintEdges(root: HTMLElement) {
  root
    .querySelectorAll(".wf-sketch, .wf-photo, .wf-chip, .wf-btn, .wf-stack, .wf-xbox")
    .forEach((el) => {
      if (!el.querySelector(":scope > .wf-edge")) {
        const edge = document.createElement("div");
        edge.className = "wf-edge";
        el.insertBefore(edge, el.firstChild);
      }
    });
}

function observeReveals(root: HTMLElement) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
    { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
  );
  root.querySelectorAll(".wf-reveal").forEach((el) => io.observe(el));
  return io;
}

const WOBBLE = (
  <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
    <defs>
      <filter id="wobble">
        <feTurbulence type="fractalNoise" baseFrequency="0.014 0.022" numOctaves={2} seed={7} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={3} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
);

const CHECK_SVG = (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ position: "absolute", left: 0, top: 10, width: 22, height: 22 }}>
    <path d="M4,13 L10,19 L21,5" fill="none" stroke="#e2402c" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "url(#wobble)" }} />
  </svg>
);

export function WireframeProjectDetail({ project }: { project: Project }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    paintEdges(rootRef.current);
    const io = observeReveals(rootRef.current);
    return () => io.disconnect();
  }, []);

  const { overview, features } = parseDescription(project.description);
  const num = String(project.number).padStart(2, "0");
  const total = String(project.total).padStart(2, "0");

  return (
    <div className="sketch-page" ref={rootRef}>
      {WOBBLE}

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(251,250,245,.9)", backdropFilter: "blur(4px)", borderBottom: "2px solid var(--wf-ink)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62 }}>
          <Link href="/" className="wf-h" style={{ fontSize: 24, fontWeight: 700, textDecoration: "none", color: "var(--wf-ink)" }}>
            SN
          </Link>
          <Link href="/#projects" className="wf-m" style={{ fontSize: 15, color: "var(--wf-ink-soft)", textDecoration: "none" }}>
            ← back
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "26px 28px 0" }}>
        <Link href="/#projects" className="wf-m" style={{ fontSize: 15, color: "var(--wf-ink-soft)", textDecoration: "none", display: "inline-flex", gap: 8, alignItems: "center" }}>
          ← back to projects
        </Link>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 28px" }}>

        {/* Hero */}
        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 48, alignItems: "center", padding: "28px 0 30px", position: "relative" }}>
          <div className="wf-reveal">
            <div className="wf-region">project {num} / {total}</div>
            <h1 className="wf-h" style={{ fontSize: 58, lineHeight: 0.95, marginTop: 10 }}>
              {project.title}
            </h1>
            {project.href && (
              <p className="wf-m" style={{ fontSize: 16, color: "var(--wf-ink-soft)", marginTop: 10 }}>
                {project.href}
              </p>
            )}
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 22 }}>
              <div className="wf-m" style={{ fontSize: 13 }}>
                <b style={{ display: "block", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--wf-ink-soft)", marginBottom: 3 }}>Role</b>
                Solo Build
              </div>
              <div className="wf-m" style={{ fontSize: 13 }}>
                <b style={{ display: "block", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--wf-ink-soft)", marginBottom: 3 }}>Type</b>
                {project.technologies[0]?.name ? "Full-Stack" : "Project"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 26, flexWrap: "wrap" }}>
              {project.links?.map((link, i) => (
                <a key={i} href={link.href} target="_blank" rel="noopener noreferrer"
                  className={`wf-sketch wf-btn ${i === 0 ? "wf-btn-solid" : ""}`}>
                  {link.type} →
                </a>
              ))}
              {project.href && !project.links?.length && (
                <a href={project.href} target="_blank" rel="noopener noreferrer" className="wf-sketch wf-btn wf-btn-solid">
                  live site →
                </a>
              )}
            </div>
          </div>

          <div className="wf-reveal d2" style={{ position: "relative" }}>
            <div className="wf-sketch wf-photo" style={{ width: "100%", aspectRatio: "4/3" }}>
              <div className="wf-tape" />
              <Image src={project.thumbnail} alt={project.title} fill className="object-cover" />
            </div>
            <div className="wf-note" style={{ top: -26, right: -10, transform: "rotate(5deg)" }}>
              the real thing ↗
            </div>
          </div>
        </div>

        <hr className="wf-divider" style={{ margin: "30px 0 50px" }} />

        {/* Body */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr .9fr", gap: 48, alignItems: "start" }}>
          <div className="wf-reveal">
            {/* The idea */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 14 }}>
              <span style={{ color: "var(--wf-accent)", fontFamily: "var(--wf-marker)", fontSize: 14 }}>//</span>
              <h2 className="wf-h" style={{ fontSize: 28 }}>The idea</h2>
            </div>
            <div
              className="wf-m"
              style={{ fontSize: 16, lineHeight: 1.65, color: "var(--wf-ink)" }}
              dangerouslySetInnerHTML={{ __html: overview }}
            />

            {/* Under the hood */}
            {features.length > 0 && (
              <>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, margin: "34px 0 6px" }}>
                  <span style={{ color: "var(--wf-accent)", fontFamily: "var(--wf-marker)", fontSize: 14 }}>//</span>
                  <h2 className="wf-h" style={{ fontSize: 28 }}>Under the hood</h2>
                </div>
                <ul style={{ padding: 0, margin: "18px 0 0", listStyle: "none" }}>
                  {features.map((feat, i) => (
                    <li key={i} style={{ position: "relative", padding: "9px 0 9px 38px", fontFamily: "var(--wf-marker)", fontSize: 15, lineHeight: 1.5, color: "var(--wf-ink)" }}>
                      {CHECK_SVG}
                      {feat}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Built with */}
          <aside className="wf-sketch wf-stack wf-reveal d1" style={{ position: "relative" }}>
            <h4 className="wf-h" style={{ fontSize: 22, marginBottom: 14 }}>Built with</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
              {project.technologies.map((tech) => (
                <span key={tech.name} className="wf-sketch wf-chip">
                  {tech.logoUrl && <img src={tech.logoUrl} alt="" className="wf-logo" />}
                  {tech.name}
                </span>
              ))}
            </div>
            <div className="wf-note" style={{ bottom: -30, right: 10, transform: "rotate(-3deg)" }}>
              hover a chip,<br />it colors in ✦
            </div>
          </aside>
        </div>

        {/* More views */}
        {(project.detailImage?.length || 0) > 0 && (
          <section style={{ marginTop: 64 }}>
            <div className="wf-reveal" style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 22 }}>
              <span style={{ color: "var(--wf-accent)", fontFamily: "var(--wf-marker)", fontSize: 14 }}>//</span>
              <h2 className="wf-h" style={{ fontSize: 28 }}>More views</h2>
            </div>
            <div className="wf-reveal" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
              {[0, 1, 2].map((i) => {
                const src = project.detailImage?.[i];
                return src ? (
                  <div key={i} className="wf-sketch wf-photo" style={{ aspectRatio: "4/3", overflow: "hidden" }}>
                    <Image src={src} alt={`${project.title} screenshot ${i + 1}`} fill className="object-cover" />
                  </div>
                ) : (
                  <div key={i} className="wf-sketch wf-xbox" style={{ aspectRatio: "4/3", display: "grid", placeItems: "center" }}>
                    <span className="wf-m" style={{ fontSize: 13, color: "var(--wf-ink-faint)", textAlign: "center", position: "relative", zIndex: 2 }}>
                      screen {String(i + 1).padStart(2, "0")}<br />// to add
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Prev / Next */}
        <nav className="wf-reveal" style={{ display: "flex", justifyContent: "space-between", gap: 16, borderTop: "2px solid var(--wf-ink)", marginTop: 60, padding: "34px 0 0", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: -2, height: 3, background: "var(--wf-ink)", filter: "url(#wobble)" }} />
          <Link href={`/projects/${project.prev.id}`} className="wf-h" style={{ textDecoration: "none", color: "var(--wf-ink)", fontSize: 22, display: "flex", flexDirection: "column" }}>
            <span className="wf-m" style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--wf-ink-soft)" }}>← prev</span>
            {project.prev.title}
          </Link>
          <Link href={`/projects/${project.next.id}`} className="wf-h" style={{ textDecoration: "none", color: "var(--wf-ink)", fontSize: 22, display: "flex", flexDirection: "column", textAlign: "right", alignItems: "flex-end" }}>
            <span className="wf-m" style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--wf-ink-soft)" }}>next →</span>
            {project.next.title}
          </Link>
        </nav>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: "2px solid var(--wf-ink)", padding: "46px 0 60px", marginTop: 70, position: "relative" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: -2, height: 3, background: "var(--wf-ink)", filter: "url(#wobble)" }} />
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 28px", textAlign: "center" }}>
          <div className="wf-eyebrow" style={{ marginBottom: 8 }}>// like what you see?</div>
          <h2 className="wf-h" style={{ fontSize: 38 }}>Let&apos;s build something →</h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 20 }}>
            {[
              { label: "GitHub", href: "https://github.com/itsnang" },
              { label: "Telegram", href: "https://t.me/itsamnang" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/itsnang/" },
            ].map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="wf-sketch wf-btn">{s.label}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
