import { Education } from "@/components/education";
import { Experience } from "@/components/experience";
import { MyPlaylist } from "@/components/playlist-component";
import { Projects } from "@/components/project";
import { Skills } from "@/components/skills-component";
import { Recommendations } from "@/components/recommendations";
import { getProfile } from "../action";
import { AboutImage } from "@/components/about-image";
import { DockNav } from "@/components/nav-dock";
import { NavBar } from "@/components/navbar";
import { HeroProfile } from "@/components/hero-profile";

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
          <AboutImage imageUrl={profile.aboutImages ?? []} />
        </section>
        {/* skills */}
        <Skills skills={profile.skills} />
        <Experience experience={profile.experience} />
        <Education education={profile.education} />
        <Recommendations recommendations={profile.recommendations} />

        <Projects projects={profile.projects} />
        {/* Playlist */}
        <MyPlaylist />
        <DockNav socials={profile.socials} />
      </main>
    </>
  );
}
