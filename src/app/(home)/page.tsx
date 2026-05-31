import { DockNavClient } from "@/components/nav-dock-client";
import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { HeroProfile } from "@/components/sections/hero-profile";
import { NavBar } from "@/components/sections/navbar";
import { Projects } from "@/components/sections/project";
import { Recommendations } from "@/components/sections/recommendations";
import { Skills } from "@/components/sections/skills-component";
import { MaintenanceBanner } from "@/components/maintenance-banner";
import { WireframeHome } from "@/components/wireframe-home";
import { MasonryGallery } from "@/components/ui/masonry-gallery";
import { getAppConfig, getProfile } from "../action";


export default async function Home() {
  const [profile, appConfig] = await Promise.all([getProfile(), getAppConfig()]);

  if (appConfig.theme === "wireframe") {
    return <WireframeHome profile={profile} />;
  }

  const heroProfile = {
    imageUrl: profile.imageUrl,
    name: profile.name,
    bio: profile.bio ?? "",
  };

  return (
    <>
      {appConfig.maintenance && <MaintenanceBanner />}
      <main className="mx-auto w-full max-w-4xl">
        <NavBar isAvailable={profile.isAvailable} />
        <HeroProfile profile={heroProfile} />

        <section className="space-y-4 pt-8">
          <div className="relative">
            <p className="text-base text-muted-foreground leading-relaxed">
              {profile.abouts}
            </p>
          </div>
        </section>

        <Skills skills={profile.skills} />
        <Experience experience={profile.experience} />
        <Education education={profile.education} />
        <Recommendations recommendations={profile.recommendations} />
        <Projects projects={profile.projects} />

        {profile.aboutImages && profile.aboutImages.length > 0 && (
          <>
            <h2 className="text-lg font-semibold mb-6 text-foreground">Gallery</h2>
            <MasonryGallery
              images={profile.aboutImages.map((imageUrl, index) => ({
                id: `about-${index}`,
                src: imageUrl,
                alt: `Gallery image ${index + 1}`,
                width: 400,
                height: Math.floor(Math.random() * 300) + 400,
              }))}
              className="max-w-full"
              gap="gap-3"
            />
          </>
        )}

        <DockNavClient />
      </main>
    </>
  );
}
