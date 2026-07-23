"use client";

import * as React from "react";

import { updateUserService, type UpdateUserRequest } from "../services/usersService";
import type { User } from "@/lib/api/types";

export function useUpdateUser() {
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const updateUser = React.useCallback(async (id: string, payload: UpdateUserRequest): Promise<User | null> => {
    setIsUpdating(true);
    setErrorMessage(null);

    try {
      return await updateUserService(id, payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No pudimos actualizar el usuario.";
      setErrorMessage(message);
      console.error(error);
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return {
    updateUser,
    isUpdating,
    errorMessage,
  };
}
