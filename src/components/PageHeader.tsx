import { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
      <div>
        {eyebrow && (
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-2">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-2 max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}
