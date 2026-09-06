"use client";

import * as React from "react";

import { updateWorkRoleService } from "../services/workRolesService";
import type { UpdateWorkRoleRequest, WorkRole } from "../types";

export function useUpdateWorkRole() {
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const updateWorkRole = React.useCallback(async (id: string, payload: UpdateWorkRoleRequest): Promise<WorkRole | null> => {
    setIsUpdating(true);
    setErrorMessage(null);

    try {
      return await updateWorkRoleService(id, payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No pudimos actualizar el rol.";
      setErrorMessage(message);
      console.error(error);
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return {
    updateWorkRole,
    isUpdating,
    errorMessage,
  };
}
