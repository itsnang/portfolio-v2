"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PencilIcon, Trash2Icon } from "lucide-react";

import { BlogPost } from "@/db/schema/blog.schema";
import { deleteBlogPostAction } from "@/server/actions/blog";
import { Button } from "./ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const EMPTY_STATE_MESSAGE =
  "No blog posts yet. Write your first post below.";

const formatDate = (date: Date | string | null) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const DeletePostButton = ({ post }: { post: BlogPost }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteBlogPostAction(post.id);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message);
      router.refresh();
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Delete ${post.title}`}
          className="text-destructive hover:text-destructive"
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &quot;{post.title}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove the post from the dashboard and the public site.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const StatusBadge = ({ status }: { status: BlogPost["status"] }) => (
  <Badge variant={status === "published" ? "default" : "secondary"}>
    {status === "published" ? "Published" : "Draft"}
  </Badge>
);

const BlogPostRow = ({ post }: { post: BlogPost }) => {
  const editUrl = `/dashboard/blog/${post.id}/edit`;
  return (
    <TableRow>
      <TableCell className="font-medium max-w-[260px] truncate">
        {post.title}
      </TableCell>
      <TableCell className="w-[110px]">
        <StatusBadge status={post.status} />
      </TableCell>
      <TableCell className="w-[130px] text-muted-foreground text-sm">
        {formatDate(post.publishedAt)}
      </TableCell>
      <TableCell className="w-[90px]">
        <div className="flex items-center gap-1">
          <Link href={editUrl} aria-label={`Edit ${post.title}`}>
            <Button variant="ghost" size="icon">
              <PencilIcon className="h-4 w-4" />
            </Button>
          </Link>
          <DeletePostButton post={post} />
        </div>
      </TableCell>
    </TableRow>
  );
};

const BlogPostCard = ({ post }: { post: BlogPost }) => {
  const editUrl = `/dashboard/blog/${post.id}/edit`;
  return (
    <div className="rounded-lg border p-4 space-y-3 bg-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{post.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {formatDate(post.publishedAt)}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Link href={editUrl} aria-label={`Edit ${post.title}`}>
            <Button variant="ghost" size="icon">
              <PencilIcon className="h-4 w-4" />
            </Button>
          </Link>
          <DeletePostButton post={post} />
        </div>
      </div>
      <StatusBadge status={post.status} />
    </div>
  );
};

export const BlogTable = ({ posts }: { posts: BlogPost[] }) => {
  const [items] = useState<BlogPost[]>(posts);

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {EMPTY_STATE_MESSAGE}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="hidden md:block rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="w-[110px]">Status</TableHead>
              <TableHead className="w-[130px]">Published</TableHead>
              <TableHead className="w-[90px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((post) => (
              <BlogPostRow key={post.id} post={post} />
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden space-y-4">
        {items.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};
