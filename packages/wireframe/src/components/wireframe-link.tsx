import Link from "next/link";
import type { ComponentProps } from "react";

type WireframeLinkProps = Omit<ComponentProps<"a">, "href"> & { href: string };

/**
 * A link that may point at another Site. Cross-Site links are plain `<a>` tags
 * (absolute URLs); links within this Site use `next/link`.
 */
export function WireframeLink({ href, ...props }: WireframeLinkProps) {
  if (/^https?:\/\//.test(href)) return <a href={href} {...props} />;
  return <Link href={href} {...props} />;
}
