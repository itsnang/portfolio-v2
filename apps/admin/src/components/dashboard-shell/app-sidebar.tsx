import * as React from "react";
import Link from "next/link";

import { NavMain } from "@/components/dashboard-shell/nav-main";
import { NavUser, type NavUserProps } from "@/components/dashboard-shell/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: NavUserProps["user"] }) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <span className="grid size-8 place-items-center rounded-md bg-foreground font-mono text-xs font-medium text-background">
                  LS
                </span>
                <span className="grid flex-1 text-left leading-tight">
                  <span className="truncate text-sm font-medium">Lorn Samnang</span>
                  <span className="truncate text-xs text-muted-foreground">Portfolio admin</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
