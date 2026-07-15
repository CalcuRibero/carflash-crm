"use client";

import { useSortable } from "@dnd-kit/sortable";

import { cn } from "@/lib/utils";

import { TaskCard } from "./task-card";
import type { ColumnId } from "../types";
import type { Ticket } from "@/lib/api/types";

export function SortableTaskCard({ task, columnId, onClick }: { task: Ticket; columnId: ColumnId; onClick?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "task", task },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
      }}
      className={cn("touch-none", isDragging && "opacity-30")}
      {...attributes}
      {...listeners}
    >
      <TaskCard task={task} columnId={columnId} onClick={onClick} />
    </div>
  );
}
