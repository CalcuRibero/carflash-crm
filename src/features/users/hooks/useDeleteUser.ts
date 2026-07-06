"use client";

import * as React from "react";

import { deleteUserService } from "../services/usersService";

export function useDeleteUser() {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const deleteUser = React.useCallback(async (id: string | number): Promise<boolean> => {
    try {
      setIsDeleting(true);
      setErrorMessage(null);
      await deleteUserService(String(id));
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "We could not delete the user.";
      setErrorMessage(message);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return {
    deleteUser,
    isDeleting,
    errorMessage,
  };
}
