"use client";

import { useEffect, useRef, useState } from "react";
import { WireframeLink } from "./wireframe-link";
import { observeReveals, paintEdges, Wobble } from "./wireframe-sketch";
import { WireframeBlogCard, postHref, type WireframeBlogPostSummary } from "./wireframe-blog-card";




export interface WireframeBlogListProps {
  posts: WireframeBlogPostSummary[];
  /** The address Posts live under; each card links to `${postBaseUrl}/${slug}`. */
  postBaseUrl: string;
  /** The Main Site's home page, for the "back to home" link. */
  homeUrl: string;
}

export function WireframeBlogList({ posts, postBaseUrl, homeUrl }: WireframeBlogListProps) {
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
      <Wobble />
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "26px 28px 0" }}>
        <WireframeLink
          href={homeUrl}
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
          ← back to home
        </WireframeLink>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "34px 28px 60px" }}>
        <div className="wf-reveal" style={{ marginBottom: 30 }}>
          <div className="wf-eyebrow" style={{ marginBottom: 8 }}>
            // notes from the notebook
          </div>
          <h1 className="wf-h" style={{ fontSize: "clamp(28px, 7vw, 46px)" }}>
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
                href={postHref(postBaseUrl, post.slug)}
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
