export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export type TicketPriority = "low" | "medium" | "high" | "critical";

export type TicketCategory = "bug" | "feature" | "support" | "incident";

export type UserRole =
  | "SuperAdmin"
  | "AdministrationAccountant"
  | "ComercialCordinator"
  | "CarExpert"
  | "Gestor"
  | "CarSeller";

export type User = {
  id: number;
  username: string;
  password?: string;
  role: UserRole;
  fullName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdBy: User;
  assignedTo: User | null;
  createdAt: string;
  updatedAt: string;
  dueDate: string | null;
  resolvedAt: string | null;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
};

export type AuthProfile = {
  sub: number;
  username: string;
  iat?: number;
  exp?: number;
};

export type CreateTicketRequest = {
  title?: string;
  description: string;
  date?: string | Date;
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  createdBy?: string;
  assignedTo?: string | null;
  dueDate?: string | Date | null;
};

export type UpdateTicketRequest = Partial<CreateTicketRequest> & {
  resolvedAt?: string | Date | null;
};

