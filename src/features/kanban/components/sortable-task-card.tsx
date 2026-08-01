"use client";

import { useSortable } from "@dnd-kit/react/sortable";

import { cn } from "@/lib/utils";

import { TaskCard } from "./task-card";
import type { ColumnId } from "../types";
import type { Ticket } from "@/lib/api/types";

export function SortableTaskCard({ task, columnId, index, onClick }: { task: Ticket; columnId: ColumnId; index: number; onClick?: () => void }) {
  const { ref, isDragging } = useSortable({
    id: task.id,
    index,
    type: "task", 
    accept: "task",
    group: columnId,
  });

  return (
    <div
      ref={ref}
      data-dragging={isDragging}
      className={cn("touch-none", isDragging && "opacity-30")}
    >
      <TaskCard task={task} columnId={columnId} onClick={onClick} />
    </div>
  );
}
