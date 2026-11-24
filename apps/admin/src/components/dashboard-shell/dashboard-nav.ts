import { Image as ImageIcon, Settings2, UserPen, type LucideIcon } from "lucide-react";

export interface DashboardNavGroup {
  title: string;
  icon: LucideIcon;
  items: { title: string; url: string }[];
}

/** Every dashboard page, grouped as the sidebar shows them. The header title reads from here too. */
export const dashboardNav: DashboardNavGroup[] = [
  {
    title: "Content",
    icon: UserPen,
    items: [
      { title: "Profile", url: "/dashboard/profile" },
      { title: "Skills", url: "/dashboard/skills" },
      { title: "Experience", url: "/dashboard/experience" },
      { title: "Education", url: "/dashboard/education" },
      { title: "Projects", url: "/dashboard/project" },
      { title: "Blog", url: "/dashboard/blog" },
      { title: "Socials", url: "/dashboard/socials" },
      { title: "Recommendations", url: "/dashboard/recommendations" },
    ],
  },
  {
    title: "Media",
    icon: ImageIcon,
    items: [{ title: "Images", url: "/dashboard/images" }],
  },
  {
    title: "Settings",
    icon: Settings2,
    items: [{ title: "App Config", url: "/dashboard/config" }],
  },
];

/** The nav entry a path belongs to, matching sub-pages such as /dashboard/images/upload. */
export function findNavEntry(pathname: string) {
  for (const group of dashboardNav) {
    const item = group.items.find(
      ({ url }) => pathname === url || pathname.startsWith(`${url}/`)
    );
    if (item) return { group: group.title, item: item.title };
  }
  return null;
}
