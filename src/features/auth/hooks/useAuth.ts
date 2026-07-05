"use client";

import * as React from "react";

import { login, getProfile, logout } from "../services/authService";
import type { LoginRequest, LoginResponse, AuthProfile } from "../types";

export function useAuth() {
  const [profile, setProfile] = React.useState<AuthProfile | null>(null);
  const [error, setError] = React.useState<unknown>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const loginMutation = React.useCallback(async (payload: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await login(payload);
      setIsAuthenticated(true);
      return response;
    } catch (requestError) {
      setError(requestError);
      throw requestError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProfile = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getProfile();
      setProfile(response);
      setIsAuthenticated(true);
      return response;
    } catch (requestError) {
      setError(requestError);
      setIsAuthenticated(false);
      throw requestError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logoutMutation = React.useCallback(async () => {
    await logout();
    setProfile(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  return {
    profile,
    error,
    isLoading,
    isAuthenticated,
    login: loginMutation,
    fetchProfile,
    logout: logoutMutation,
  };
}
