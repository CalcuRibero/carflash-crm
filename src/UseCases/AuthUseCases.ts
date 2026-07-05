import * as React from "react";

import { getProfile, login } from "@/lib/api/auth";
import type { AuthProfile, LoginRequest, LoginResponse } from "@/lib/api/types";

export function useLogin() {
  const [data, setData] = React.useState<LoginResponse | null>(null);
  const [error, setError] = React.useState<unknown>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const mutate = React.useCallback(async (payload: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await login(payload);
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
    login: mutate,
    mutate,
  };
}

export function useProfile(options: { enabled?: boolean } = {}) {
  const { enabled = true } = options;
  const [data, setData] = React.useState<AuthProfile | null>(null);
  const [error, setError] = React.useState<unknown>(null);
  const [isLoading, setIsLoading] = React.useState(enabled);

  const refetch = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getProfile();
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

    getProfile()
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
    profile: data,
    refetch,
  };
}

