"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import type { IProfile } from "@/types/profile.type";

const WOBBLE = (
  <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
    <defs>
      <filter id="wobble">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.014 0.022"
          numOctaves={2}
          seed={7}
          result="n"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="n"
          scale={3}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </defs>
  </svg>
);

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function fmt(d: Date | null | undefined, fallback = "Present") {
  if (!d) return fallback;
  return format(new Date(d), "MMM d, yyyy");
}

function paintEdges(root: HTMLElement) {
  root
    .querySelectorAll(
      ".wf-sketch, .wf-photo, .wf-chip, .wf-btn, .wf-xp, .wf-badge, .wf-proj, .wf-edu-card, .wf-quote",
    )
    .forEach((el) => {
      if (!el.querySelector(":scope > .wf-edge")) {
        const edge = document.createElement("div");
        edge.className = "wf-edge";
        el.insertBefore(edge, el.firstChild);
      }
    });
}

export function WireframeHome({ profile }: { profile: IProfile }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [openXp, setOpenXp] = useState<string | null>(
    profile.experience[0]?.id ?? null,
  );
  const revealedEls = useRef<Set<Element>>(new Set());

  useEffect(() => {
    if (!rootRef.current) return;
    paintEdges(rootRef.current);
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            revealedEls.current.add(e.target);
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    rootRef.current
      .querySelectorAll(".wf-reveal")
      .forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Re-apply .in after every render so React className updates don't wipe it
  useLayoutEffect(() => {
    revealedEls.current.forEach((el) => el.classList.add("in"));
  });

  return (
    <div className="sketch-page" ref={rootRef}>
      {WOBBLE}

      {/* ── NAV ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "rgba(251,250,245,.9)",
          backdropFilter: "blur(4px)",
          borderBottom: "2px solid var(--wf-ink)",
        }}
      >
        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "0 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 62,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <div className="wf-h" style={{ fontSize: 24, fontWeight: 700 }}>
              SN
            </div>
            <span
              className="wf-m"
              style={{ fontSize: 15, color: "var(--wf-accent)" }}
            >
              / portfolio
            </span>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {["skills", "work", "projects", "edu", "gallery", "contact"].map(
              (id) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="wf-m wf-nav-link"
                  style={{
                    fontSize: 15,
                    color: "var(--wf-ink-soft)",
                    textDecoration: "none",
                    padding: "7px 12px",
                  }}
                >
                  {id === "edu"
                    ? "education"
                    : id === "contact"
                      ? "say hi"
                      : id}
                </a>
              ),
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <header
        style={{
          position: "relative",
          padding: "70px 0 40px",
          overflow: "visible",
        }}
      >
        <div
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
            <div className="wf-eyebrow" style={{ marginBottom: 10 }}>
              // hello world, this is
            </div>
            <h1 className="wf-h" style={{ fontSize: 84, lineHeight: 0.92 }}>
              {profile.name}
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
              {profile.abouts}
            </p>
            <div
              style={{
                display: "flex",
                gap: 14,
                marginTop: 30,
                flexWrap: "wrap",
              }}
            >
              <a href="#projects" className="wf-sketch wf-btn wf-btn-solid">
                see the work →
              </a>
              <a href="#contact" className="wf-sketch wf-btn">
                say hi 👋
              </a>
            </div>
          </div>

          <div className="wf-reveal d2" style={{ position: "relative" }}>
            <div
              className="wf-sketch wf-photo"
              style={{ width: "100%", aspectRatio: "4/5", overflow: "hidden" }}
            >
              <div className="wf-tape" />
              <Image
                src={profile.imageUrl}
                alt={profile.name}
                fill
                className="object-cover"
              />
            </div>
            <div
              className="wf-note"
              style={{
                top: -44,
                left: -120,
                width: 120,
                transform: "rotate(-6deg)",
              }}
            >
              real photo,
              <br />
              drawn frame
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 28px" }}>
        {/* ── SKILLS ── */}
        <section style={{ padding: "84px 0" }} id="skills">
          <div
            className="wf-reveal"
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 16,
              marginBottom: 38,
            }}
          >
            <span
              className="wf-m"
              style={{ fontSize: 14, color: "var(--wf-accent)" }}
            >
              01
            </span>
            <h2 className="wf-h" style={{ fontSize: 40 }}>
              Skills
            </h2>
            <span
              className="wf-m"
              style={{
                fontSize: 14,
                color: "var(--wf-ink-soft)",
                marginLeft: "auto",
              }}
            >
              // the toolbox
            </span>
          </div>
          <div
            className="wf-reveal"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 11,
              position: "relative",
            }}
          >
            {profile.skills.map((skill) => (
              <span key={skill.id} className="wf-sketch wf-chip">
                {skill.logoUrl && (
                  <img src={skill.logoUrl} alt="" className="wf-logo" />
                )}
                {skill.name}
              </span>
            ))}
            <div
              className="wf-note"
              style={{
                bottom: -40,
                right: 0,
                width: 150,
                transform: "rotate(-3deg)",
              }}
            >
              drag-em onto a project,
              <br />
              they actually ship ✦
            </div>
          </div>
        </section>

        <hr className="wf-divider" />

        {/* ── WORK EXPERIENCE ── */}
        <section style={{ padding: "84px 0" }} id="work">
          <div
            className="wf-reveal"
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 16,
              marginBottom: 38,
            }}
          >
            <span
              className="wf-m"
              style={{ fontSize: 14, color: "var(--wf-accent)" }}
            >
              02
            </span>
            <h2 className="wf-h" style={{ fontSize: 40 }}>
              Work Experience
            </h2>
            <span
              className="wf-m"
              style={{
                fontSize: 14,
                color: "var(--wf-ink-soft)",
                marginLeft: "auto",
              }}
            >
              // click a card to expand ↓
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {profile.experience.map((xp, i) => (
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
                  style={{ display: "flex", alignItems: "flex-start", gap: 16 }}
                >
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      flexShrink: 0,
                      display: "grid",
                      placeItems: "center",
                      background: "var(--wf-paper-2)",
                      overflow: "hidden",
                      borderRadius: 0,
                    }}
                  >
                    {xp.imageUrl ? (
                      <img
                        src={xp.imageUrl}
                        alt={xp.company}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span
                        className="wf-h"
                        style={{ fontSize: 22, fontWeight: 700 }}
                      >
                        {xp.company[0]}
                      </span>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, paddingTop: 1 }}>
                    <h3
                      className="wf-h"
                      style={{ fontSize: 22, lineHeight: 1.12 }}
                    >
                      {xp.company}
                    </h3>
                    <div
                      className="wf-m"
                      style={{
                        fontSize: 15,
                        color: "var(--wf-ink)",
                        marginTop: 3,
                      }}
                    >
                      {xp.title}
                    </div>
                  </div>
                  <div
                    style={{
                      marginLeft: "auto",
                      textAlign: "right",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      className="wf-m"
                      style={{
                        fontSize: 13,
                        color: "var(--wf-ink-soft)",
                        whiteSpace: "nowrap",
                      }}
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

        <hr className="wf-divider" />

        {/* ── PROJECTS ── */}
        <section style={{ padding: "84px 0" }} id="projects">
          <div
            className="wf-reveal"
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 16,
              marginBottom: 38,
            }}
          >
            <span
              className="wf-m"
              style={{ fontSize: 14, color: "var(--wf-accent)" }}
            >
              03
            </span>
            <h2 className="wf-h" style={{ fontSize: 40 }}>
              Projects
            </h2>
            <span
              className="wf-m"
              style={{
                fontSize: 14,
                color: "var(--wf-ink-soft)",
                marginLeft: "auto",
              }}
            >
              // stuff i actually built
            </span>
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}
          >
            {profile.projects.map((proj, i) => (
              <article
                key={proj.id}
                className={`wf-sketch wf-proj wf-reveal${i % 2 === 1 ? " d1" : ""}`}
                style={{
                  background: "var(--wf-paper-2)",
                  display: "flex",
                  flexDirection: "column",
                }}
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
                    className="wf-proj-img"
                  />
                  <span className="wf-view-cue">open ↗</span>
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
                      style={{
                        color: "var(--wf-accent)",
                        textDecoration: "none",
                      }}
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
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 16,
                      marginBottom: 14,
                    }}
                  >
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

        <hr className="wf-divider" />

        {/* ── EDUCATION + RECOMMENDATIONS ── */}
        <section style={{ padding: "84px 0" }} id="edu">
          <div
            className="wf-reveal"
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 16,
              marginBottom: 38,
            }}
          >
            <span
              className="wf-m"
              style={{ fontSize: 14, color: "var(--wf-accent)" }}
            >
              04
            </span>
            <h2 className="wf-h" style={{ fontSize: 40 }}>
              Education &amp; Kind Words
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 22,
              alignItems: "start",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {profile.education.map((edu, i) => (
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
                    style={{
                      fontSize: 14,
                      color: "var(--wf-ink-soft)",
                      marginTop: 4,
                    }}
                  >
                    {edu.degree}
                  </div>
                  <div
                    className="wf-m"
                    style={{
                      fontSize: 13,
                      color: "var(--wf-accent)",
                      marginTop: 8,
                    }}
                  >
                    {fmt(edu.startDate)} — {fmt(edu.endDate)}
                  </div>
                </a>
              ))}
            </div>
            {profile.recommendations[0] && (
              <div
                className="wf-sketch wf-quote wf-reveal d2"
                style={{
                  background: "var(--wf-paper-2)",
                  padding: "30px 34px",
                  position: "relative",
                }}
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
                  {profile.recommendations[0].recommendationText}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    paddingLeft: 30,
                  }}
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
                    <span
                      className="wf-h"
                      style={{ fontSize: 16, fontWeight: 700 }}
                    >
                      {profile.recommendations[0].name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div
                      className="wf-h"
                      style={{ fontSize: 19, fontWeight: 700 }}
                    >
                      {profile.recommendations[0].name}
                    </div>
                    <div
                      className="wf-m"
                      style={{
                        fontSize: 12,
                        color: "var(--wf-ink-soft)",
                        maxWidth: 280,
                        lineHeight: 1.35,
                      }}
                    >
                      {profile.recommendations[0].position}
                    </div>
                  </div>
                </div>
                <div
                  className="wf-note"
                  style={{ top: -18, right: 18, transform: "rotate(4deg)" }}
                >
                  real reference ✓
                </div>
              </div>
            )}
          </div>
        </section>

        <hr className="wf-divider" />

        {/* ── GALLERY ── */}
        {profile.aboutImages && profile.aboutImages.length > 0 && (
          <section style={{ padding: "84px 0" }} id="gallery">
            <div
              className="wf-reveal"
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 16,
                marginBottom: 38,
              }}
            >
              <span
                className="wf-m"
                style={{ fontSize: 14, color: "var(--wf-accent)" }}
              >
                05
              </span>
              <h2 className="wf-h" style={{ fontSize: 40 }}>
                Gallery
              </h2>
              <span
                className="wf-m"
                style={{
                  fontSize: 14,
                  color: "var(--wf-ink-soft)",
                  marginLeft: "auto",
                }}
              >
                // moments
              </span>
            </div>
            <div
              className="wf-reveal"
              style={{ columnCount: 4, columnGap: 16 }}
            >
              {profile.aboutImages.map((src, i) => (
                <div
                  key={i}
                  className="wf-sketch wf-photo"
                  style={{
                    width: "100%",
                    marginBottom: 16,
                    breakInside: "avoid",
                  }}
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
        )}
      </div>

      {/* ── FOOTER / CONTACT ── */}
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
            Say hi 👋
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
            Introverted, but always up for a good build. Find me here:
          </p>
          <div
            className="wf-reveal d1"
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <a
              href="https://github.com/itsnang"
              target="_blank"
              rel="noopener noreferrer"
              className="wf-sketch wf-btn"
            >
              GitHub
            </a>
            <a
              href="https://t.me/itsamnang"
              target="_blank"
              rel="noopener noreferrer"
              className="wf-sketch wf-btn"
            >
              Telegram
            </a>
            <a
              href="https://www.linkedin.com/in/itsnang/"
              target="_blank"
              rel="noopener noreferrer"
              className="wf-sketch wf-btn"
            >
              LinkedIn
            </a>
            <a
              href="https://www.instagram.com/huotchhayyy/"
              target="_blank"
              rel="noopener noreferrer"
              className="wf-sketch wf-btn"
            >
              Instagram
            </a>
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
    </div>
  );
}
