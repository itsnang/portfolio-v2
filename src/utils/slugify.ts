/**
 * Convert a string (typically a post title) into a URL-safe slug:
 * lowercase, alphanumeric words separated by single hyphens.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
