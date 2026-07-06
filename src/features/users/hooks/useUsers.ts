"use client";

import * as React from "react";

import { mapUserToRow, type UserRow } from "../components/data";
import { getUsersService } from "../services/usersService";

export function useUsers() {
  const [users, setUsers] = React.useState<UserRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const loadUsers = React.useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getUsersService({ signal });
      const mappedUsers = response.map(mapUserToRow);
      setUsers(mappedUsers);
      return mappedUsers;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return [];
      }

      const message = error instanceof Error ? error.message : "We could not load the users.";
      setErrorMessage(message);
      throw error;
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();

    void loadUsers(controller.signal).catch(() => {
      // Error state is surfaced through errorMessage.
    });

    return () => {
      controller.abort();
    };
  }, [loadUsers]);

  const refetch = React.useCallback(() => loadUsers(), [loadUsers]);

  return {
    users,
    isLoading,
    errorMessage,
    refetch,
  };
}
