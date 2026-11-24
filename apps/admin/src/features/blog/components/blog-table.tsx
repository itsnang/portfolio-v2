"use client";

import type { BlogPost } from "@portfolio/db/schema";

import { AddButton, ContentList, ContentRow, ListHeader, RowMedia, RowStatus } from "@/components/content-list";
import { FormSheet } from "@/components/form-sheet";
import { deleteBlogPostAction } from "@/features/blog/actions/blog";
import BlogForm from "@/features/blog/components/blog-form";
import { useEditorSheet } from "@/lib/use-editor-sheet";
import { showActionResult } from "@/lib/use-run-action";

const formatDate = (date: Date | string | null) =>
  date
    ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "Not published";

interface BlogTableProps {
  posts: BlogPost[];
  /** The Blog Site's address, shown in the form's slug hint. */
  blogUrl: string;
}

export const BlogTable = ({ posts, blogUrl }: BlogTableProps) => {
  const sheet = useEditorSheet<BlogPost>();

  return (
    <div>
      <ListHeader
        title="Posts"
        description="Everything on the Blog Site. Drafts stay private."
        count={posts.length}
      >
        <AddButton label="Write post" onClick={sheet.openCreate} />
      </ListHeader>

      <ContentList isEmpty={posts.length === 0} emptyMessage="No posts yet.">
        {posts.map((post) => {
          const published = post.status === "published";
          return (
            <ContentRow
              key={post.id}
              media={<RowMedia src={post.coverImage} alt={post.title} />}
              title={post.title}
              subtitle={post.category}
              meta={formatDate(post.publishedAt)}
              status={<RowStatus live={published} label={published ? "Published" : "Draft"} />}
              onEdit={() => sheet.openEdit(post)}
              onDelete={async () => {
                showActionResult(await deleteBlogPostAction(post.id));
              }}
            />
          );
        })}
      </ContentList>

      <FormSheet
        open={sheet.open}
        onOpenChange={sheet.setOpen}
        title={sheet.editing ? "Edit post" : "Write post"}
        description={sheet.editing ? "Update this post." : "Create a new blog post for your portfolio."}
      >
        <BlogForm
          key={sheet.editing?.id ?? "create"}
          blogUrl={blogUrl}
          initialData={sheet.editing ?? undefined}
          onSuccess={sheet.close}
        />
      </FormSheet>
    </div>
  );
};
