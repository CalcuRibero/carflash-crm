import { apiRequest, getApiToken } from "@/shared/utils/apiClient";
import type { User, UserRole } from "@/lib/api/types";

export type CreateUserRequest = {
  fullName: string;
  username: string;
  role: UserRole;
  email: string;
  password: string;
  isActive: boolean;
};

export async function getUsersService(options: { signal?: AbortSignal } = {}): Promise<User[]> {
  const token = getApiToken();

  return apiRequest<User[]>("/users", {
    signal: options.signal,
    token,
  });
}

export async function createUserService(payload: CreateUserRequest): Promise<User> {
  const token = getApiToken();

  return apiRequest<User>("/users", {
    method: "POST",
    body: payload,
    token,
  });
}

export async function deleteUserService(id: string): Promise<void> {
  const token = getApiToken();

  await apiRequest<void>(`/users/${id}`, {
    method: "DELETE",
    token,
  });
}
