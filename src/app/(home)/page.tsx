import { Education } from "@/components/education";
import { Experience } from "@/components/experience";
import { MyPlaylist } from "@/components/playlist-component";
import { Projects } from "@/components/project";
import { Skills } from "@/components/skills-component";
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
      <NavBar isAvailable={profile.isAvailable} />
      <main className="mx-auto w-full max-w-3xl">
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
        <Projects projects={profile.projects} />
        {/* Playlist */}
        <MyPlaylist />
        <DockNav socials={profile.socials} />
      </main>
    </>
  );
}
