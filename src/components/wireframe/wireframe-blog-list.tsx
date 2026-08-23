"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface WireframeBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: Date | string | null;
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

const formatDate = (date: Date | string | null) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export function WireframeBlogList({ posts }: { posts: WireframeBlogPost[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    paintEdges(rootRef.current);
    const io = observeReveals(rootRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <div className="sketch-page" ref={rootRef}>
      {WOBBLE}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "60px 28px" }}>
        <div className="wf-reveal" style={{ marginBottom: 38 }}>
          <div className="wf-eyebrow" style={{ marginBottom: 8 }}>
            // notes &amp; write-ups
          </div>
          <h1 className="wf-h" style={{ fontSize: 46 }}>
            Blog
          </h1>
        </div>

        {posts.length === 0 ? (
          <p className="wf-m" style={{ fontSize: 16, color: "var(--wf-ink-soft)" }}>
            No posts yet — check back soon.
          </p>
        ) : (
          <div
            className="wf-proj-grid"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}
          >
            {posts.map((post, i) => {
              const date = formatDate(post.publishedAt);
              return (
                <article
                  key={post.id}
                  className={`wf-sketch wf-proj wf-reveal${i % 2 === 1 ? " d1" : ""}`}
                  style={{ background: "var(--wf-paper-2)", display: "flex", flexDirection: "column" }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    style={{
                      display: "block",
                      height: 188,
                      position: "relative",
                      overflow: "hidden",
                      borderBottom: "1.5px solid var(--wf-ink-soft)",
                      textDecoration: "none",
                      background: post.coverImage ? undefined : "var(--wf-paper)",
                    }}
                  >
                    {post.coverImage && (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 540px"
                        className="wf-proj-img"
                      />
                    )}
                    <span className="wf-view-cue">read</span>
                  </Link>
                  <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
                    {date && (
                      <span className="wf-m" style={{ fontSize: 12, color: "var(--wf-ink-soft)", marginBottom: 6 }}>
                        {date}
                      </span>
                    )}
                    <h2 className="wf-h" style={{ fontSize: 22 }}>
                      <Link href={`/blog/${post.slug}`} style={{ color: "var(--wf-accent)", textDecoration: "none" }}>
                        {post.title}
                      </Link>
                    </h2>
                    <p
                      className="wf-m"
                      style={{ fontSize: 14, color: "var(--wf-ink-soft)", lineHeight: 1.5, margin: "8px 0 14px", flex: 1 }}
                    >
                      {post.excerpt}
                    </p>
                    <Link href={`/blog/${post.slug}`} className="wf-sketch wf-btn wf-btn-solid" style={{ fontSize: 14 }}>
                      read →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
