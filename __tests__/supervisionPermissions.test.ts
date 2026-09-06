import { describe, expect, it } from "vitest";

import { canCreateSupervisionTicket } from "@/features/supervision-panel/permissions";

describe("canCreateSupervisionTicket", () => {
  it("allows SuperAdmin to create tickets", () => {
    expect(canCreateSupervisionTicket("SuperAdmin")).toBe(true);
  });

  it("denies other roles and unauthenticated users", () => {
    expect(canCreateSupervisionTicket("CarSeller")).toBe(false);
    expect(canCreateSupervisionTicket(null)).toBe(false);
    expect(canCreateSupervisionTicket(undefined)).toBe(false);
  });
});