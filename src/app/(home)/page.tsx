import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/project";
import { Recommendations } from "@/components/sections/recommendations";
import { Skills } from "@/components/sections/skills-component";
import { getProfile } from "../action";
// import { AboutImage } from "@/components/sections/about-image";
import { DockNav } from "@/components/nav-dock";
import { HeroProfile } from "@/components/sections/hero-profile";
import { NavBar } from "@/components/sections/navbar";

export const revalidate = 0;

export default async function Home() {
  const profile = await getProfile();
  const heroProfile = {
    imageUrl: profile.imageUrl,
    name: profile.name,
    bio: profile.bio ?? "",
  };
  return (
    <>
      <main className="mx-auto w-full max-w-4xl">
        <NavBar isAvailable={profile.isAvailable} />
        <HeroProfile profile={heroProfile} />

        <section className="space-y-4">
          {/* about */}
          <p className="text-base text-muted-foreground pt-4">
            {profile.abouts}
          </p>
          {/* <AboutImage imageUrl={profile.aboutImages ?? []} /> */}
        </section>
        {/* skills */}
        <Skills skills={profile.skills} />
        <Experience experience={profile.experience} />
        <Education education={profile.education} />
        <Recommendations recommendations={profile.recommendations} />

        <Projects projects={profile.projects} />
        {/* Playlist */}
        {/* <MyPlaylist /> */}
        <DockNav socials={profile.socials} />
      </main>
    </>
  );
}
