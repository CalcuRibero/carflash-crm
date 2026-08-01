"use client";

import { useDroppable } from "@dnd-kit/react";
import {CollisionPriority} from '@dnd-kit/abstract';
import { MoreVertical, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { SortableTaskCard } from "./sortable-task-card";
import { STATUS_LABELS, type Column } from "../types";
import type { Ticket } from "@/lib/api/types";

interface KanbanColumnProps {
  column: Column;
  tasks: Ticket[];
  onTaskClick?: (task: Ticket) => void;
}

export function KanbanColumn({ column, tasks, onTaskClick }: KanbanColumnProps) {
  const { ref, isDropTarget } = useDroppable({
    id: column.id,
    type: "column", 
    accept: "task",
    collisionPriority: CollisionPriority.Low
  });

  return (
    <section
      ref={ref}
      className={cn(
        "flex min-h-0 flex-col rounded-t-xl border bg-muted/50 transition-colors",
        isDropTarget && "bg-muted/70",
      )}
    >
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-0.5">
            <h2 className="truncate font-medium text-base leading-none">{STATUS_LABELS[column.id]}</h2>
          </div>
          <p className="text-muted-foreground text-sm tabular-nums leading-none">
            {tasks.length} {tasks.length === 1 ? "tarea" : "tareas"}
          </p>
        </div>
      </div>

        <div className="scrollbar-thin flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 pb-3 [scrollbar-color:var(--border)_transparent] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1">
          {tasks.map((task, index) => (
            <SortableTaskCard key={task.id} task={task} columnId={column.id} index={index} />
          ))}
        </div>
    </section>
  );
}
