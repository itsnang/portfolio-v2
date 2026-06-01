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
        <a className="wf-brand" href="#top">
          {initials}
          <span className="wf-brand-tag">/ wireframe v3</span>
        </a>
        <div className="wf-nav-links">
          <a href="#skills">skills</a>
          <a href="#work">work</a>
          <a href="#projects">projects</a>
          <a href="#edu">education</a>
          <a href="#gallery">gallery</a>
          <a href="#contact">say hi</a>
        </div>
      </div>
    </nav>
  );
}
