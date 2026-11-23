import type { Metadata } from "next";
import { AppSidebar } from "@/components/dashboard-shell/app-sidebar";
import { DashboardBreadcrumb } from "@/components/dashboard-shell/dashboard-breadcrumb";
import { requireAuth } from "@/lib/auth/get-current-user";
import { Separator } from "@portfolio/ui/separator";
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
    <div className="dark bg-background text-foreground min-h-screen">
      <ReactQueryProvider>
        <SidebarProvider>
          <AppSidebar user={user} />
          <SidebarInset>
            <main>
              <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <DashboardBreadcrumb />
                </div>
              </header>
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </ReactQueryProvider>
    </div>
  );
}
