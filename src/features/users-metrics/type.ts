import { Ticket, TicketStatus } from "@/lib/api"

export type MetricsCardsProps = {
    tickets: Ticket[];
    isLoading: boolean;
    errorMessage: string | null;
}

export type MetricsTableProps = {
    tickets: Ticket[];
    isLoading: boolean;
    errorMessage: string | null;
}

export type MetricsChartProps = {
    tickets: Ticket[];
    isLoading: boolean;
    errorMessage: string | null;
}


export type MetricsComponentProps = {
    userId: number | null
}

export type Variants = "default" | "secondary" | "destructive" | "outline"  |"ghost"  | "link"


export const StatusVariant: Record<string, Variants | null | undefined> = {
    "open": "outline",
    "in_progress": "default",
    "resolved": "secondary",
    "closed": "outline",
}


export const chartConfig = {
  abierto: {
    label: "Abierto",
    color: "hsl(var(--chart-1))",
  },
  resuelto: {
    label: "Resuelto",
    color: "hsl(var(--chart-2))",
  },
  en_progreso: {
    label: "En Progreso",
    color: "hsl(var(--chart-3))",
  },
  cerrado: {
    label: "Cerrado",
    color: "hsl(var(--chart-4))",
  },
} as const;

