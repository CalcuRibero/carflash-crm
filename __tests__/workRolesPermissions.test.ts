import { describe, expect, it } from "vitest";

import { canViewWorkRoles } from "@/features/work-roles/permissions";

describe("canViewWorkRoles", () => {
  it("allows SuperAdmin to access the roles section", () => {
    expect(canViewWorkRoles("SuperAdmin")).toBe(true);
  });

  it("denies non superadmin roles", () => {
    expect(canViewWorkRoles("CarSeller")).toBe(false);
    expect(canViewWorkRoles("AdministrationAccountant")).toBe(false);
    expect(canViewWorkRoles(undefined)).toBe(false);
    expect(canViewWorkRoles(null)).toBe(false);
  });
});
