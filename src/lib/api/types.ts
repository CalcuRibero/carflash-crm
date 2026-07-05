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

export type TicketInsightLabel = "Attachments" | "Comments" | "Documents";

export type TicketInsight = {
  label: TicketInsightLabel;
  count: number;
};

export type TicketOwnerProfile = {
  name: string;
  tone: string;
};

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category?: TicketCategory;
  createdBy?: User;
  assignedTo?: User | null;
  createdAt?: string;
  updatedAt?: string;
  dueDate?: string | null;
  resolvedAt?: string | null;
  progress?: number;
  insights?: TicketInsight[];
  owner?: TicketOwnerProfile;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
};

export type AuthProfile = {
  sub: number;
  email: string;
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

