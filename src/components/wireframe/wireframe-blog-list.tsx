"use client";

import { useEffect, useRef, useState } from "react";
import { WireframeBlogCard, type WireframeBlogPostSummary } from "./wireframe-blog-card";

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

export function WireframeBlogList({ posts }: { posts: WireframeBlogPostSummary[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const isFirstRun = useRef(true);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    paintEdges(rootRef.current);

    // First mount: let the scroll-triggered IntersectionObserver handle the
    // reveal animation. On a later filter change, the newly-shown cards are
    // already in view, so paint their edges and reveal them immediately
    // instead of waiting on the (already-disconnected) observer.
    if (isFirstRun.current) {
      isFirstRun.current = false;
      const io = observeReveals(rootRef.current);
      return () => io.disconnect();
    }
    rootRef.current.querySelectorAll(".wf-reveal").forEach((el) => el.classList.add("in"));
  }, [filter]);

  const categories = Array.from(new Set(posts.map((p) => p.category)));
  const filteredPosts = filter ? posts.filter((p) => p.category === filter) : posts;

  return (
    <div className="sketch-page" ref={rootRef}>
      {WOBBLE}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "60px 28px" }}>
        <div className="wf-reveal" style={{ marginBottom: 30 }}>
          <div className="wf-eyebrow" style={{ marginBottom: 8 }}>
            // notes from the notebook
          </div>
          <h1 className="wf-h" style={{ fontSize: 46 }}>
            The Blog
          </h1>
          <p
            className="wf-m"
            style={{ fontSize: 16, color: "var(--wf-ink-soft)", lineHeight: 1.6, marginTop: 12, maxWidth: 480 }}
          >
            Write-ups on things I build, break, and learn — mostly software, sometimes not.
          </p>
        </div>

        {posts.length > 0 && categories.length > 1 && (
          <div
            className="wf-reveal"
            style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 30 }}
          >
            {[null, ...categories].map((category) => (
              <button
                key={category ?? "all"}
                type="button"
                onClick={() => setFilter(category)}
                className={`wf-sketch wf-chip${filter === category ? " wf-chip-active" : ""}`}
                style={{ cursor: "pointer", border: "none" }}
              >
                {category ?? "all"}
              </button>
            ))}
          </div>
        )}

        <hr className="wf-divider" style={{ margin: "0 0 40px" }} />

        {filteredPosts.length === 0 ? (
          <p className="wf-m" style={{ fontSize: 16, color: "var(--wf-ink-soft)" }}>
            {posts.length === 0 ? "No posts yet — check back soon." : "No posts in this category yet."}
          </p>
        ) : (
          <div
            className="wf-proj-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}
          >
            {filteredPosts.map((post, i) => (
              <WireframeBlogCard
                key={post.id}
                post={post}
                featured={i === 0 && filteredPosts.length > 1}
                revealClassName={i % 2 === 1 ? " d1" : ""}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
