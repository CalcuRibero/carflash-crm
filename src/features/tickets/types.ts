import type { CreateTicketRequest, Ticket, TicketCategory, TicketPriority, TicketStatus } from "@/lib/api/types";

export interface TicketsModalFormValues {
  assignedTo: string;
  category: TicketCategory;
  description: string;
  dueDate: string;
  priority: TicketPriority;
  status: TicketStatus;
  title: string;
}

export interface TicketsModalProps {
  errorMessage?: string | null;
  isOpen: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: CreateTicketRequest) => void | Promise<void>;
}

export interface SelectOption<TValue extends string> {
  label: string;
  value: TValue;
}

export interface CreateTicketModalState {
  createdTicket: Ticket | null;
  errorMessage: string | null;
  isOpen: boolean;
  isSubmitting: boolean;
}

export interface CreateTicketModalController extends CreateTicketModalState {
  closeModal: () => void;
  modalProps: TicketsModalProps;
  openModal: () => void;
  submitTicket: (values: CreateTicketRequest) => Promise<void>;
}

export interface TicketsController {
  errorMessage: string | null;
  isLoading: boolean;
  refetch: () => Promise<Ticket[]>;
  tickets: Ticket[];
}
