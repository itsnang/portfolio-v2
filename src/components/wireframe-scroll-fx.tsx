"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function WireframeScrollFx({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(".wf-reveal", { opacity: 0, y: 16, rotate: -0.4 });
      ScrollTrigger.batch(".wf-reveal", {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, rotate: 0, duration: 0.6, ease: "power2.out", stagger: 0.08, overwrite: true }),
      });

      // Hero underline squiggle: draw on load (mount-time, not scroll-gated — hero is always above the fold)
      const path = rootRef.current?.querySelector<SVGPathElement>(".wf-uline-path");
      if (path) {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", delay: 0.5 });
      }

      // Journey road: draws in as you scroll past the timeline (scrubbed)
      const road = rootRef.current?.querySelector<SVGGeometryElement>(".wf-vtroad-line");
      if (road) {
        const len = road.getTotalLength();
        gsap.set(road, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(road, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: ".wf-vtimeline", start: "top 80%", end: "bottom 60%", scrub: 1 },
        });
      }
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".wf-reveal", { opacity: 1, y: 0, rotate: 0 });
      const path = rootRef.current?.querySelector<SVGPathElement>(".wf-uline-path");
      if (path) gsap.set(path, { strokeDashoffset: 0 });
      const road = rootRef.current?.querySelector<SVGGeometryElement>(".wf-vtroad-line");
      if (road) gsap.set(road, { strokeDashoffset: 0 });
    });

    return () => mm.revert();
  }, { scope: rootRef });

  return (
    <div className="sketch-page" ref={rootRef}>
      <noscript>
        <style>{`.wf-reveal{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      {children}
    </div>
  );
}
