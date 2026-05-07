import { Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { WorkspaceProvider } from "@/lib/workspace";

export function AppLayout() {
  return (
    <WorkspaceProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-16 border-b bg-card/60 backdrop-blur-md sticky top-0 z-30 flex items-center gap-3 px-4 md:px-6">
              <SidebarTrigger />
              <div className="flex-1" />
              <div className="flex items-center gap-3 pl-3 border-l">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium leading-tight">Aarav Mehta</p>
                  <p className="text-xs text-muted-foreground">Sales Engineer</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                  AM
                </div>
              </div>
            </header>
            <main className="flex-1">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </WorkspaceProvider>
  );
}
