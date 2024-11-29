import { BlurFadeDemo } from "@/components/bento-demo";
import { MyPlaylist } from "@/components/playlist-component";
import { Skills } from "@/components/skills-component";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function Home() {
  // const test = await getProfile();
  // console.log(test);
  return (
    <main>
      <section>
        <div className="mx-auto w-full max-w-2xl">
          {/* profile */}
          <div className="gap-5 flex items-center">
            <Avatar className="size-20 border">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h1 className="text-xl font-bold">Lorn Samnang 🎸</h1>
              <p className="text-xs text-gray-500">
                &quot;Why nice girls hate me?&quot;
              </p>
            </div>
          </div>
          {/* about */}
          <div className="space-y-4">
            <p className="text-base text-muted-foreground pt-4">
              Hi, this is Samnang ✌️. introverted nobody, a Software Developer.
              I am highly perceptive and very imaginative by seeking inspiration
              in every moment and currently living in Phnom Penh, Cambodia.
            </p>
            <BlurFadeDemo />
          </div>
          {/* skills */}
          <div className="pt-4">
            <Skills />
          </div>
          {/* Playlist */}
          <MyPlaylist />
        </div>
      </section>
    </main>
  );
}
