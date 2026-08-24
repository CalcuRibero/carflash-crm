"use client";

import { NEXT_PUBLIC_API_BASE_PATH, API_TOKEN_STORAGE_KEY } from "./config";
import { ApiError } from "./errors";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string | null;
};

function resolveUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${NEXT_PUBLIC_API_BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}

function getStoredToken() {
  if (typeof window !== "undefined") {
    const localToken = window.localStorage.getItem(API_TOKEN_STORAGE_KEY);
    if (localToken) {
      return localToken;
    }
  }

  const name = "accessToken=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");
  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
}

function isFormData(body: unknown): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

function isBlob(body: unknown): body is Blob {
  return typeof Blob !== "undefined" && body instanceof Blob;
}

function normalizeBody(body: unknown) {
  if (body == null || isFormData(body) || isBlob(body)) return body as BodyInit | null | undefined;

  return JSON.stringify(body, (_key, value) => {
    if (value instanceof Date) return value.toISOString();
    return value;
  });
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) return response.json();

  const text = await response.text();
  return text.length > 0 ? text : null;
}

export async function apiRequest<TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> {
  const { body, headers, token = getStoredToken(), ...init } = options;
  const requestHeaders = new Headers(headers);

  if (body != null && !isFormData(body) && !isBlob(body)) {
    requestHeaders.set("content-type", "application/json");
  }

  if (token) {
    requestHeaders.set("authorization", `Bearer ${token}`);
  }

  const response = await fetch(resolveUrl(path), {
    ...init,
    body: normalizeBody(body),
    headers: requestHeaders,
  });
  const payload = await parseResponse(response);

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? String((payload as { message: unknown }).message)
        : `API request failed with status ${response.status}`;

    throw new ApiError(message, response.status, payload);
  }

  return payload as TResponse;
}

export function saveApiToken(token: string) {
  window.localStorage.setItem(API_TOKEN_STORAGE_KEY, token);
}

export function getApiToken() {
  return getStoredToken();
}

export function clearApiToken() {
  window.localStorage.removeItem(API_TOKEN_STORAGE_KEY);
}
