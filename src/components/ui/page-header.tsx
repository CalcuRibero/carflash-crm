import * as React from "react";

import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon?: LucideIcon;
  category?: string;
  title?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: LucideIcon;
  };
}

export function PageHeader({ icon: Icon, category, title, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        {Icon && category && (
          <div className="flex items-center gap-2 text-primary">
            <Icon className="h-5 w-5" />
            <p className="text-sm font-semibold uppercase tracking-[0.32em]">{category}</p>
          </div>
        )}
        { title &&
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
        }
      </div>

      {action && (
        <Button className="gap-2" onClick={action.onClick} asChild={action.href ? true : false}>
          {action.href ? (
            <a href={action.href}>
              {action.icon && <action.icon className="h-4 w-4" />}
              {action.label}
            </a>
          ) : (
            <>
              {action.icon && <action.icon className="h-4 w-4" />}
              {action.label}
            </>
          )}
        </Button>
      )}
    </div>
  );
}
