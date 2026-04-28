/**
 * Axios instance with:
 * - Auth header from stored access token
 * - 401 → single refresh attempt → retry or session expired (logout)
 * - credentials for refresh-token cookie
 *
 * Network tab: API responses (including 401 body) are on error.response.
 * If the request list clears when you navigate, enable "Preserve log" in DevTools.
 */

import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import {
  clearAccessToken,
  getAccessToken,
  getSessionExpiredCallback,
  setAccessToken,
  setSessionExpiredFlag,
} from './authStorage';

function getViteApiUrl(): string | undefined {
  // In Vite (Netlify builds), this is the canonical way to read env vars.
  // In some test runners, `import.meta` may not be available.
  try {
    const env = (
      import.meta as unknown as {
        env?: Record<string, string | undefined>;
      }
    ).env;
    return env?.VITE_API_URL;
  } catch {
    return undefined;
  }
}

const baseURL =
  (typeof window !== 'undefined' &&
    (window as unknown as { __ASTURE_API_URL__?: string })
      .__ASTURE_API_URL__) ||
  getViteApiUrl() ||
  // Fallback for tests / tooling environments.
  (typeof process !== 'undefined' &&
    (process as unknown as { env?: Record<string, string | undefined> }).env
      ?.VITE_API_URL) ||
  'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const { data } = await axios.post<{
        success?: boolean;
        data?: { access_token?: string };
        message?: string;
      }>(
        `${baseURL}/auth/refresh`,
        {},
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const token = data?.data?.access_token ?? null;
      if (token) setAccessToken(token);
      return token;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

function onSessionExpired(): void {
  setSessionExpiredFlag();
  clearAccessToken();
  getSessionExpiredCallback()?.();
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || originalRequest._retry) {
      if (error.response?.status === 401) onSessionExpired();
      return Promise.reject(error);
    }

    // Skip refresh for auth endpoints (login, refresh, etc.) to avoid loops
    const url = originalRequest.url ?? '';
    if (/\/auth\/(login|refresh)/.test(url)) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const newToken = await refreshAccessToken();

    if (!newToken) {
      onSessionExpired();
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${newToken}`;
    return apiClient(originalRequest);
  }
);
