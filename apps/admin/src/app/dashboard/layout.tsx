import type { Metadata } from "next";
import { AppSidebar } from "@/components/dashboard-shell/app-sidebar";
import { DashboardBreadcrumb } from "@/components/dashboard-shell/dashboard-breadcrumb";
import { requireAuth } from "@/lib/auth/session";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// The dashboard is private — keep it out of search results even though
// robots.txt already disallows /dashboard/.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <ReactQueryProvider>
      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset className="min-w-0">
          <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center gap-2 border-b border-border bg-background/90 px-4 backdrop-blur">
            <SidebarTrigger className="-ml-1" />
            <DashboardBreadcrumb />
          </header>
          <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-10 md:py-10">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </ReactQueryProvider>
  );
}
