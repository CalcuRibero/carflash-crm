import { Ticket } from "@/lib/api";

export const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"] as const;
type DaysOfWeekOrder = Record<number, Ticket[]>;

const getDayNumber = (date: Date): number => {
    const today = new Date();
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const currentWeekStart = new Date(normalizedToday);
    const currentDay = currentWeekStart.getDay();
    const daysSinceMonday = (currentDay + 6) % 7;
    currentWeekStart.setDate(currentWeekStart.getDate() - daysSinceMonday);

    if (normalizedDate < currentWeekStart) {
        return 0;
    }

    const dayNumber = (normalizedDate.getDay() + 6) % 7;
    return Math.min(dayNumber, daysOfWeek.length - 1);
};

export function calendarWeeklySorter(tickets: Ticket[]): DaysOfWeekOrder {
    const scheduledTickets: DaysOfWeekOrder = tickets.reduce<DaysOfWeekOrder>((acc, ticket) => {
        const dayNumber = getDayNumber(new Date(ticket.createdAt));
        acc[dayNumber] = [...(acc[dayNumber] ?? []), ticket];
        return acc;
    }, {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
    });

    return scheduledTickets;
}