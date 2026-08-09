"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function WireframeScrollFx({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia(rootRef.current ?? undefined);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Default/fallback reveal — everything not given a bespoke treatment below.
      gsap.set(".wf-reveal:not(.wf-fx)", { opacity: 0, y: 16, rotate: -0.4 });
      ScrollTrigger.batch(".wf-reveal:not(.wf-fx)", {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, rotate: 0, duration: 0.6, ease: "power2.out", stagger: 0.08, overwrite: true }),
      });

      // Hero: sequenced load-in (mount-time, not scroll-gated — hero is always above the fold).
      // .wf-hero-left/.wf-hero-photo-col keep the .wf-reveal CSS default (opacity:0) for SSR/no-JS safety
      // and are excluded from the default batch below via .wf-fx; this timeline unhides them and
      // animates their children individually instead of as one block.
      const heroLeft = rootRef.current?.querySelector<HTMLElement>(".wf-hero-left");
      const heroPhotoCol = rootRef.current?.querySelector<HTMLElement>(".wf-hero-photo-col");
      if (heroLeft && heroPhotoCol) {
        gsap.set([heroLeft, heroPhotoCol], { opacity: 1 });

        const badge = heroLeft.querySelector(".wf-hero-badge");
        const eyebrow = heroLeft.querySelector(".wf-hero-eyebrow");
        const words = heroLeft.querySelectorAll(".wf-hero-word");
        const tagline = heroLeft.querySelector(".wf-hero-tagline");
        // pathLength={1} on the <path> + the .wf-uline-path CSS rule normalize stroke-dasharray/-dashoffset
        // to 1, so only strokeDashoffset needs to be driven here (no getTotalLength() / stale-length risk).
        const underline = heroLeft.querySelector<SVGPathElement>(".wf-uline-path");
        const about = heroLeft.querySelector(".wf-hero-about");
        const cta = heroLeft.querySelectorAll(".wf-hero-cta > *");

        const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
        if (badge) heroTl.from(badge, { opacity: 0, scale: 0.8, duration: 0.4 });
        if (eyebrow) heroTl.from(eyebrow, { opacity: 0, y: 10, duration: 0.35 }, "-=0.15");
        if (words.length) heroTl.from(words, { yPercent: 100, duration: 0.6, stagger: 0.06 }, "-=0.1");
        if (tagline) heroTl.from(tagline, { opacity: 0, y: 8, duration: 0.4 }, "-=0.25");
        if (underline) heroTl.to(underline, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, "-=0.1");
        if (about) heroTl.from(about, { opacity: 0, y: 10, duration: 0.4 }, "-=0.5");
        if (cta.length) heroTl.from(cta, { opacity: 0, y: 10, duration: 0.4, stagger: 0.08 }, "-=0.2");

        // Photo column: "drop and settle" with a slight overshoot, tape/note land last.
        const photo = heroPhotoCol.querySelector(".wf-photo");
        const tape = heroPhotoCol.querySelector(".wf-tape");
        const note = heroPhotoCol.querySelector(".wf-note");
        if (photo) {
          gsap.from(photo, { opacity: 0, y: -20, rotate: -4, duration: 0.8, delay: 0.2, ease: "back.out(1.4)" });
        }
        if (tape) {
          gsap.from(tape, { opacity: 0, scale: 0.6, duration: 0.4, delay: 0.9, ease: "power2.out" });
        }
        if (note) {
          gsap.from(note, { opacity: 0, y: 8, duration: 0.4, delay: 1.0 });
        }
      }

      // Journey road: draws in as you scroll past the timeline (scrubbed).
      // pathLength={1} on the <line> + the .wf-vtroad-line CSS rule normalize stroke-dasharray/-dashoffset to 1,
      // so only strokeDashoffset needs to be driven here (no getTotalLength() / stale-length risk on resize).
      const road = rootRef.current?.querySelector<SVGGeometryElement>(".wf-vtroad-line");
      if (road) {
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
        <style>{`.wf-reveal{opacity:1!important;transform:none!important}.wf-uline-path{stroke-dashoffset:0!important}`}</style>
      </noscript>
      {children}
    </div>
  );
}
