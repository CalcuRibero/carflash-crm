"use client";

import * as React from "react";

import { createWorkRoleService } from "../services/workRolesService";
import type { CreateWorkRoleRequest, WorkRole } from "../types";

export function useCreateWorkRole() {
  const [isCreating, setIsCreating] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const createWorkRole = React.useCallback(async (payload: CreateWorkRoleRequest): Promise<WorkRole | null> => {
    setIsCreating(true);
    setErrorMessage(null);

    try {
      return await createWorkRoleService(payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No pudimos crear el rol.";
      setErrorMessage(message);
      console.error(error);
      return null;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return {
    createWorkRole,
    isCreating,
    errorMessage,
  };
}
