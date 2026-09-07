import { expectTypeOf, describe, it } from "vitest";

import type { Ticket, CreateTicketRequest, User } from "@/lib/api/types";
import type { RecurrentTicket } from "@/features/recurrent-tickets/types";

describe("work role contracts", () => {
  it("exposes workRoleId on user and ticket API models", () => {
    expectTypeOf<User>().toHaveProperty("workRoleId");
    expectTypeOf<Ticket>().toHaveProperty("workRoleId");
    expectTypeOf<CreateTicketRequest>().toHaveProperty("workRoleId");
  });

  it("uses workRoleId for recurrent tickets", () => {
    expectTypeOf<RecurrentTicket>().toHaveProperty("workRoleId");
  });
});
