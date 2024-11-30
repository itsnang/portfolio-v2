import { Dock, DockIcon } from "@/components/dock";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { HomeIcon, NotebookIcon } from "lucide-react";
import Link from "next/link";
import { Icons } from "./icons";

const navbar = [
  { href: "/", icon: HomeIcon, label: "Home" },
  { href: "/blog", icon: NotebookIcon, label: "Blog" },
];
const socials = [
  {
    name: "GitHub",
    url: "https://dub.sh/dillion-github",
    icon: Icons.github,
  },
  {
    name: "LinkedIn",
    url: "https://dub.sh/dillion-linkedin",
    icon: Icons.linkedin,
  },
  {
    name: "Send Email",
    url: "#",
    icon: Icons.email,
  },
];

export default function DockNav() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto mb-4 pb-4 flex origin-bottom h-full max-h-14">
      <div className="fixed bottom-0 inset-x-0 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-background"></div>
      <Dock className="z-50 pointer-events-auto relative mx-auto flex min-h-full h-full items-center px-1 bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] ">
        {navbar.map((item) => (
          <DockIcon key={item.href}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-12"
                    )}
                  >
                    <item.icon className="size-4" />
                  </Link>
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
                    href={social.url}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-12"
                    )}
                  >
                    <social.icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{social.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DockIcon>
        ))}
        <Separator orientation="vertical" className="h-full py-2" />
        <DockIcon>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>{/* <ModeToggle /> */}</TooltipTrigger>
              <TooltipContent>
                <p>Theme</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DockIcon>
      </Dock>
    </div>
  );
}
