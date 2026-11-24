"use client";

import type { CSSProperties, ReactNode, Ref } from "react";
import Image from "next/image";
import { PencilIcon, PlusIcon } from "lucide-react";

import { Button } from "@portfolio/ui/button";
import { cn } from "@portfolio/ui/cn";
import { DeleteConfirmButton } from "@/components/delete-confirm-button";

/** The top of a dashboard page: its name, what it feeds on the public Sites, how many, and its actions. */
export function ListHeader({
  title,
  description,
  count,
  children,
}: {
  title: string;
  description: string;
  count?: number;
  /** The page's actions, usually one AddButton. */
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 pb-6">
      <div className="min-w-0">
        <h1 className="text-[22px] font-medium leading-tight tracking-[-0.02em]">
          {title}
          {count !== undefined && (
            <span className="ml-2 align-middle font-mono text-xs font-normal tabular-nums text-muted-foreground">
              {count}
            </span>
          )}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </header>
  );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button size="sm" onClick={onClick}>
      <PlusIcon className="size-4" />
      {label}
    </Button>
  );
}

/** Rich text as one plain line, for a row's subtitle. */
export const plainText = (html: string | null | undefined) =>
  (html ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

/** The rows of a list page. Renders the empty message instead when there are none. */
export function ContentList({
  isEmpty,
  emptyMessage,
  children,
}: {
  isEmpty: boolean;
  emptyMessage: string;
  children: ReactNode;
}) {
  if (isEmpty) {
    return (
      <p className="border-t border-border py-16 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }
  return <ul className="border-t border-border">{children}</ul>;
}

/** A square thumbnail for a row: a logo, photo or cover. Falls back to an initial. */
export function RowMedia({ src, alt }: { src?: string | null; alt: string }) {
  return (
    <div className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-md border border-border bg-muted text-sm font-medium text-muted-foreground">
      {src ? <Image src={src} alt={alt} fill sizes="40px" className="object-cover" /> : alt.charAt(0)}
    </div>
  );
}

/** Whether a row shows on the public Site, as a dot and a word rather than a coloured pill. */
export function RowStatus({ live, label }: { live: boolean | null; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <span
        aria-hidden
        className={cn("size-1.5 rounded-full", live ? "bg-primary" : "bg-muted-foreground/40")}
      />
      {label}
    </span>
  );
}

interface ContentRowProps {
  /** For a sortable row: dnd-kit's node ref and transform style. */
  ref?: Ref<HTMLLIElement>;
  style?: CSSProperties;
  /** A drag handle, shown before the media. */
  handle?: ReactNode;
  media?: ReactNode;
  title: string;
  subtitle?: ReactNode;
  /** A secondary column, shown from the md breakpoint up. */
  meta?: ReactNode;
  status: ReactNode;
  /** Names the row in the edit and delete buttons' labels. Defaults to the title. */
  itemLabel?: string;
  onEdit: () => void;
  onDelete?: () => Promise<void>;
}

/** One item in a list page. The title opens the editor; edit and delete show on hover or focus. */
export function ContentRow({
  ref,
  style,
  handle,
  media,
  title,
  subtitle,
  meta,
  status,
  itemLabel = title,
  onEdit,
  onDelete,
}: ContentRowProps) {
  return (
    <li
      ref={ref}
      style={style}
      className="group relative flex items-center gap-3 border-b border-border py-3 pr-1 transition-colors hover:bg-muted/40 md:gap-4"
    >
      {handle}
      {media}
      <button
        type="button"
        onClick={onEdit}
        className="min-w-0 flex-1 rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="block truncate text-sm font-medium">{title}</span>
        {subtitle && <span className="block truncate text-sm text-muted-foreground">{subtitle}</span>}
      </button>
      {meta && <div className="hidden w-44 shrink-0 truncate text-sm text-muted-foreground md:block">{meta}</div>}
      <div className="hidden w-24 shrink-0 sm:block">{status}</div>
      <div className="flex shrink-0 items-center transition-opacity md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
        <Button variant="ghost" size="icon" aria-label={`Edit ${itemLabel}`} onClick={onEdit}>
          <PencilIcon className="size-4" />
        </Button>
        {onDelete && <DeleteConfirmButton itemLabel={itemLabel} onConfirm={onDelete} />}
      </div>
    </li>
  );
}
