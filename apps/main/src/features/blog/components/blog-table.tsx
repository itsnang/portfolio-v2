"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PencilIcon } from "lucide-react";

import { BlogPost } from "@/features/blog/schemas";
import { deleteBlogPostAction } from "@/features/blog/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmButton } from "@/components/delete-confirm-button";
import { FormSheet } from "@/components/form-sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useImages } from "@/features/media/hooks/use-images";
import BlogForm from "@/features/blog/components/blog-form";

const EMPTY_STATE_MESSAGE = "No blog posts yet. Write your first post below.";

const formatDate = (date: Date | string | null) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const StatusBadge = ({ status }: { status: BlogPost["status"] }) => (
  <Badge variant={status === "published" ? "default" : "secondary"}>
    {status === "published" ? "Published" : "Draft"}
  </Badge>
);

const CategoryBadge = ({ category }: { category: BlogPost["category"] }) => (
  <Badge variant="outline">{category}</Badge>
);

interface BlogTableProps {
  posts: BlogPost[];
}

export const BlogTable = ({ posts }: BlogTableProps) => {
  const router = useRouter();
  const { data: images = [] } = useImages();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  function openCreate() {
    setEditingPost(null);
    setSheetOpen(true);
  }

  function openEdit(post: BlogPost) {
    setEditingPost(post);
    setSheetOpen(true);
  }

  function handleFormSuccess() {
    setSheetOpen(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    const result = await deleteBlogPostAction(id);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success(result.message);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Blog</h2>
        <Button variant="outline" size="sm" onClick={openCreate}>
          Add Post
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {EMPTY_STATE_MESSAGE}
        </div>
      ) : (
        <>
          <div className="hidden md:block rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="w-[110px]">Category</TableHead>
                  <TableHead className="w-[110px]">Status</TableHead>
                  <TableHead className="w-[130px]">Published</TableHead>
                  <TableHead className="w-[90px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-[260px] truncate">
                      {post.title}
                    </TableCell>
                    <TableCell className="w-[110px]">
                      <CategoryBadge category={post.category} />
                    </TableCell>
                    <TableCell className="w-[110px]">
                      <StatusBadge status={post.status} />
                    </TableCell>
                    <TableCell className="w-[130px] text-muted-foreground text-sm">
                      {formatDate(post.publishedAt)}
                    </TableCell>
                    <TableCell className="w-[90px]">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit ${post.title}`}
                          onClick={() => openEdit(post)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <DeleteConfirmButton
                          itemLabel={post.title}
                          onConfirm={() => handleDelete(post.id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="rounded-lg border p-4 space-y-3 bg-card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(post.publishedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${post.title}`}
                      onClick={() => openEdit(post)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <DeleteConfirmButton
                      itemLabel={post.title}
                      onConfirm={() => handleDelete(post.id)}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CategoryBadge category={post.category} />
                  <StatusBadge status={post.status} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <FormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={editingPost ? "Edit Post" : "Write New Post"}
        description={
          editingPost
            ? "Update this post."
            : "Create a new blog post for your portfolio."
        }
      >
        <BlogForm
          key={editingPost?.id ?? "create"}
          images={images}
          initialData={editingPost ?? undefined}
          onSuccess={handleFormSuccess}
        />
      </FormSheet>
    </div>
  );
};
