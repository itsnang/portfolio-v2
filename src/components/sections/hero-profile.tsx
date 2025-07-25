"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

interface HeroProfileProps {
  profile: {
    imageUrl: string;
    name: string;
    bio: string;
  };
  className?: string;
}

export function HeroProfile({ profile, className = "" }: HeroProfileProps) {
  return (
    <div
      className={`w-full bg-linear-to-r from-blue-200 to-cyan-200 lg:h-80 relative mb-[114px] md:h-60 h-40 block rounded-lg ${className}`}
    >
      <Image
        src="/cover.jpg"
        alt="Hero profile cover image"
        fill
        priority
        sizes="100vw"
        className="object-cover rounded-lg"
        quality={90}
      />
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
  );
}
