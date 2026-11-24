"use client";

import { useEffect, type RefObject } from "react";

/** Elements that get a hand-drawn edge on most wireframe pages. */
export const PAGE_EDGE_SELECTORS = ".wf-sketch, .wf-photo, .wf-chip, .wf-btn, .wf-stack, .wf-xbox";

/** The home page's sections use their own boxes. */
export const HOME_EDGE_SELECTORS =
  ".wf-sketch, .wf-photo, .wf-chip, .wf-btn, .wf-xp, .wf-badge, .wf-proj, .wf-edu-card, .wf-quote";

/** Adds the sketched `.wf-edge` layer to every matching element that doesn't have one yet. */
export function paintEdges(root: HTMLElement, selectors: string = PAGE_EDGE_SELECTORS) {
  root.querySelectorAll(selectors).forEach((el) => {
    if (!el.querySelector(":scope > .wf-edge")) {
      const edge = document.createElement("div");
      edge.className = "wf-edge";
      el.insertBefore(edge, el.firstChild);
    }
  });
}

/**
 * Adds `.in` to each `.wf-reveal` as it scrolls into view, once. Returns the
 * observer so the caller can disconnect it. `onReveal` sees each revealed element.
 */
export function observeReveals(
  root: HTMLElement,
  { threshold = 0.1, rootMargin = "0px 0px -6% 0px", onReveal }: {
    threshold?: number;
    rootMargin?: string;
    onReveal?: (el: Element) => void;
  } = {}
) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          onReveal?.(entry.target);
          io.unobserve(entry.target);
        }
      }),
    { threshold, rootMargin }
  );
  root.querySelectorAll(".wf-reveal").forEach((el) => io.observe(el));
  return io;
}

/** Paints edges and starts scroll reveals once, for a page that doesn't re-render its boxes. */
export function useSketchPage(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!rootRef.current) return;
    paintEdges(rootRef.current);
    const io = observeReveals(rootRef.current);
    return () => io.disconnect();
  }, [rootRef]);
}

/** The SVG filter behind `filter: url(#wobble)`. Render once per page. */
export function Wobble() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <filter id="wobble">
          <feTurbulence type="fractalNoise" baseFrequency="0.014 0.022" numOctaves={2} seed={7} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={3} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}
