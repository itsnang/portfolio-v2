import DOMPurify from "isomorphic-dompurify";

import { cn } from "@/lib/utils";

// Same node-level styles the Tiptap editor renders with (scoped to
// .tiptap.ProseMirror, so importing these here has no effect on any
// other markup) — keeps the public "tiptap" variant visually identical
// to what was written in the dashboard editor.
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

interface RichTextProps {
  html: string;
  className?: string;
  /**
   * "prose" (default) — Tailwind Typography, used by compact renders like
   * experience-card.tsx.
   * "tiptap" — matches the Tiptap editor's own styling exactly, for
   * full-page reading views (e.g. the blog detail page).
   */
  variant?: "prose" | "tiptap";
}

export function RichText({ html, className, variant = "prose" }: RichTextProps) {
  return (
    <div
      className={cn(
        variant === "tiptap"
          ? "tiptap ProseMirror"
          : "prose prose-sm dark:prose-invert max-w-none [&_img]:rounded-lg",
        className
      )}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
    />
  );
}
