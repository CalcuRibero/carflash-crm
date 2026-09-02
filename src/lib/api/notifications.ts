// lib/api/notifications.ts
import { apiRequest, getApiToken } from "./http-client";
import type { Notification } from "./types";

export async function fetchNotifications(): Promise<Notification[]> {
  return apiRequest<Notification[]>("/notifications", {
    method: "GET",
    token: getApiToken(),
  });
}

export async function fetchUnread(): Promise<Notification[]> {
  const token = getApiToken();
  const res = await apiRequest<Notification[]>("/notifications/unread", {
    method: "GET",
    token: token,
  });

  console.log(res);
  // if (!res.ok) {
  //   throw new Error("No se pudo obtener el conteo de no leídas.");
  // }

  return res; // ajusta según lo que devuelva tu endpoint (número plano o { count })
}

export async function createNotification(payload: Omit<Notification, 'id' | 'createdAt'>): Promise<void> {
  const token = getApiToken();
  await apiRequest<Notification[]>("/notifications", {
    method: "POST",
    token: token,
    body: payload,
  });
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const token = getApiToken();
  await apiRequest(`/notifications/${id}/read`, {
    method: "PATCH",
    token,
  });
}