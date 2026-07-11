import { Ticket, TicketStatus } from "@/lib/api"
import type { ChartConfig } from "@/components/ui/chart"

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
    color: "var(--chart-1)",
  },
  resuelto: {
    label: "Resuelto",
    color: "var(--chart-2)",
  },
  en_progreso: {
    label: "En Progreso",
    color: "var(--chart-3)",
  },
  cerrado: {
    label: "Cerrado",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export const CHART_COLORS: Record<string, string> = {
  "open": "var(--chart-1)",
  "resolved": "var(--chart-2)",
  "in_progress": "var(--chart-3)",
  "closed": "var(--chart-4)",
}
