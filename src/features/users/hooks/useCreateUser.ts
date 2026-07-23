"use client";

import * as React from "react";

import { createUserService, type CreateUserRequest } from "../services/usersService";

export function useCreateUser() {
  const [isCreating, setIsCreating] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const createUser = React.useCallback(async (payload: CreateUserRequest) => {
    setIsCreating(true);
    setErrorMessage(null);

    try {
      return await createUserService(payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No pudimos generar el usuario.";
      setErrorMessage(message);
      console.error(error);
      return null;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return {
    createUser,
    isCreating,
    errorMessage,
  };
}
