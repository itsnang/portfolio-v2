import { ArrowLeft } from "lucide-react";

/** A plain link to the Main Site: it's another Site, so no client-side navigation. */
export function HomeLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      Back to home
    </a>
  );
}
