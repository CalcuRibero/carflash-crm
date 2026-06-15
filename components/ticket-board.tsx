"use client";

import * as React from "react";

import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ListFilter, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { TicketCard, type TicketCardItem } from "./ticket-card";

export interface TicketColumn {
  id: string;
  title: string;
  description: string;
  tickets: TicketCardItem[];
}

interface TicketBoardProps {
  columns: TicketColumn[];
}

export function TicketBoard({ columns: initialColumns }: TicketBoardProps) {
  const [columns, setColumns] = React.useState(initialColumns);
  const [activeTicket, setActiveTicket] = React.useState<TicketCardItem | null>(null);
  const [activeColumnId, setActiveColumnId] = React.useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  function findColumn(columnId: string) {
    return columns.find((column) => column.id === columnId);
  }

  function findTicket(ticketId: string) {
    for (const column of columns) {
      const ticket = column.tickets.find((currentTicket) => currentTicket.id === ticketId);
      if (ticket) return { ticket, columnId: column.id };
    }
    return null;
  }

  function handleDragStart(event: DragStartEvent) {
    const activeId = String(event.active.id);
    const result = findTicket(activeId);
    if (!result) return;

    setActiveTicket(result.ticket);
    setActiveColumnId(result.columnId);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const source = findTicket(activeId);
    const target = findTicket(overId);

    if (!source || !target) return;

    if (source.columnId === target.columnId) {
      setColumns((currentColumns) => {
        const sourceColumn = currentColumns.find((column) => column.id === source.columnId);
        const targetColumn = currentColumns.find((column) => column.id === target.columnId);
        if (!sourceColumn || !targetColumn) return currentColumns;

        const oldIndex = sourceColumn.tickets.findIndex((ticket) => ticket.id === activeId);
        const newIndex = targetColumn.tickets.findIndex((ticket) => ticket.id === overId);
        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return currentColumns;

        return currentColumns.map((column) => {
          if (column.id !== source.columnId) return column;
          const reordered = [...column.tickets];
          const [moved] = reordered.splice(oldIndex, 1);
          reordered.splice(newIndex, 0, moved);
          return { ...column, tickets: reordered };
        });
      });
      return;
    }

    setColumns((currentColumns) => {
      const sourceColumn = currentColumns.find((column) => column.id === source.columnId);
      const targetColumn = currentColumns.find((column) => column.id === target.columnId);
      if (!sourceColumn || !targetColumn) return currentColumns;

      const sourceIndex = sourceColumn.tickets.findIndex((ticket) => ticket.id === activeId);
      const targetIndex = targetColumn.tickets.findIndex((ticket) => ticket.id === overId);
      if (sourceIndex === -1 || targetIndex === -1) return currentColumns;

      const movedTicket = sourceColumn.tickets[sourceIndex];
      const nextSourceTickets = sourceColumn.tickets.filter((ticket) => ticket.id !== activeId);
      const nextTargetTickets = [...targetColumn.tickets];
      nextTargetTickets.splice(targetIndex, 0, movedTicket);

      return currentColumns.map((column) => {
        if (column.id === source.columnId) return { ...column, tickets: nextSourceTickets };
        if (column.id === target.columnId) return { ...column, tickets: nextTargetTickets };
        return column;
      });
    });
  }

  function handleDragEnd(_event: DragEndEvent) {
    setActiveTicket(null);
    setActiveColumnId(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Tickets board</h2>
          <p className="text-sm text-muted-foreground">Drag cards between lanes to update the board.</p>
        </div>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo ticket
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-4 xl:grid-cols-3">
          {columns.map((column) => (
            <Card key={column.id} className="border-border/70 bg-muted/20">
              <CardHeader className="flex-row items-center justify-between px-4 pb-2 pt-4">
                <div>
                  <CardTitle className="text-base">{column.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{column.description}</p>
                </div>
                <div className="rounded-full bg-background px-2.5 py-1 text-sm font-medium text-foreground">
                  {column.tickets.length}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 px-4 pb-4">
                <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  <span>Backlog</span>
                  <ListFilter className="h-3.5 w-3.5" />
                </div>
                <SortableContext items={column.tickets.map((ticket) => ticket.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {column.tickets.map((ticket) => (
                      <TicketCard key={ticket.id} ticket={ticket} columnId={column.id} />
                    ))}
                  </div>
                </SortableContext>
              </CardContent>
            </Card>
          ))}
        </div>
      </DndContext>

      {activeTicket ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 flex justify-center">
          <div className="w-full max-w-md">
            <TicketCard ticket={activeTicket} columnId={activeColumnId ?? ""} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
