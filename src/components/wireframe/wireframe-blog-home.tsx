import Link from "next/link";
import { WireframeBlogCard, type WireframeBlogPostSummary } from "./wireframe-blog-card";

export function WireframeBlogHome({ posts }: { posts: WireframeBlogPostSummary[] }) {
  if (posts.length === 0) return null;

  return (
    <section style={{ padding: "84px 0" }} id="blog">
      <div
        className="wf-reveal"
        style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 38 }}
      >
        <span className="wf-m" style={{ fontSize: 14, color: "var(--wf-accent)" }}>
          06
        </span>
        <h2 className="wf-h" style={{ fontSize: 40 }}>
          From the Blog
        </h2>
        <span
          className="wf-m"
          style={{ fontSize: 14, color: "var(--wf-ink-soft)", marginLeft: "auto" }}
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
            revealClassName={i % 2 === 1 ? " d1" : ""}
          />
        ))}
      </div>

      <div className="wf-reveal" style={{ textAlign: "center", marginTop: 34 }}>
        <Link href="/blog" className="wf-sketch wf-btn">
          see all posts →
        </Link>
      </div>
    </section>
  );
}
