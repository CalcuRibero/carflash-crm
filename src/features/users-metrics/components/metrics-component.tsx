"use client"

import { useTicketsByUserId } from "@/features/tickets/hooks/useTicketsByUserId";
import { MetricsComponentProps } from "../type";
import { MetricsCards } from "./metrics-cards";
import { MetricsTable } from "./metrics-table";
import { MetricsChart } from "./metrics-chart";

export function MetricsComponent({ userId }: MetricsComponentProps) {
    const { tickets, isLoading, errorMessage } = useTicketsByUserId(userId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-muted-foreground">Cargando métricas...</div>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-destructive">{errorMessage}</div>
            </div>
        );
    }

    return (
        <>
            <MetricsCards tickets={tickets} isLoading={isLoading} errorMessage={errorMessage} />
            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                    <MetricsChart tickets={tickets} isLoading={isLoading} errorMessage={errorMessage} />
                </div>
                <div className="col-span-3">
                    <MetricsTable tickets={tickets} isLoading={isLoading} errorMessage={errorMessage} />
                </div>
            </div>
        </>
    )
}