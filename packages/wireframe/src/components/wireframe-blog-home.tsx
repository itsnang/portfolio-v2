import { WireframeLink } from "./wireframe-link";
import { WireframeBlogCard, postHref, type WireframeBlogPostSummary } from "./wireframe-blog-card";

export interface WireframeBlogHomeProps {
  posts: WireframeBlogPostSummary[];
  /** The address Posts live under; each card links to `${postBaseUrl}/${slug}`. */
  postBaseUrl: string;
  /** The Post list. */
  allPostsUrl: string;
}

export function WireframeBlogHome({ posts, postBaseUrl, allPostsUrl }: WireframeBlogHomeProps) {
  if (posts.length === 0) return null;

  return (
    <section className="wf-section" id="blog">
      <div
        className="wf-reveal wf-section-head"
        style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 38 }}
      >
        <span className="wf-m" style={{ fontSize: 14, color: "var(--wf-accent)" }}>
          06
        </span>
        <h2 className="wf-h" style={{ fontSize: "clamp(26px, 5vw, 40px)" }}>
          From the Blog
        </h2>
        <span
          className="wf-m wf-section-hint"
          style={{ fontSize: 14, color: "var(--wf-ink-soft)" }}
        >
          // notes from the notebook
        </span>
      </div>

      <div
        className="wf-proj-grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}
      >
        {posts.slice(0, 3).map((post, i) => (
          <WireframeBlogCard
            key={post.id}
            post={post}
            href={postHref(postBaseUrl, post.slug)}
            revealClassName={i % 2 === 1 ? " d1" : ""}
          />
        ))}
      </div>

      <div className="wf-reveal" style={{ textAlign: "center", marginTop: 34 }}>
        <WireframeLink href={allPostsUrl} className="wf-sketch wf-btn">
          see all posts →
        </WireframeLink>
      </div>
    </section>
  );
}
