"use client";

import * as React from "react";

import { deleteWorkRoleService } from "../services/workRolesService";

export function useDeleteWorkRole() {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const deleteWorkRole = React.useCallback(async (id: string | number): Promise<boolean> => {
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await deleteWorkRoleService(String(id));
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "No pudimos eliminar el rol.";
      setErrorMessage(message);
      console.error(error);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return {
    deleteWorkRole,
    isDeleting,
    errorMessage,
  };
}
