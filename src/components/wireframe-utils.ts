import { format } from "date-fns";

export function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function fmt(d: Date | null | undefined, fallback = "Present") {
  if (!d) return fallback;
  return format(new Date(d), "MMM d, yyyy");
}
