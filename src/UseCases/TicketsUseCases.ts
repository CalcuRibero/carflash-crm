import * as React from "react";

import { createTicket, deleteTicket, getTicket, getTickets, updateTicket } from "@/lib/api/tickets";
import type { CreateTicketRequest, Ticket, UpdateTicketRequest } from "@/lib/api/types";

export function useTickets(options: { enabled?: boolean } = {}) {
  const { enabled = true } = options;
  const [data, setData] = React.useState<Ticket[]>([]);
  const [error, setError] = React.useState<unknown>(null);
  const [isLoading, setIsLoading] = React.useState(enabled);

  const refetch = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getTickets();
      setData(response);
      return response;
    } catch (requestError) {
      setError(requestError);
      throw requestError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!enabled) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    getTickets()
      .then((response) => {
        if (isMounted) setData(response);
      })
      .catch((requestError) => {
        if (isMounted) setError(requestError);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [enabled]);

  return {
    data,
    error,
    isLoading,
    refetch,
    tickets: data,
  };
}

export function useTicket(id: string | number | null | undefined, options: { enabled?: boolean } = {}) {
  const { enabled = true } = options;
  const shouldFetch = enabled && id != null;
  const [data, setData] = React.useState<Ticket | null>(null);
  const [error, setError] = React.useState<unknown>(null);
  const [isLoading, setIsLoading] = React.useState(shouldFetch);

  const refetch = React.useCallback(async () => {
    if (id == null) return null;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getTicket(id);
      setData(response);
      return response;
    } catch (requestError) {
      setError(requestError);
      throw requestError;
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    if (!shouldFetch || id == null) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    getTicket(id)
      .then((response) => {
        if (isMounted) setData(response);
      })
      .catch((requestError) => {
        if (isMounted) setError(requestError);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, shouldFetch]);

  return {
    data,
    error,
    isLoading,
    refetch,
    ticket: data,
  };
}

export function useCreateTicket() {
  const [data, setData] = React.useState<Ticket | null>(null);
  const [error, setError] = React.useState<unknown>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const mutate = React.useCallback(async (payload: CreateTicketRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createTicket(payload);
      setData(response);
      return response;
    } catch (requestError) {
      setError(requestError);
      throw requestError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createTicket: mutate,
    data,
    error,
    isLoading,
    mutate,
  };
}

export function useUpdateTicket() {
  const [data, setData] = React.useState<Ticket | null>(null);
  const [error, setError] = React.useState<unknown>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const mutate = React.useCallback(async (id: string | number, payload: UpdateTicketRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await updateTicket(id, payload);
      setData(response);
      return response;
    } catch (requestError) {
      setError(requestError);
      throw requestError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    data,
    error,
    isLoading,
    mutate,
    updateTicket: mutate,
  };
}

export function useDeleteTicket() {
  const [data, setData] = React.useState<unknown>(null);
  const [error, setError] = React.useState<unknown>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const mutate = React.useCallback(async (id: string | number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await deleteTicket(id);
      setData(response);
      return response;
    } catch (requestError) {
      setError(requestError);
      throw requestError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    data,
    deleteTicket: mutate,
    error,
    isLoading,
    mutate,
  };
}

