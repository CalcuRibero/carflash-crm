import { describe, expect, it } from "vitest";

import { getSelectableWorkRoles } from "@/features/work-roles/components/RolesSelector";
import type { WorkRole } from "@/features/work-roles/types";

const activeRole: WorkRole = {
  id: "active-role",
  code: "active",
  name: "Active role",
  isActive: true,
  createdAt: "",
  updatedAt: "",
};

const inactiveRole: WorkRole = {
  id: "inactive-role",
  code: "inactive",
  name: "Inactive role",
  isActive: false,
  createdAt: "",
  updatedAt: "",
};

describe("getSelectableWorkRoles", () => {
  it("returns active roles for a new assignment", () => {
    expect(getSelectableWorkRoles([activeRole, inactiveRole])).toEqual([activeRole]);
  });

  it("keeps the selected inactive role available for editing", () => {
    expect(getSelectableWorkRoles([activeRole, inactiveRole], inactiveRole.id)).toEqual([
      activeRole,
      inactiveRole,
    ]);
  });
});
