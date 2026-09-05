"use client";

import { useEffect, useRef } from "react";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import Link from "next/link";

interface Post {
  title: string;
  excerpt: string;
  coverImage: string | null;
  content: string;
  publishedAt: Date | string | null;
  category: string;
  number: number;
  total: number;
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
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
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
  );
  root.querySelectorAll(".wf-reveal").forEach((el) => io.observe(el));
  return io;
}

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

export function WireframeBlogDetail({ post }: { post: Post }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    paintEdges(rootRef.current);
    const io = observeReveals(rootRef.current);
    return () => io.disconnect();
  }, []);

  const publishedLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
  const num = String(post.number).padStart(2, "0");
  const total = String(post.total).padStart(2, "0");

  return (
    <div className="sketch-page" ref={rootRef}>
      {WOBBLE}

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "26px clamp(16px, 6vw, 28px) 0" }}>
        <Link
          href="/blog"
          className="wf-m"
          style={{
            fontSize: 15,
            color: "var(--wf-ink-soft)",
            textDecoration: "none",
            display: "inline-flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          ← back to blog
        </Link>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 clamp(16px, 6vw, 28px)" }}>
        <div className="wf-reveal" style={{ padding: "28px 0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div className="wf-region">
              post {num} / {total}
            </div>
            <span className="wf-sketch wf-chip" style={{ fontSize: 11, padding: "3px 10px" }}>
              {post.category}
            </span>
          </div>
          <h1 className="wf-h" style={{ fontSize: "clamp(28px, 8vw, 46px)", lineHeight: 1.02, marginTop: 10 }}>
            {post.title}
          </h1>
          {publishedLabel && (
            <p className="wf-m" style={{ fontSize: 14, color: "var(--wf-ink-soft)", marginTop: 10 }}>
              {publishedLabel}
            </p>
          )}
          <p className="wf-m" style={{ fontSize: 17, lineHeight: 1.6, marginTop: 16, color: "var(--wf-ink)" }}>
            {post.excerpt}
          </p>
        </div>

        {post.coverImage && (
          <div className="wf-reveal d1" style={{ marginBottom: 30 }}>
            <div className="wf-sketch wf-photo" style={{ width: "100%", aspectRatio: "16/9" }}>
              <div className="wf-tape" />
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 1080px) 100vw, 1080px"
                className="object-contain"
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        )}

        <hr className="wf-divider" style={{ margin: "10px 0 40px" }} />

        <div
          className="wf-m wf-content"
          style={{ fontSize: 16, lineHeight: 1.75, color: "var(--wf-ink)" }}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        />

        {(post.prev || post.next) && (
          <nav
            className="wf-reveal"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: 16,
              borderTop: "2px solid var(--wf-ink)",
              marginTop: 60,
              padding: "34px 0 60px",
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
            {post.prev ? (
              <Link
                href={`/blog/${post.prev.slug}`}
                className="wf-h"
                style={{
                  textDecoration: "none",
                  color: "var(--wf-ink)",
                  fontSize: 20,
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                  flex: "1 1 220px",
                }}
              >
                <span className="wf-m" style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--wf-ink-soft)" }}>
                  ← prev
                </span>
                {post.prev.title}
              </Link>
            ) : (
              <span />
            )}
            {post.next && (
              <Link
                href={`/blog/${post.next.slug}`}
                className="wf-h"
                style={{
                  textDecoration: "none",
                  color: "var(--wf-ink)",
                  fontSize: 20,
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "right",
                  alignItems: "flex-end",
                  minWidth: 0,
                  flex: "1 1 220px",
                }}
              >
                <span className="wf-m" style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--wf-ink-soft)" }}>
                  next →
                </span>
                {post.next.title}
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
