import { Link, useRouterState } from "@tanstack/react-router";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SubNavItem {
  to: string;
  label: string;
}

interface SubNavProps {
  items: SubNavItem[];
  actions?: ReactNode;
}

export function SubNav({ items, actions }: SubNavProps) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <div className="sticky top-16 z-20 border-b mb-6 -mx-1 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="h-12 px-1 flex items-center justify-between gap-3">
        <div className="flex gap-1 min-w-0 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {items.map((item) => {
              const active =
                path === item.to || (item.to.endsWith("/") && path.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap",
                    active
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-2 flex-nowrap whitespace-nowrap shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export function ModuleShell({
  actions,
  subnav,
  children,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
  subnav: SubNavItem[];
  children: ReactNode;
}) {
  return (
    <div className="px-4 md:px-8 py-1 max-w-[1600px] mx-auto">
      <SubNav items={subnav} actions={actions} />
      {children}
    </div>
  );
}
