import { apiRequest } from "@/shared/utils/apiClient";
import { setAuthToken, clearAuthToken } from "../actions/auth-actions";
import type { LoginRequest, LoginResponse, AuthProfile } from "../types";

export async function login(payload: LoginRequest) {
  const response = await apiRequest<LoginResponse>("/auth/login", {
    body: payload,
    method: "POST",
    token: null,
  });

  await setAuthToken(response.access_token);
  return response;
}

export async function getProfile() {
  return apiRequest<AuthProfile>("/auth/profile");
}

export async function logout() {
  await clearAuthToken();
}
