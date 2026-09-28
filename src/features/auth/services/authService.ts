import { clearApiToken, saveApiToken } from "@/lib/api";
import { apiRequest, getApiToken } from "@/shared/utils/apiClient";

import { clearAuthToken, setAuthToken } from "../actions/auth-actions";
import type { AuthProfile, LoginRequest, LoginResponse } from "../types";

export async function login(payload: LoginRequest) {
  const response = await apiRequest<LoginResponse>("/auth/login", {
    body: payload,
    method: "POST",
    token: null,
  });

  await setAuthToken(response.access_token);
  saveApiToken(response.access_token);
  return response;
}

export async function getProfile() {
  return apiRequest<AuthProfile>("/auth/profile", {
    token: getApiToken(),
  });
}

export async function logout() {
  await clearAuthToken();
  clearApiToken();
}
