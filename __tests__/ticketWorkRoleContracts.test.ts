import { describe, expectTypeOf, it } from "vitest";

import type { TicketsModalFormValues } from "@/features/tickets/types";
import type { TaskPopUpFormValues } from "@/features/kanban/components/TaskPopUp";

describe("ticket work role contracts", () => {
  it("uses workRoleId as the ticket classification", () => {
    expectTypeOf<TicketsModalFormValues>().toHaveProperty("workRoleId");
    expectTypeOf<TicketsModalFormValues>().not.toHaveProperty("category");
    expectTypeOf<TaskPopUpFormValues>().toHaveProperty("workRoleId");
    expectTypeOf<TaskPopUpFormValues>().not.toHaveProperty("category");
  });
});
