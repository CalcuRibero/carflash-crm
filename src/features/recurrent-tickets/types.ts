export enum RecurrenceInterval {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum TicketPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum TicketCategory {
  SUPER_ADMIN = 'SuperAdmin',
  ADMINISTRATION_ACCOUNTANT = 'AdministrationAccountancy',
  COMERCIAL_COORDINATOR = 'ComercialCordination',
  CAR_EXPERT = 'CarExpert', //Perito
  GESTOR = 'Gestor',
  CAR_SELLER = 'CarSelling',
  MARKETING = 'Marketing'
}

export const TicketCategoryLabel: Record<string, string> = {
  'SuperAdmin': 'Super Admin',
  'AdministrationAccountancy': 'Administracion y Contabilidad',
  'ComercialCordination': 'Cordinador Comercial',
  'CarExpert': 'Perito',
  'Gestor': 'Gestor',
  'CarSelling': 'Vendedor de Autos',
  'Marketing': 'Marketing'
}

export interface RecurrentTicket {
  id: string;
  title: string;
  description: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  assignedTo?: string | null;
  dueDate?: Date;
  interval: RecurrenceInterval;
  first_run_at: Date;
}
