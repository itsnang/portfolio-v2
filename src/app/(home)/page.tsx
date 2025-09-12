import { DockNav } from "@/components/nav-dock";
import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { HeroProfile } from "@/components/sections/hero-profile";
import { NavBar } from "@/components/sections/navbar";
import { Projects } from "@/components/sections/project";
import { Recommendations } from "@/components/sections/recommendations";
import { Skills } from "@/components/sections/skills-component";
import BlurFade from "../../components/ui/blur-fade";
import { getProfile } from "../action";

export const revalidate = 3600; // Cache for 1 hour

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
        <BlurFade delay={0.2} duration={0.8}>
          <HeroProfile profile={heroProfile} />
        </BlurFade>

        <BlurFade delay={0.4} duration={0.7}>
          <section className="space-y-4 mb-12 pt-12">
            <div className="relative">
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-primary/50 to-transparent rounded-full" />
              <div className="pl-6">
                <h2 className="text-lg font-semibold mb-4 text-foreground">
                  About Me
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {profile.abouts}
                </p>
              </div>
            </div>
          </section>
        </BlurFade>

        {/* Skills section */}
        <BlurFade delay={0.6} duration={0.7}>
          <Skills skills={profile.skills} />
        </BlurFade>

        {/* Experience section */}
        <BlurFade delay={0.8} duration={0.7}>
          <Experience experience={profile.experience} />
        </BlurFade>

        {/* Education section */}
        <BlurFade delay={1.0} duration={0.7}>
          <Education education={profile.education} />
        </BlurFade>

        {/* Recommendations section */}
        <BlurFade delay={1.2} duration={0.7}>
          <Recommendations recommendations={profile.recommendations} />
        </BlurFade>

        {/* Projects section */}
        <BlurFade delay={1.4} duration={0.7}>
          <Projects projects={profile.projects} />
        </BlurFade>

        {/* Dock navigation */}
        <DockNav socials={profile.socials} />
      </main>
    </>
  );
}
