"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { IProfile } from "@/types/profile.type";
import { WireframeHero } from "./wireframe-hero";
import { WireframeSkills } from "./wireframe-skills";
import { WireframeExperience } from "./wireframe-experience";
import { WireframeProjects } from "./wireframe-projects";
import { WireframeJourney } from "./wireframe-journey";
import { WireframeEducation } from "./wireframe-education";
import { WireframeGallery } from "./wireframe-gallery";
import { WireframeFooter } from "./wireframe-footer";

const WOBBLE = (
  <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
    <defs>
      <filter id="wobble">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.014 0.022"
          numOctaves={2}
          seed={7}
          result="n"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="n"
          scale={3}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </defs>
  </svg>
);

function paintEdges(root: HTMLElement) {
  root
    .querySelectorAll(
      ".wf-sketch, .wf-photo, .wf-chip, .wf-btn, .wf-xp, .wf-badge, .wf-proj, .wf-edu-card, .wf-quote",
    )
    .forEach((el) => {
      if (!el.querySelector(":scope > .wf-edge")) {
        const edge = document.createElement("div");
        edge.className = "wf-edge";
        el.insertBefore(edge, el.firstChild);
      }
    });
}

export function WireframeHome({ profile }: { profile: IProfile }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const revealedEls = useRef<Set<Element>>(new Set());

  useEffect(() => {
    if (!rootRef.current) return;
    paintEdges(rootRef.current);
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            revealedEls.current.add(e.target);
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    rootRef.current.querySelectorAll(".wf-reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Re-apply .in after every render so React className updates don't wipe it
  useLayoutEffect(() => {
    revealedEls.current.forEach((el) => el.classList.add("in"));
  });

  return (
    <div className="sketch-page" ref={rootRef}>
      {WOBBLE}
      <WireframeHero
        name={profile.name}
        isAvailable={profile.isAvailable}
        abouts={profile.abouts}
        imageUrl={profile.imageUrl}
      />
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 28px" }}>
        <WireframeSkills skills={profile.skills} />
        <hr className="wf-divider" />
        <WireframeExperience experience={profile.experience} />
        <hr className="wf-divider" />
        <WireframeProjects projects={profile.projects} />
        <hr className="wf-divider" />
        <WireframeJourney />
        <hr className="wf-divider" />
        <WireframeEducation
          education={profile.education}
          recommendations={profile.recommendations}
        />
        <hr className="wf-divider" />
        {profile.aboutImages && profile.aboutImages.length > 0 && (
          <WireframeGallery images={profile.aboutImages} />
        )}
      </div>
      <WireframeFooter socials={profile.socials} />
    </div>
  );
}
