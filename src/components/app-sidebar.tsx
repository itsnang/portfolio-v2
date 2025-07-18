"use client";

import * as React from "react";
import {
  BookOpen,
  LifeBuoy,
  Settings2,
  UserPen,
  Image as ImageLogo,
} from "lucide-react";

import Image from "next/image";

import favIcon from "@/app/favicon.ico";

import { NavMain } from "@/components/nav-main";
// import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavProjects } from "./nav-projects";
import Link from "next/link";

const data = {
  user: {
    name: "Lorn Samnang",
    email: "huotchhayyy@gmail.com",
    avatar: "/favIcon.",
  },
  navMain: [
    {
      title: "Profile",
      url: "#",
      icon: UserPen,
      isActive: true,
      items: [
        {
          title: "Profile",
          url: "/dashboard/profile",
        },
        {
          title: "Skills",
          url: "/dashboard/skills",
        },
        {
          title: "Experience",
          url: "/dashboard/experience",
        },
        {
          title: "Education",
          url: "/dashboard/education",
        },
        {
          title: "Projects",
          url: "/dashboard/project",
        },
        {
          title: "Socials",
          url: "/dashboard/socials",
        },
        {
          title: "Recommendations",
          url: "/dashboard/recommendations",
        },
      ],
    },

    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: LifeBuoy,
    },
  ],
  projects: [
    {
      name: "Images",
      url: "/dashboard/images",
      icon: ImageLogo,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image alt="logo" src={favIcon} height={28} width={28} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Porfolio CMS</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
