import { apiRequest, saveApiToken } from "./http-client";
import type { AuthProfile, LoginRequest, LoginResponse } from "./types";

export async function login(payload: LoginRequest) {
  const response = await apiRequest<LoginResponse>("/auth/login", {
    body: payload,
    method: "POST",
    token: null,
  });

  saveApiToken(response.access_token);
  return response;
}

export function getProfile() {
  return apiRequest<AuthProfile>("/auth/profile");
}
