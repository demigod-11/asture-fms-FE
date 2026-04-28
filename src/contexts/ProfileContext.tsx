import React, { createContext, useCallback, useContext, useState } from 'react';
import {
  getCurrentUser,
  getCurrentUserProfiles,
  type UserProfileResponse,
  type UserResponse,
} from '@/services/authApi';

const PROFILE_CACHE_KEY = 'asture-profile-cache';
const CACHE_MAX_AGE_MS = 5 * 60 * 1000; // 5 minutes

export interface CachedProfile {
  user: UserResponse | null;
  profiles: UserProfileResponse[];
  at: number;
}

function readCache(): CachedProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedProfile;
    if (!parsed || typeof parsed.at !== 'number') return null;
    if (Date.now() - parsed.at > CACHE_MAX_AGE_MS) return null;
    if (!Array.isArray(parsed.profiles)) return null;
    return {
      user: parsed.user ?? null,
      profiles: parsed.profiles,
      at: parsed.at,
    };
  } catch {
    return null;
  }
}

/** Read profile cache from localStorage (for use outside ProfileProvider, e.g. onboarding). */
export function readProfileCache(): CachedProfile | null {
  return readCache();
}

function writeCache(
  user: UserResponse | null,
  profiles: UserProfileResponse[]
): void {
  try {
    localStorage.setItem(
      PROFILE_CACHE_KEY,
      JSON.stringify({ user, profiles, at: Date.now() })
    );
  } catch {
    // ignore
  }
}

function clearStorageCache(): void {
  try {
    localStorage.removeItem(PROFILE_CACHE_KEY);
  } catch {
    // ignore
  }
}

/** Module-level load promise so Strict Mode double-mount doesn't trigger duplicate API calls. */
let sharedLoadPromise: Promise<void> | null = null;

function getOrCreateLoadPromise(
  setUser: (u: UserResponse | null) => void,
  setProfiles: (p: UserProfileResponse[]) => void,
  setLoading: (v: boolean) => void,
  setError: (e: Error | null) => void
): Promise<void> {
  if (sharedLoadPromise) return sharedLoadPromise;
  sharedLoadPromise = (async () => {
    setLoading(true);
    setError(null);
    try {
      const [userRes, profilesRes] = await Promise.all([
        getCurrentUser(),
        getCurrentUserProfiles(),
      ]);
      const u = userRes?.data ?? null;
      const p = Array.isArray(profilesRes?.data) ? profilesRes.data : [];
      setUser(u);
      setProfiles(p);
      writeCache(u, p);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      setProfiles([]);
    } finally {
      setLoading(false);
      sharedLoadPromise = null;
    }
  })();
  return sharedLoadPromise;
}

interface ProfileContextValue {
  user: UserResponse | null;
  profiles: UserProfileResponse[];
  loading: boolean;
  error: Error | null;
  /** Load user and profiles once; uses cache first, then API if needed. */
  ensureLoaded: () => Promise<void>;
  /** Refetch user and profiles from API and update cache (e.g. after editing user or org). */
  refetch: () => Promise<void>;
  /** Clear cache (e.g. after logout). */
  clear: () => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserResponse | null>(
    () => readCache()?.user ?? null
  );
  const [profiles, setProfiles] = useState<UserProfileResponse[] | null>(() => {
    const cached = readCache();
    return cached ? cached.profiles : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const ensureLoaded = useCallback(async () => {
    if (profiles !== null) return;

    const cached = readCache();
    if (cached) {
      setUser(cached.user);
      setProfiles(cached.profiles);
      return;
    }

    const promise = getOrCreateLoadPromise(
      setUser,
      setProfiles,
      setLoading,
      setError
    );
    await promise;
    // Sync state from cache in case we're a second mount (Strict Mode) that awaited the shared promise
    const after = readCache();
    if (after) {
      setUser(after.user);
      setProfiles(after.profiles);
    }
  }, [profiles]);

  const refetch = useCallback(async () => {
    sharedLoadPromise = null;
    clearStorageCache();
    setLoading(true);
    setError(null);
    try {
      const [userRes, profilesRes] = await Promise.all([
        getCurrentUser(),
        getCurrentUserProfiles(),
      ]);
      const u = userRes?.data ?? null;
      const p = Array.isArray(profilesRes?.data) ? profilesRes.data : [];
      setUser(u);
      setProfiles(p);
      writeCache(u, p);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    sharedLoadPromise = null;
    clearStorageCache();
    setUser(null);
    setProfiles(null);
    setError(null);
  }, []);

  const value: ProfileContextValue = {
    user,
    profiles: profiles ?? [],
    loading,
    error,
    ensureLoaded,
    refetch,
    clear,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
