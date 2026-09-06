import { apiRequest, getApiToken } from "@/shared/utils/apiClient";

import type { CreateWorkRoleRequest, UpdateWorkRoleRequest, WorkRole } from "../types";

export async function getWorkRolesService(options: { signal?: AbortSignal } = {}): Promise<WorkRole[]> {
  const token = getApiToken();

  return apiRequest<WorkRole[]>("/work-roles", {
    signal: options.signal,
    token,
  });
}

export async function createWorkRoleService(payload: CreateWorkRoleRequest): Promise<WorkRole> {
  const token = getApiToken();

  return apiRequest<WorkRole>("/work-roles", {
    method: "POST",
    body: payload,
    token,
  });
}

export async function updateWorkRoleService(id: string, payload: UpdateWorkRoleRequest): Promise<WorkRole> {
  const token = getApiToken();

  return apiRequest<WorkRole>(`/work-roles/${id}`, {
    method: "PATCH",
    body: payload,
    token,
  });
}

export async function deleteWorkRoleService(id: string): Promise<void> {
  const token = getApiToken();

  await apiRequest<void>(`/work-roles/${id}`, {
    method: "DELETE",
    token,
  });
}
