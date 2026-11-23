"use client";
import { Dock, DockIcon } from "@/components/dock";
import { buttonVariants } from "@portfolio/ui/button";
import { Separator } from "@portfolio/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@portfolio/ui/tooltip";
import { cn } from "@portfolio/ui/cn";
import { HomeIcon, NotebookIcon, Award } from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import type { ISocial } from "@portfolio/db/schema";

export const DockNavClient = ({
  socials,
  blogUrl,
}: {
  socials: ISocial[];
  /** The Blog Site: another Site, so its icon is a plain link. */
  blogUrl: string;
}) => {
  const navbar = [
    { href: "/", icon: HomeIcon, label: "Home", Anchor: Link },
    // Another Site, so a plain link rather than client-side navigation.
    { href: blogUrl, icon: NotebookIcon, label: "Blog", Anchor: "a" as const },
    { href: "/achievement", icon: Award, label: "Achievement", Anchor: Link },
  ];
  const linkClassName = cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-12");

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto mb-4 pb-4 flex origin-bottom h-full max-h-14">
      <Dock className="z-50 pointer-events-auto relative mx-auto flex min-h-full h-full items-center px-1 bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] ">
        {navbar.map((item) => (
          <DockIcon key={item.href}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <item.Anchor href={item.href} className={linkClassName} aria-label={item.label}>
                    <item.icon className="size-4" />
                  </item.Anchor>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DockIcon>
        ))}
        <Separator orientation="vertical" className="h-full" />
        {socials.map((social) => (
          <DockIcon key={social.name}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    target="_blank"
                    href={social.url}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-12"
                    )}
                    aria-label={`Visit ${social.name} profile`}
                  >
                    <Image
                      src={social.icon}
                      alt={social.name}
                      width={18}
                      height={18}
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{social.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DockIcon>
        ))}
      </Dock>
    </div>
  );
};
