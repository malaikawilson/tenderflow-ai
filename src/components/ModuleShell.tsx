import { Link, useRouterState } from "@tanstack/react-router";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SubNavItem {
  to: string;
  label: string;
}

interface SubNavProps {
  items: SubNavItem[];
}

export function SubNav({ items }: SubNavProps) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <div className="border-b mb-8 -mx-1 overflow-x-auto">
      <div className="flex gap-1 px-1 min-w-max">
        {items.map((item) => {
          const active = path === item.to || (item.to.endsWith("/") && path.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function ModuleShell({
  eyebrow,
  title,
  description,
  actions,
  subnav,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  subnav: SubNavItem[];
  children: ReactNode;
}) {
  return (
    <div className="px-4 md:px-8 py-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-2">
            {eyebrow}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">{description}</p>
        </div>
        {actions && <div className="flex gap-2 flex-wrap">{actions}</div>}
      </div>
      <SubNav items={subnav} />
      {children}
    </div>
  );
}
