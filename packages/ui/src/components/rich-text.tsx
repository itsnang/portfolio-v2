import DOMPurify from "isomorphic-dompurify";

import { cn } from "../cn";

// Same node-level styles the Tiptap editor renders with (scoped to
// .tiptap.ProseMirror, so importing these here has no effect on any
// other markup) — keeps the public "tiptap" variant visually identical
// to what was written in the dashboard editor.
import "../tiptap-node/blockquote-node.scss";
import "../tiptap-node/code-block-node.scss";
import "../tiptap-node/horizontal-rule-node.scss";
import "../tiptap-node/list-node.scss";
import "../tiptap-node/image-node.scss";
import "../tiptap-node/heading-node.scss";
import "../tiptap-node/paragraph-node.scss";

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
