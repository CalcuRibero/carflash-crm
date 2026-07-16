// lib/api/notifications.ts
import { apiRequest, getApiToken } from "./http-client";
import type { Notification } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_PATH;

export async function fetchNotifications(): Promise<Notification[]> {
  const res = await fetch(`${API_URL}/notifications`, {
    credentials: "include", // si usas cookies httpOnly; si usas Bearer token, quita esto y agrega el header
  });

  if (!res.ok) {
    throw new Error("No se pudieron cargar las notificaciones.");
  }

  return res.json();
}

export async function fetchUnread(): Promise<Notification[]> {
  const token = getApiToken()
  const res = await apiRequest <Notification[]>('/notifications/unread', {
    method: "GET",
    token: token,
  })

  console.log(res)
  // if (!res.ok) {
  //   throw new Error("No se pudo obtener el conteo de no leídas.");
  // }

  return res; // ajusta según lo que devuelva tu endpoint (número plano o { count })
}

export async function createNotification(payload: Omit<Notification, 'id' | 'createdAt'>): Promise<void> {
  const token = getApiToken()
  await apiRequest <Notification[]>('/notifications', {
    method: "POST",
    token: token,
    body: payload
  })

}

export async function markNotificationAsRead(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/notifications/${id}/read`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("No se pudo marcar la notificación como leída.");
  }
}