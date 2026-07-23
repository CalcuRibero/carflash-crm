"use client";

import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { GripVertical, MoreVertical, Plus } from "lucide-react";

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

export function MobileKanbanColumn({ column, tasks, onTaskClick }: KanbanColumnProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } = useSortable({
        id: column.id,
        data: { type: "column", columnId: column.id },
    });

    return (
        <section
            ref={setNodeRef}
            style={{
                transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
                transition,
            }}
            className={cn(
                "flex min-h-0 flex-col rounded-t-xl border bg-muted/50 transition-colors",
                isOver && "bg-muted/70",
                isDragging && "opacity-60",
            )}
        >
            <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
                <div className="scrollbar-thin flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 pb-3 [scrollbar-color:var(--border)_transparent] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1">
                    {tasks.map((task) => (
                        <SortableTaskCard key={task.id} task={task} columnId={column.id} onClick={() => onTaskClick?.(task)} />
                    ))}
                </div>
            </SortableContext>
        </section>
    );
}
