import { Outlet } from "@tanstack/react-router";
import { Bell, Search } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b bg-card/60 backdrop-blur-md sticky top-0 z-30 flex items-center gap-3 px-4 md:px-6">
            <SidebarTrigger />
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tenders, clauses, fields…"
                className="pl-9 bg-muted/40 border-transparent focus-visible:bg-background"
              />
            </div>
            <div className="flex-1" />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
            </Button>
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
  );
}
