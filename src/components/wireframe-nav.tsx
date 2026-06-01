import Link from "next/link";

interface WireframeNavProps {
  name: string;
}

export function WireframeNav({ name }: WireframeNavProps) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <nav className="wf-nav">
      <div className="wf-nav-edge" />
      <div className="wf-nav-inner">
        <Link className="wf-brand" href="#top">
          {initials}
          <span className="wf-brand-tag">/ wireframe v3</span>
        </Link>
        <div className="wf-nav-links">
          <Link href="#skills">skills</Link>
          <Link href="#work">work</Link>
          <Link href="#projects">projects</Link>
          <Link href="#edu">education</Link>
          <Link href="#gallery">gallery</Link>
          <Link href="#contact">say hi</Link>
        </div>
      </div>
    </nav>
  );
}
