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
      className={`w-full bg-gradient-to-r from-primary/20 to-accent/20 lg:h-80 relative mb-28 md:h-60 h-40 block rounded-lg ${className}`}
    >
      <Image
        src="/cover.jpg"
        alt="Hero profile cover image"
        fill
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1024px"
        className="object-cover rounded-lg"
        quality={75}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLli5ctTRWEVKGRUxLNUfKCgHkbj0fwAJA2rD47IcOUn3hJJ39+y+j9BgCY2nZF0Vz4rZDhAc9wBUVGnMhYUmyWxYs="
      />
      <section>
        {/* profile */}
        <div className="gap-2 flex flex-col absolute -bottom-28 left-6">
          <Avatar className="size-28 border">
            <AvatarImage
              alt={`${profile.name} profile`}
              className="object-cover"
              src={profile.imageUrl}
            />
            <AvatarFallback>SN</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-sm text-muted-foreground">&quot;{profile.bio}&quot;</p>
          </div>
        </div>
      </section>
    </div>
  );
}
