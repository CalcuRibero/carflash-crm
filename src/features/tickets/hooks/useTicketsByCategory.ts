"use client";

import { Ticket, UserRole } from "@/lib/api";
import { getTicketsService } from "../services/ticketsService";
import type { TicketsController, TicketsSupervisionController } from "../types";
import { getTicketsByRoleService } from "@/features/supervision-panel/services/supervision-panel";
import { useCallback, useEffect, useState } from "react";

const isolateTickets = (tickets: Ticket[]) => {
    let tickestIsolated: Record<string, Ticket[]> = { "variable": [], "recurrent": [] }

    tickets.forEach((ticket) => {
        if (ticket.isRecurrent) {
            tickestIsolated["recurrent"] = [...tickestIsolated["recurrent"], ticket]
            return tickestIsolated
        }

        return tickestIsolated["variable"] = [...tickestIsolated["variable"], ticket]
    })

    return tickestIsolated
}


export function useTicketsByCategory(category: UserRole): TicketsSupervisionController {
    const [tickets, setTickets] = useState<Record<string, Ticket[]>>({
        recurrent: [],
        variable: []
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadTickets = useCallback(async (signal?: AbortSignal) => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const response = await getTicketsByRoleService({ signal }, category);
            setTickets(isolateTickets(response));
            return response;
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") {
                return [];
            }

            const message = error instanceof Error ? error.message : "We could not load the tickets.";
            setErrorMessage(message);
            throw error;
        } finally {
            if (!signal?.aborted) {
                setIsLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        void loadTickets(controller.signal).catch(() => {
            // Error state is surfaced through errorMessage.
        });

        return () => {
            controller.abort();
        };
    }, [loadTickets]);

    // const refetch = useCallback(() => loadTickets(), [loadTickets]);

    return {
        errorMessage,
        isLoading,
        // refetch,
        tickets,
    };
}
