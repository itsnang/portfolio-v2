import { BlogTable } from "@/components/blog-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { getBlogPosts } from "@/server/actions/blog";

async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <section className="antialiased max-w-5xl space-y-16 border-gray-700 my-10 md:border-2 md:rounded-xl py-5 px-7 mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Blog</h1>
        <Button variant="outline" size="sm" className="gap-2" asChild>
          <Link href="/dashboard/blog/create">
            <PlusIcon className="h-4 w-4" />
            Add Post
          </Link>
        </Button>
      </div>

      <BlogTable posts={posts} />
    </section>
  );
}

export default BlogPage;
