"use client";

import { useTicketsByUserId } from "@/features/tickets/hooks/useTicketsByUserId";
import { useAuth } from "@/stores/auth/auth-provider";
import { calendarWeeklySorter } from "../utils";
import { daysOfWeek } from "../utils";
import { CalendarColumn } from "./calendar-column";

export function Calendar() {

    const { user } = useAuth()
    if (!user) return <p>Usuario no autenticado</p>
    const { tickets } = useTicketsByUserId(user.id)

    const ticketsByDate = calendarWeeklySorter(tickets || [])

    return (
        <div className="grid grid-cols-6 gap-2">
            {daysOfWeek.map((day, index) => (
                <CalendarColumn day={day} tickets={ticketsByDate[index]} />
            ))}
        </div>
    );
}