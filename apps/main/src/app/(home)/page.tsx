import { DockNavClient } from "@/components/nav-dock-client";
import { Education } from "@/features/education/components/education-section";
import { Experience } from "@/features/experience/components/experience-section";
import { HeroProfile } from "@/features/profile/components/hero-profile";
import { NavBar } from "@/components/navbar";
import { Projects } from "@/features/project/components/project-section";
import { Recommendations } from "@/features/recommendations/components/recommendations-section";
import { Skills } from "@/features/skills/components/skills-section";
import { MaintenanceBanner } from "@/components/maintenance-banner";
import { WireframeHome } from "@/components/wireframe/wireframe-home";
import { MasonryGallery } from "@/components/ui/masonry-gallery";
import { getAppConfig } from "@/features/app-config/queries";
import { getProfile } from "@/features/profile/queries";
import { getPublishedBlogPosts } from "@/features/blog/queries";
import { achievements } from "@/features/achievement/data";


export default async function Home() {
  const [profile, appConfig, posts] = await Promise.all([
    getProfile(),
    getAppConfig(),
    getPublishedBlogPosts(),
  ]);

  if (appConfig.theme === "wireframe") {
    // The achievement data carries JSX icons, which the wireframe theme doesn't
    // render, so only plain fields cross into the client component.
    const wireframeAchievements = achievements.map(
      ({ id, title, description, year, category, links }) => ({
        id,
        title,
        description,
        year,
        category,
        links: links?.map(({ title, href }) => ({ title, href })),
      })
    );

    return (
      <WireframeHome
        profile={profile}
        achievements={wireframeAchievements}
        posts={posts}
      />
    );
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

        <DockNavClient socials={profile.socials} />
      </main>
    </>
  );
}
