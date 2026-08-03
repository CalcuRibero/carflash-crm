"use client";

import {
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  FileText,
  Flame,
  type LucideIcon,
  MessageSquare,
  Minus,
  Paperclip,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn, getInitials } from "@/lib/utils";

import { tagTones } from "./data";
import { STATUS_LABELS, type ColumnId } from "../types";
import type { Ticket, TicketInsightLabel, TicketPriority } from "@/lib/api/types";
import { PRIORITY_LABELS } from "@/features/tickets/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const taskInsightIcons: Record<TicketInsightLabel, LucideIcon> = {
  Attachments: Paperclip,
  Comments: MessageSquare,
  Documents: FileText,
};

const priorityBadgeConfig: Record<
  TicketPriority,
  { icon: LucideIcon; variant: "destructive" | "secondary"; className: string }
> = {
  critical: {
    icon: Flame,
    variant: "destructive",
    className: "border-transparent",
  },
  high: {
    icon: Flame,
    variant: "destructive",
    className: "border-transparent",
  },
  low: {
    icon: Minus,
    variant: "secondary",
    className: "bg-slate-500/10 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
  },
  medium: {
    icon: ArrowUpRight,
    variant: "secondary",
    className: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  },
};

export function TaskCard({
  task,
  columnId,
  isOverlay = false,
  onClick,
}: {
  task: Ticket;
  columnId?: ColumnId;
  isOverlay?: boolean;
  onClick?: () => void;
}) {
  const router = useRouter()
  
  
  const showBuildingDetails = columnId === "in_progress";
  const owner = task.createdBy;
  const PriorityIcon = priorityBadgeConfig[task.priority as TicketPriority].icon;
  const creationDate = new Date(task.createdAt).toLocaleDateString('es-AR')

  const handleClickDetail = (ticket: Ticket) => {
    router.push(`/dashboard/kanban/${ticket.id}`);
  };

  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-card p-4 text-card-foreground shadow-xs cursor-pointer hover:bg-accent/50 transition-colors",
        isOverlay && "w-68 rotate-1 shadow-lg cursor-grabbing",
      )}
      onClick={onClick}
    >
      <div className="min-w-0 space-y-1.5">
        <div className="flex flex-col justify-between gap-3">
          <div className="flex items-center">
            <h3 className="min-w-0 truncate font-medium text-sm leading-none items-center">{task.title}</h3>
          </div>
          <Separator />
          <div className="flex items-right gap-2">
            <Badge
              variant={task.isRecurrent ? "default" : "secondary"}
              className="shrink-0 rounded-md border-transparent px-2 font-medium"
            >
              {task.isRecurrent ? "Fijo" : "Variable"}
            </Badge>
            <Badge
              variant={priorityBadgeConfig[task.priority as TicketPriority].variant}
              className={cn(
                "shrink-0 rounded-md border-transparent px-2 font-medium",
                priorityBadgeConfig[task.priority as TicketPriority].className,
              )}
            >
              <PriorityIcon data-icon="inline-start" />
              {PRIORITY_LABELS[task.priority]}
            </Badge>
          </div>
        </div>
        <p className="line-clamp-2 text-muted-foreground text-sm leading-5">{task.description}</p>
      </div>

      {!showBuildingDetails && owner ? (
        <div className="flex items-center gap-1.5">
          <Avatar className="size-5 after:rounded-sm">
            <AvatarFallback className="rounded-sm text-[10px]">{getInitials(owner.fullName)}</AvatarFallback>
          </Avatar>

          <span className="text-muted-foreground text-sm">{owner.fullName}</span>
        </div>
      ) : null}
      <div className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground text-sm">Fecha de Creacion</span>
        <div className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
          <span className="truncate text-sm">{creationDate}</span>
          <CalendarDays className="size-3" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground text-sm">Estado</span>
        {task.status ? (
          <Badge
            variant="secondary"
            className={cn("rounded-md border-transparent px-2 font-medium", tagTones[task.status])}
          >
            {STATUS_LABELS[task.status]}
          </Badge>
        ) : null}
      </div>
      {task.dueDate ? (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground text-sm">Creador</span>
              <div className="flex items-center gap-1.5">
                <span className="truncate text-muted-foreground text-sm">{owner.fullName}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground text-sm">Fecha de Vencimiento</span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="truncate text-sm">{new Date(task.dueDate).toLocaleDateString('es-AR')}</span>
                <CalendarDays className="size-3" />
              </span>
            </div>

          </div>
        </div>
      ) : null}
      <div className="flex items-end w-full">
        <Button variant={"link"} className="hover:cursor-pointer" onClick={() => handleClickDetail(task)}>
          Ver Detalle
        </Button>
      </div>
    </article>
  );
}
