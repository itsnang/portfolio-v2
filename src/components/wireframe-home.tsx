import type { IProfile } from "@/types/profile.type";
import { WireframeHero } from "./wireframe-hero";
import { WireframeSkills } from "./wireframe-skills";
import { WireframeExperience } from "./wireframe-experience";
import { WireframeProjects } from "./wireframe-projects";
import { WireframeJourney } from "./wireframe-journey";
import { WireframeEducation } from "./wireframe-education";
import { WireframeGallery } from "./wireframe-gallery";
import { WireframeFooter } from "./wireframe-footer";
import { WireframeScrollFx } from "./wireframe-scroll-fx";

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

export function WireframeHome({ profile }: { profile: IProfile }) {
  return (
    <WireframeScrollFx>
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
    </WireframeScrollFx>
  );
}
