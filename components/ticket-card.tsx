"use client";

import { useSortable } from "@dnd-kit/sortable";
import { Clock3, GripVertical, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface TicketCardItem {
  id: string;
  title: string;
  description: string;
  priority: "Baja" | "Media" | "Alta";
  assignee: string;
  estimate: string;
}

interface TicketCardProps {
  ticket: TicketCardItem;
  columnId: string;
}

const priorityStyles: Record<TicketCardItem["priority"], string> = {
  Baja: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Media: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Alta: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

export function TicketCard({ ticket, columnId }: TicketCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: ticket.id,
    data: { type: "ticket", ticket, columnId },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
      }}
      className={cn("touch-none", isDragging && "opacity-55")}
    >
      <Card className="cursor-grab border-border/70 bg-background shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing">
        <CardHeader className="flex-row items-start justify-between gap-2 px-4 pt-4 pb-3">
          <div className="min-w-0 space-y-1">
            <CardTitle className="truncate text-sm font-semibold leading-tight">{ticket.title}</CardTitle>
            <CardContent className="px-0 py-0 text-sm text-muted-foreground">{ticket.description}</CardContent>
          </div>
          <button
            type="button"
            aria-label={`Drag ${ticket.title}`}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2 px-4 pb-4">
          <Badge variant="secondary" className={priorityStyles[ticket.priority]}>
            {ticket.priority}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock3 className="h-3.5 w-3.5" />
            {ticket.estimate}
          </div>
          <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <UserRound className="h-3.5 w-3.5" />
            {ticket.assignee}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
