import { Education } from "@/components/education";
import { Experience } from "@/components/experience";
import { MyPlaylist } from "@/components/playlist-component";
import { Projects } from "@/components/project";
import { Skills } from "@/components/skills-component";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProfile } from "../action";
import { AboutImage } from "@/components/about-image";
import { DockNav } from "@/components/nav-dock";
import { NavBar } from "@/components/navbar";

export default async function Home() {
  const profile = await getProfile();
  console.log(profile);
  return (
    <>
      <NavBar isAvailable={profile.isAvailable} />
      <main className="mx-auto w-full max-w-2xl">
      <div className="w-full bg-gradient-to-r from-blue-200 to-cyan-200 lg:h-56 md:h-44 relative mb-[114px] h-40 block rounded-lg">
        {/* <Image
          src="/assets/kdrama.jpg"
          alt="hero"
          layout="fill"
          objectFit="cover"
        /> */}
         <section>
          {/* profile */}
          <div className="gap-2 flex flex-col absolute -bottom-[112px] left-6">
            <Avatar className="size-28 border">
              <AvatarImage className="object-cover" src={profile.imageUrl} />
              <AvatarFallback>SN</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h1 className="text-xl font-bold">{profile.name}</h1>
              <p className="text-xs text-gray-500">&quot;{profile.bio}&quot;</p>
            </div>
          </div>
        </section>
      </div>
       
        <section className="space-y-4">
   
          {/* about */}
          <p className="text-base text-muted-foreground pt-4">
            {profile.abouts}
          </p>
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
    </>
  );
}
