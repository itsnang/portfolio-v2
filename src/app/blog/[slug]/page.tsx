import type { Metadata } from "next";
import { getAppConfig } from "@/features/app-config/actions";
import { getBlogDetail } from "./action";
import { BlogDetail } from "./blog-detail";
import { WireframeBlogDetail } from "./wireframe-blog-detail";

export const revalidate = 3600;

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getBlogDetail(slug);
    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: post.coverImage ? [post.coverImage] : undefined,
      },
    };
  } catch {
    return { title: "Blog post" };
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const [post, config] = await Promise.all([
    getBlogDetail(slug),
    getAppConfig(),
  ]);

  if (config.theme === "wireframe") {
    return <WireframeBlogDetail post={post} />;
  }

  return <BlogDetail post={post} />;
}
