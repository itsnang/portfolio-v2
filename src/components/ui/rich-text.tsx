import { cn } from "@/lib/utils";

interface RichTextProps {
  html: string;
  className?: string;
}

export function RichText({ html, className }: RichTextProps) {
  return (
    <div
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none",
        "[&_img]:rounded-lg",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
