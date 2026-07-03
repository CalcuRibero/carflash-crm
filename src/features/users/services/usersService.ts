import { apiRequest } from "@/shared/utils/apiClient";
import type { User } from "@/lib/api/types";

function getClientToken(): string | null {
  if (typeof window === "undefined") return null;
  const name = "accessToken=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");

  for (let i = 0; i < cookieArray.length; i += 1) {
    const cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }

  return null;
}

export async function getUsersService(options: { signal?: AbortSignal } = {}): Promise<User[]> {
  const token = getClientToken();

  return apiRequest<User[]>("/users", {
    signal: options.signal,
    token,
  });
}
