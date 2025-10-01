"use client";

import { useAuth } from "contexts/AuthContext";

export function useAuthFetch() {
  const { accessToken, refreshToken, login, logout } = useAuth();

  async function authFetch(url: string, options: RequestInit = {}) {
    //Function to make a request with current access token
    async function makeRequest(token: string) {
      return fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    }
    //Try request with current access token
    if (accessToken) {
        let res = await makeRequest(accessToken);

        //if it failed with 401 and we have a refresh token, try that instead
        if (res.status === 401 && refreshToken) {
            try {
                const refreshRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/users/refresh`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type" : "application/json",
                            Authorization: `Bearer ${refreshToken}`
                        }
                    }
                )

                if (refreshRes.ok) {
                    const data = await refreshRes.json();
                    const newAccess = data.access_token;

                    // Update context with new access token
                    login(newAccess, refreshToken)

                    // Retry original request
                    res = await makeRequest(newAccess);
                } else {
                    //Refresh failed > logout
                    logout();
                    throw new Error("session expired, please log in again.");
                }
            } catch (err){
                logout();
                throw err;
            }
        }

        return res;
    } else {
        throw new Error("No access token available")
    }
  }

  return authFetch;
}
