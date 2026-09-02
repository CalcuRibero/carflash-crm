import { describe, expect, it, vi } from "vitest";

import { type Notification, NotificationType } from "@/lib/api/types";
import { filterNotificationsByExistingTickets } from "@/shared/utils/filterNotifications";

function notification(id: string, ticketId?: string): Notification {
  return {
    id,
    userId: "user-1",
    type: NotificationType.NEW_TICKET,
    message: `Nuevo ticket: ${id}`,
    meta: ticketId ? { ticketId } : null,
    read: false,
    createdAt: "2026-09-02T00:00:00.000Z",
  };
}

describe("filterNotificationsByExistingTickets", () => {
  it("keeps notifications without tickets and removes missing tickets", async () => {
    const result = await filterNotificationsByExistingTickets(
      [notification("chat"), notification("valid", "ticket-1"), notification("missing", "ticket-2")],
      async (ticketId) => ticketId === "ticket-1",
    );

    expect(result.existing.map(({ id }) => id)).toEqual(["chat", "valid"]);
    expect(result.missing.map(({ id }) => id)).toEqual(["missing"]);
  });

  it("checks each ticket only once when notifications share an id", async () => {
    const isTicketAvailable = vi.fn(async () => true);

    await filterNotificationsByExistingTickets(
      [notification("first", "ticket-1"), notification("second", "ticket-1")],
      isTicketAvailable,
    );

    expect(isTicketAvailable).toHaveBeenCalledOnce();
    expect(isTicketAvailable).toHaveBeenCalledWith("ticket-1");
  });
});