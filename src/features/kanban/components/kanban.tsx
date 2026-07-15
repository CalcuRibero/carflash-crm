"use client";

import {useState, useEffect, useRef } from "react";

import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
  ArrowUpDown,
  Bot,
  ChevronDown,
  Kanban as KanbanIcon,
  LayoutTemplate,
  List,
  Plus,
  Search,
  SlidersHorizontal,
  Table2,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TicketsModal, useCreateTicketModal, useEditTicketModal, useTickets, useUpdateTicket } from "@/features/tickets";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Ticket } from "@/lib/api/types";

import { columnIds, columns } from "./data";
import { KanbanColumn } from "./kanban-column";
import { TaskCard } from "./task-card";
import type { BoardState, ColumnId } from "../types";
import { findColumnId, findTask, INITIAL_BOARD } from "./utils";


export function Kanban() {
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [columnOrder, setColumnOrder] = useState<ColumnId[]>(columnIds);
  const [activeTask, setActiveTask] = useState<Ticket | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<ColumnId | null>(null);

  const getTickets = useTickets()
  const createTicketModal = useCreateTicketModal();
  const editTicketModal = useEditTicketModal();
  const updateTicket = useUpdateTicket();
  const boardBeforeDrag = useRef<BoardState | null>(null);
  const hoveredColumnIdRef = useRef<ColumnId | null>(null);
  const orderedColumns = columnOrder.flatMap((columnId) => columns.find((column) => column.id === columnId) ?? []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  
  useEffect(() => {
    const createdTicket = createTicketModal.createdTicket;
    if (!createdTicket) return;
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
      console.log("No tickets found");
      return
    };

    const templatedBoard: BoardState = {
      open: tickets.filter((ticket) => ticket.status === "open"),
      in_progress: tickets.filter((ticket) => ticket.status === "in_progress"),
      resolved: tickets.filter((ticket) => ticket.status === "resolved"),
      closed: tickets.filter((ticket) => ticket.status === "closed"),
    }

    setBoard(templatedBoard as any as BoardState);
  }, [getTickets.tickets, createTicketModal.createdTicket])

  function handleDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "column") return;

    boardBeforeDrag.current = board;
    hoveredColumnIdRef.current = null;
    const task = findTask(board, String(event.active.id));
    setActiveTask(task ?? null);
    setActiveColumnId(findColumnId(board, String(event.active.id)) ?? null);
  }

  function handleDragCancel() {
    if (boardBeforeDrag.current) {
      setBoard(boardBeforeDrag.current);
    }
    boardBeforeDrag.current = null;
    hoveredColumnIdRef.current = null;
    setActiveTask(null);
    setActiveColumnId(null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    if (active.data.current?.type === "column") return;

    const activeId = String(active.id);
    const overId = String(over.id);

    setBoard((currentBoard) => {
      const activeColId = findColumnId(currentBoard, activeId);
      const overColId = findColumnId(currentBoard, overId);

      if (overColId) {
        setActiveColumnId(overColId);
        hoveredColumnIdRef.current = overColId;
      }

      if (!activeColId || !overColId || activeColId === overColId) return currentBoard;

      const activeItems = currentBoard[activeColId];
      const overItems = currentBoard[overColId];
      const activeIndex = activeItems.findIndex((task) => task.id === activeId);
      if (activeIndex === -1) return currentBoard;

      const overIndex = overItems.findIndex((task) => task.id === overId);
      const nextIndex = overIndex >= 0 ? overIndex : overItems.length;
      const activeItem = activeItems[activeIndex];

      return {
        ...currentBoard,
        [activeColId]: activeItems.filter((task) => task.id !== activeId),
        [overColId]: [...overItems.slice(0, nextIndex), activeItem, ...overItems.slice(nextIndex)],
      };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const activeType = active.data.current?.type;
    const snapshot = boardBeforeDrag.current;
    const dropColumnId = hoveredColumnIdRef.current;
    boardBeforeDrag.current = null;
    hoveredColumnIdRef.current = null;
    setActiveTask(null);
    setActiveColumnId(null);

    if (activeType === "column") {
      if (!over) return;

      const activeColumnId = String(active.id) as ColumnId;
      const overColumnId = findColumnId(board, String(over.id));
      if (!overColumnId || activeColumnId === overColumnId) return;

      setColumnOrder((currentOrder) => {
        const activeIndex = currentOrder.indexOf(activeColumnId);
        const overIndex = currentOrder.indexOf(overColumnId);
        if (activeIndex === -1 || overIndex === -1) return currentOrder;
        return arrayMove(currentOrder, activeIndex, overIndex);
      });
      return;
    }

    if (!over) {
      if (snapshot) setBoard(snapshot);
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    const sourceColumnId = findColumnId(board, activeId);
    const resolvedDropColumnId = dropColumnId ?? findColumnId(board, overId);

    console.log("Updating ticket status from", sourceColumnId, "to", resolvedDropColumnId);
    void updateTicket.updateTicket(activeId, {
      ...active,
      status: resolvedDropColumnId,
      description: active.data.current?.description ?? "",
    });
      
    setBoard((currentBoard) => {
      const activeColumnId = findColumnId(currentBoard, activeId);
      const overColumnId = findColumnId(currentBoard, overId);
      if (!activeColumnId || !overColumnId || activeColumnId !== overColumnId) return currentBoard;

      const columnTasks = currentBoard[activeColumnId];
      const activeIndex = columnTasks.findIndex((task) => task.id === activeId);
      const overIndex = columnTasks.findIndex((task) => task.id === overId);
      if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) return currentBoard;

      return {
        ...currentBoard,
        [activeColumnId]: arrayMove(columnTasks, activeIndex, overIndex),
      };
    });
  }

  return (
    <div className="flex h-[calc(100dvh-var(--dashboard-header-height))] min-h-0 min-w-0 flex-col overflow-hidden">
      <TicketsModal {...createTicketModal.modalProps} />
      <TicketsModal {...editTicketModal.modalProps} />

      <div className="flex shrink-0 flex-col gap-3 border-b px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        {/* <Tabs defaultValue="board" className="min-w-0">
          <TabsList className="w-full *:data-[slot=tabs-trigger]:flex-1 sm:w-fit sm:*:data-[slot=tabs-trigger]:flex-none">
            <TabsTrigger value="board" className="gap-2">
              <KanbanIcon />
              Board
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <List />
              List
            </TabsTrigger>
            <TabsTrigger value="table" className="gap-2">
              <Table2 />
              Table
            </TabsTrigger>
          </TabsList>
        </Tabs> */}

        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          {/* <InputGroup className="min-w-0 sm:w-64 2xl:w-48">
            <InputGroupInput type="search" placeholder="Search tasks" />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup> */}
          {/* <Button variant="outline" className="w-full sm:w-auto">
            <SlidersHorizontal data-icon="inline-start" />
            Filter
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <ArrowUpDown data-icon="inline-start" />
            Sort
          </Button> */}
          <ButtonGroup className="w-full sm:w-fit">
            <Button className="flex-1 sm:flex-none" onClick={createTicketModal.openModal}>
              <Plus data-icon="inline-start" />
              Agregar Tarea
            </Button>
            {/* <ButtonGroupSeparator />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-label="Abrir Agregar Tarea menu">
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Upload />
                  Importar CSV
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LayoutTemplate />
                  Add from template
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bot />
                  Create automation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </ButtonGroup>
        </div>
      </div>

      <DndContext
        id="kanban-board"
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="scrollbar-thin min-h-0 min-w-0 flex-1 overflow-x-auto overflow-y-hidden bg-muted/25 px-4 pt-4 pb-0 [scrollbar-color:var(--border)_transparent] lg:px-5 lg:pt-5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-1">
          <div className="inline-grid h-full min-w-full grid-cols-[repeat(5,minmax(20rem,1fr))] gap-4">
            <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
              {orderedColumns.map((column) => (
                <KanbanColumn key={column.id} column={column} tasks={board[column.id]} onTaskClick={editTicketModal.openModal} />
              ))}
            </SortableContext>
          </div>
        </div>
        <DragOverlay dropAnimation={null}>
          {activeTask ? <TaskCard task={activeTask} columnId={activeColumnId ?? undefined} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
