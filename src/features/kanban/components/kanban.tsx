"use client";

import {useState, useEffect, useRef } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { TicketsModal, useCreateTicketModal, useEditTicketModal, useTickets, useUpdateTicket } from "@/features/tickets";
import type { Ticket } from "@/lib/api/types";

import { columnIds, columns } from "./data";
import { KanbanColumn } from "./kanban-column";
import type { BoardState, ColumnId } from "../types";
import { findColumnId, findTask, INITIAL_BOARD } from "./utils";
import { MobileKanbanColumn } from "./mobile-kanban-column";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from '@dnd-kit/helpers';
import { useUpdateTicketStatus } from "@/features/tickets/hooks/useUpdateTicketStatus";
import { isSortable } from "@dnd-kit/react/sortable";
import { useAuth } from "@/stores/auth/auth-provider";

export function Kanban() {
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [columnOrder, setColumnOrder] = useState<ColumnId[]>(columnIds);
  const [activeTask, setActiveTask] = useState<Ticket | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<ColumnId | null>(null);
  
  const {user} = useAuth()
  const getTickets = useTickets()
  const createTicketModal = useCreateTicketModal();
  const editTicketModal = useEditTicketModal();
  const orderedColumns = columnOrder.flatMap((columnId) => columns.find((column) => column.id === columnId) ?? []);
  const updateTicketStatus = useUpdateTicketStatus()

  useEffect(() => {
    const createdTicket = createTicketModal.createdTicket;
    if (!user) return;
    if (!createdTicket) return;
    if (!createdTicket.assignedTo) return;
    if (createdTicket.assignedTo.id === user.id ) return;
    setBoard((currentBoard) => ({
        ...currentBoard,
        [createdTicket.status]: [createdTicket, ...currentBoard[createdTicket.status]],
      })
    );

  }, [createTicketModal.createdTicket]);

  useEffect(() => {
    const editedTicket = editTicketModal.editedTicket;
    if (!editedTicket) return;
    setBoard((currentBoard) => {
      const updatedBoard = { ...currentBoard };
      const columnIds = Object.keys(updatedBoard) as Array<keyof typeof updatedBoard>;
      for (const columnId of columnIds) {
        updatedBoard[columnId] = updatedBoard[columnId].map((ticket: Ticket) =>
          ticket.id === editedTicket.id ? editedTicket : ticket
        );
      }
      return updatedBoard;
    });
  }, [editTicketModal.editedTicket]);

  useEffect(() => {
    const tickets = getTickets.tickets

    if (!tickets) { 
      return
    };

    const templatedBoard: BoardState = {
      open: tickets.filter((ticket) => ticket.status === "open"),
      in_progress: tickets.filter((ticket) => ticket.status === "in_progress"),
      resolved: tickets.filter((ticket) => ticket.status === "resolved"),
      closed: tickets.filter((ticket) => ticket.status === "closed"),
    }

    setBoard(templatedBoard as any as BoardState);
  }, [getTickets.tickets])


  return (
    <div className="flex h-[calc(100dvh-var(--dashboard-header-height))] min-h-0 min-w-0 flex-col overflow-hidden">

      <div className="flex shrink-0 flex-col gap-3 border-b px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          <ButtonGroup className="w-full sm:w-fit">
            <Button className="flex-1 sm:flex-none" onClick={() => createTicketModal.openModal()}>
              <Plus data-icon="inline-start" />
              Agregar Tarea
            </Button>
          </ButtonGroup>
        </div>
      </div>
       <div className="scrollbar-thin min-h-0 min-w-0 flex-1 overflow-x-auto overflow-y-hidden bg-muted/25 px-4 pt-4 pb-0 [scrollbar-color:var(--border)_transparent] lg:px-5 lg:pt-5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-1">
          <DragDropProvider
            onDragOver={
              (event) => {
                setBoard((board) => move(board, event))
              }
            }
            onDragEnd={(event) => {
              const {source, target} = event.operation;
              if (!source || !target) return;
              if (isSortable(source)) 
                {
                  if (source.type !== "task" && target.type !== "task") return;
                  const currentTask = findTask(board, String(source.id));
                  const status = findColumnId(board, String(source.group));
                  if(!currentTask) return;
                  void updateTicketStatus.updateTicketStatus(target.id, status);
                }
            }}
          >
            <div className="h-full min-w-full grid-cols-4 gap-4 hidden md:inline-grid">
                {orderedColumns.map((column) => (
                  <KanbanColumn key={column.id} column={column} tasks={board[column.id]} />
                ))}
            </div>
          </DragDropProvider>
        </div>
        <div className="flex md:hidden flex-col">
          {orderedColumns.map((column) => (
            <MobileKanbanColumn key={column.id} column={column} tasks={board[column.id]}/>
            ))
          }
        </div>
          {/* {activeTask ? <TaskCard task={activeTask} columnId={activeColumnId ?? undefined} isOverlay /> : null} */}
          <TicketsModal {...createTicketModal.modalProps}/>
    </div>
  );
}