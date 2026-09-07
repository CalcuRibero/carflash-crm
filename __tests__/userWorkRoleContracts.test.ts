import { describe, expectTypeOf, it } from "vitest";

import type { CreateUserRequest, UpdateUserRequest } from "@/features/users/services/usersService";

describe("user work role contracts", () => {
  it("uses workRoleId in create and update payloads", () => {
    expectTypeOf<CreateUserRequest>().toHaveProperty("workRoleId");
    expectTypeOf<UpdateUserRequest>().toHaveProperty("workRoleId");
  });
});
