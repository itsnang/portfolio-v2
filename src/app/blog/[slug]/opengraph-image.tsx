import { getBlogPostBySlug } from "@/features/blog/actions";
import { renderWireframeOgImage } from "@/lib/og";

// These three must stay inline literals — Next statically analyses them to
// build the route, so they can't be re-exported bindings from another module.
export const alt = "Blog post — Lorn Samnang";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug).catch(() => null);

  const date = post?.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return renderWireframeOgImage({
    eyebrow: date ? `// ${date}` : null,
    title: post?.title ?? "The Blog",
    description:
      post?.excerpt ?? "Write-ups on things I build, break, and learn.",
    tag: post?.category ?? null,
  });
}
