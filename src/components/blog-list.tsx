import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface BlogListPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: Date | string | null;
}

const formatDate = (date: Date | string | null) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export function BlogList({ posts }: { posts: BlogListPost[] }) {
  if (posts.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-2">
        <h1 className="text-3xl font-bold">Blog</h1>
        <p className="text-muted-foreground">
          No posts yet — check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12 space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="text-muted-foreground">
          Thoughts, notes, and things I&apos;ve learned.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {posts.map((post) => {
          const date = formatDate(post.publishedAt);
          return (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg py-0">
                {post.coverImage && (
                  <div className="relative aspect-video overflow-hidden bg-muted/50">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6 space-y-3">
                  {date && (
                    <Badge variant="secondary" className="font-normal">
                      {date}
                    </Badge>
                  )}
                  <h2 className="text-xl font-semibold leading-snug group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
