// utils/api.ts (Client-Safe API Call)
import { useAuth } from "@clerk/nextjs";

export function useApi() {
  const { getToken } = useAuth();

  async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = await getToken();
    if (!token) throw new Error("Unauthorized");

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  }

  return { fetchWithAuth };
}
