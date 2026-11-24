"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { IProfile } from "@portfolio/db/schema";
import { WireframeHero } from "./wireframe-hero";
import { WireframeSkills } from "./wireframe-skills";
import { WireframeExperience } from "./wireframe-experience";
import { WireframeProjects } from "./wireframe-projects";
import { WireframeJourney, type WireframeAchievement } from "./wireframe-journey";
import { WireframeEducation } from "./wireframe-education";
import { WireframeGallery } from "./wireframe-gallery";
import { WireframeBlogHome } from "./wireframe-blog-home";
import type { WireframeBlogPostSummary } from "./wireframe-blog-card";
import { WireframeFooter } from "./wireframe-footer";
import { HOME_EDGE_SELECTORS, observeReveals, paintEdges, Wobble } from "./wireframe-sketch";



export function WireframeHome({
  profile,
  achievements,
  posts = [],
  postBaseUrl,
  allPostsUrl,
}: {
  profile: IProfile;
  achievements: WireframeAchievement[];
  posts?: WireframeBlogPostSummary[];
  /** The address Posts live under; see WireframeBlogHome. */
  postBaseUrl: string;
  /** The Post list. */
  allPostsUrl: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const revealedEls = useRef<Set<Element>>(new Set());

  useEffect(() => {
    if (!rootRef.current) return;
    paintEdges(rootRef.current, HOME_EDGE_SELECTORS);
    const io = observeReveals(rootRef.current, {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px",
      onReveal: (el) => revealedEls.current.add(el),
    });
    return () => io.disconnect();
  }, []);

  // Re-apply .in after every render so React className updates don't wipe it
  useLayoutEffect(() => {
    revealedEls.current.forEach((el) => el.classList.add("in", "wf-revealed"));
  });

  return (
    <div className="sketch-page" ref={rootRef}>
      <Wobble />
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
        <WireframeJourney achievements={achievements} />
        <hr className="wf-divider" />
        <WireframeEducation
          education={profile.education}
          recommendations={profile.recommendations}
        />
        {posts.length > 0 && (
          <>
            <hr className="wf-divider" />
            <WireframeBlogHome posts={posts} postBaseUrl={postBaseUrl} allPostsUrl={allPostsUrl} />
          </>
        )}
        {profile.aboutImages && profile.aboutImages.length > 0 && (
          <>
            <hr className="wf-divider" />
            <WireframeGallery images={profile.aboutImages} />
          </>
        )}
      </div>
      <WireframeFooter socials={profile.socials} />
    </div>
  );
}
