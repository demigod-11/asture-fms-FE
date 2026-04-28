/**
 * Access token storage and session-expired callback.
 * Refresh token is httpOnly cookie set by the backend.
 */

const ACCESS_TOKEN_KEY = 'asture-fms-access-token';
const SESSION_EXPIRED_KEY = 'asture-fms-session-expired';

let sessionExpiredCallback: (() => void) | null = null;

export function getAccessToken(): string | null {
  try {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAccessToken(token: string): void {
  try {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch {
    // ignore
  }
}

export function clearAccessToken(): void {
  try {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    // ignore
  }
}

export function setSessionExpiredCallback(callback: (() => void) | null): void {
  sessionExpiredCallback = callback;
}

export function getSessionExpiredCallback(): (() => void) | null {
  return sessionExpiredCallback;
}

export function setSessionExpiredFlag(): void {
  try {
    sessionStorage.setItem(SESSION_EXPIRED_KEY, 'true');
  } catch {
    // ignore
  }
}

export function consumeSessionExpiredFlag(): boolean {
  try {
    const value = sessionStorage.getItem(SESSION_EXPIRED_KEY);
    sessionStorage.removeItem(SESSION_EXPIRED_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}
