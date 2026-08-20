import BlogForm from "@/components/form/blog-form";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { getImages } from "../../images/action";

async function CreateBlogPostPage() {
  const images = await getImages();

  return (
    <section className="antialiased max-w-4xl space-y-16 border-gray-700 my-10 py-5 px-7 mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="hover:bg-muted/50"
        >
          <Link href="/dashboard/blog">
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold">Write New Post</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create a new blog post for your portfolio
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <BlogForm images={images} redirectUrl="/dashboard/blog" />
      </div>
    </section>
  );
}

export default CreateBlogPostPage;
