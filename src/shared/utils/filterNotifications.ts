import type { Notification } from "@/lib/api/types";

export async function filterNotificationsByExistingTickets(
    notifications: Notification[],
    isTicketAvailable: (ticketId: string) => Promise<boolean>,
): Promise<{ existing: Notification[]; missing: Notification[] }> {
    const ticketIds = [...new Set(
        notifications
            .map((notification) => notification.meta?.ticketId)
            .filter((ticketId): ticketId is string => Boolean(ticketId)),
    )];
    const ticketAvailability = await Promise.all(
        ticketIds.map(async (ticketId) => [ticketId, await isTicketAvailable(ticketId)] as const),
    );
    const availabilityById = new Map(ticketAvailability);

    return notifications.reduce(
        (result, notification) => {
            if(!notification.meta) return result;
            const ticketId = notification.meta.ticketId;
            if (!ticketId || availabilityById.get(ticketId) !== false) {
                result.existing.push(notification);
            } else {
                result.missing.push(notification);
            }
            return result;
        },
        { existing: [], missing: [] } as { existing: Notification[]; missing: Notification[] },
    );
}