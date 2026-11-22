import Image from "next/image";
import { WireframeLink } from "./wireframe-link";
import { fmt } from "./wireframe-utils";

export interface WireframeBlogPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: Date | string | null;
  category: string;
}

/** Joins the address Posts live under (`/blog` or another Site's origin) with a slug. */
export function postHref(postBaseUrl: string, slug: string) {
  return `${postBaseUrl.replace(/\/$/, "")}/${slug}`;
}

interface WireframeBlogCardProps {
  post: WireframeBlogPostSummary;
  /** Where the card links: the Post's page, on this Site or another. */
  href: string;
  featured?: boolean;
  revealClassName?: string;
}

/** Shared blog post card — used by both the homepage teaser and the Post list. */
export function WireframeBlogCard({
  post,
  href,
  featured = false,
  revealClassName = "",
}: WireframeBlogCardProps) {
  const date = post.publishedAt ? fmt(new Date(post.publishedAt)) : null;

  return (
    <article
      className={`wf-sketch wf-proj wf-reveal${featured ? " wf-post-featured" : ""}${revealClassName}`}
      style={{ background: "var(--wf-paper-2)", display: "flex", flexDirection: "column" }}
    >
      <WireframeLink
        href={href}
        style={{
          display: "block",
          aspectRatio: "16 / 9",
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
        <span className="wf-view-cue">
          read
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M7 17 17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </span>
      </WireframeLink>
      <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
        {date && (
          <span
            className="wf-m"
            style={{
              fontSize: 12,
              color: "var(--wf-accent)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 6,
            }}
          >
            {date}
          </span>
        )}
        <h3 className="wf-h">
          <WireframeLink
            href={href}
            className="wf-blog-title-link"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {post.title}
          </WireframeLink>
        </h3>
        <p
          className="wf-m"
          style={{ fontSize: 14, color: "var(--wf-ink-soft)", lineHeight: 1.5, marginTop: 8, flex: 1 }}
        >
          {post.excerpt}
        </p>
        <span className="wf-m" style={{ fontSize: 14, color: "var(--wf-ink)", marginTop: 16 }}>
          {post.category}
        </span>
      </div>
    </article>
  );
}
