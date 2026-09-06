"use client";

import * as React from "react";

import { getWorkRolesService } from "../services/workRolesService";
import type { WorkRole } from "../types";

export function useWorkRoles() {
  const [workRoles, setWorkRoles] = React.useState<WorkRole[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const fetchWorkRoles = React.useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const data = await getWorkRolesService({ signal });
      setWorkRoles(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No pudimos cargar los roles.";
      setErrorMessage(message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();
    void fetchWorkRoles(controller.signal);

    return () => controller.abort();
  }, [fetchWorkRoles]);

  return {
    workRoles,
    isLoading,
    errorMessage,
    refetch: fetchWorkRoles,
    setWorkRoles,
  };
}
