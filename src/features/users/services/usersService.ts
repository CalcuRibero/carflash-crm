import { apiRequest, getApiToken } from "@/shared/utils/apiClient";
import type { User } from "@/lib/api/types";

export async function getUsersService(options: { signal?: AbortSignal } = {}): Promise<User[]> {
  const token = getApiToken();

  return apiRequest<User[]>("/users", {
    signal: options.signal,
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
