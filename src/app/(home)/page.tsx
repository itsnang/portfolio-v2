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
import { getAppConfig } from "@/features/app-config/actions";
import { getProfile } from "@/features/profile/actions";
import { getPublishedBlogPosts } from "@/features/blog/actions";
import { getQueryClient } from "@/lib/tanstack/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";


export default async function Home() {
  const [profile, appConfig, posts] = await Promise.all([
    getProfile(),
    getAppConfig(),
    getPublishedBlogPosts(),
  ]);

  if (appConfig.theme === "wireframe") {
    return <WireframeHome profile={profile} posts={posts} />;
  }

  const heroProfile = {
    imageUrl: profile.imageUrl,
    name: profile.name,
    bio: profile.bio ?? "",
  };

  // profile.socials was already fetched above as part of getProfile()'s single
  // joined query — seed DockNavClient's ["socials"] query from it instead of
  // letting DockNavClient's client-side useQuery fire a second, redundant
  // socials read against the DB.
  const queryClient = getQueryClient();
  queryClient.setQueryData(["socials"], profile.socials);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
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
    </HydrationBoundary>
  );
}
