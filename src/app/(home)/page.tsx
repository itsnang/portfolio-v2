import { Education } from "@/components/education";
import { Experience } from "@/components/experience";
import { MyPlaylist } from "@/components/playlist-component";
import { Projects } from "@/components/project";
import { Skills } from "@/components/skills-component";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProfile } from "../action";
import { AboutImage } from "@/components/about-image";
import { DockNav } from "@/components/nav-dock";
// import { unstable_cacheLife as cacheLife } from "next/cache";

export default async function Home() {
  const profile = await getProfile();
  console.log(profile);
  return (
    <main className="mx-auto w-full max-w-2xl">
      <section>
        {/* profile */}
        <div className="gap-5 flex items-center">
          <Avatar className="size-20 border">
            <AvatarImage className="object-cover" src={profile.imageUrl} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1 className="text-xl font-bold">{profile.name}</h1>
            <p className="text-xs text-gray-500">&quot;{profile.bio}&quot;</p>
          </div>
        </div>
      </section>
      <section className="space-y-4">
        {/* about */}
        <p className="text-base text-muted-foreground pt-4">{profile.abouts}</p>
        <AboutImage imageUrl={profile.aboutImages ?? []} />
      </section>
      {/* skills */}
      <Skills skills={profile.skills} />
      {/* Playlist */}
      <Experience experience={profile.experience} />
      <Education education={profile.education} />
      <Projects projects={profile.projects} />
      <MyPlaylist />
      <DockNav socials={profile.socials} />
    </main>
  );
}
