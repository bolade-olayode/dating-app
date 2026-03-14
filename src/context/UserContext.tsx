// src/context/UserContext.tsx

/**
 * USER CONTEXT
 *
 * Global state management for user data across the app.
 * Manages: coins, swipes, matches, profile, auth
 *
 * USAGE:
 * const { coinBalance, spendCoins, addMatch, profile } = useUser();
 */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppStateStatus } from 'react-native';
import { registerSessionExpiredCallback } from '@services/api/realAuthService';

// ─── Types ───────────────────────────────────────────────────

export interface UserProfile {
  id?: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  age?: number;
  gender: string;
  lookingFor: string;
  relationshipGoal: string;
  interests: string[];
  photos: string[];
  bio?: string;
  weight?: string;
  height?: string;
  education?: string;
  prompts?: Array<{ question: string; answer: string }>;
  location?: string;
  verified: boolean;
}

export interface Match {
  id: string | number;
  profile: {
    id: string | number;
    name: string;
    age: number;
    photo: any;
    location: string;
  };
  matchedAt: string;
  chatId?: string | number;
}

interface UserContextType {
  // Profile
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  clearProfile: () => void;

  // Coins
  coinBalance: number;
  setCoinBalance: (balance: number) => void;
  spendCoins: (amount: number, description?: string) => boolean;
  addCoins: (amount: number) => void;

  // Swipes
  swipeCount: number;
  incrementSwipeCount: () => void;
  resetSwipeCount: () => void;
  freeSwipesRemaining: number;

  // Matches
  matches: Match[];
  addMatch: (match: Match) => void;
  getMatchById: (id: string | number) => Match | undefined;

  // Blocked users (local tracking — synced with backend)
  blockedUserIds: string[];
  addBlockedUser: (id: string) => void;
  removeBlockedUser: (id: string) => void;
  isBlocked: (id: string) => boolean;

  // Unread counts
  unreadChatCount: number;
  setUnreadChatCount: (count: number) => void;

  // Auth
  isAuthenticated: boolean;
  login: (token: string, userData: UserProfile) => Promise<void>;
  logout: () => Promise<void>;

  // Loading
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// ─── Constants ───────────────────────────────────────────────

// Revenue plan: men = 10, women = 15 free swipes/day
// TODO: Make dynamic based on user gender from profile
const FREE_SWIPE_LIMIT = 10;
const PERSIST_DEBOUNCE_MS = 1000; // Save at most once per second
const SWIPE_RESET_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

const STORAGE_KEYS = {
  PROFILE: '@opueh_profile',
  COINS: '@opueh_coins',
  SWIPES: '@opueh_swipes',
  SWIPE_RESET_TIME: '@opueh_swipe_reset',
  MATCHES: '@opueh_matches',
  AUTH_TOKEN: '@opueh_auth_token',
};

// Survives logout — used to restore locally-saved fields (prompts, height, weight,
// education, etc.) that the backend may not return in GET /api/auth/me.
// Per-user key prevents one account's backup from contaminating another's profile.
const PROFILE_BACKUP_KEY = '@opueh_profile_backup'; // legacy generic key (kept for migration reads)
const getUserBackupKey = (email?: string | null, id?: string | number | null): string => {
  if (email) return `@opueh_profile_backup_${email}`;
  if (id != null) return `@opueh_profile_backup_id_${id}`;
  return PROFILE_BACKUP_KEY; // fallback only
};

// ─── Provider ────────────────────────────────────────────────

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [coinBalance, setCoinBalanceState] = useState(0);
  const [swipeCount, setSwipeCountState] = useState(0);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);

  // Debounce timer ref
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dataRef = useRef({ profile, coinBalance, swipeCount, matches });

  // Keep ref in sync
  useEffect(() => {
    dataRef.current = { profile, coinBalance, swipeCount, matches };
  }, [profile, coinBalance, swipeCount, matches]);

  // ─── Persistence (debounced) ─────────────────────────────

  const persistNow = useCallback(async () => {
    const { profile: p, coinBalance: c, swipeCount: s, matches: m } = dataRef.current;
    try {
      await Promise.all([
        p ? AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(p)) : Promise.resolve(),
        // Keep backup in sync so it's always available even if the app crashes
        // before logout() is called. Backup survives logout (uses a separate key).
        p ? AsyncStorage.setItem(PROFILE_BACKUP_KEY, JSON.stringify(p)) : Promise.resolve(),
        AsyncStorage.setItem(STORAGE_KEYS.COINS, c.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.SWIPES, s.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(m)),
      ]);
    } catch (error) {
      console.error('Error persisting data:', error);
    }
  }, []);

  const schedulePersist = useCallback(() => {
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(persistNow, PERSIST_DEBOUNCE_MS);
  }, [persistNow]);

  // Auto-save on state changes (debounced)
  useEffect(() => {
    if (!isLoading) {
      schedulePersist();
    }
  }, [profile, coinBalance, swipeCount, matches, isLoading, schedulePersist]);

  // Save immediately when app goes to background
  useEffect(() => {
    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState === 'background' || nextState === 'inactive') {
        if (persistTimer.current) clearTimeout(persistTimer.current);
        persistNow();
      }
    };
    const subscription = AppState.addEventListener('change', handleAppState);
    return () => subscription.remove();
  }, [persistNow]);

  // ─── Load persisted data on mount ────────────────────────

  useEffect(() => {
    (async () => {
      try {
        const [storedProfile, storedCoins, storedSwipes, storedMatches, authToken] =
          await Promise.all([
            AsyncStorage.getItem(STORAGE_KEYS.PROFILE),
            AsyncStorage.getItem(STORAGE_KEYS.COINS),
            AsyncStorage.getItem(STORAGE_KEYS.SWIPES),
            AsyncStorage.getItem(STORAGE_KEYS.MATCHES),
            AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
          ]);

        if (storedProfile) setProfileState(JSON.parse(storedProfile));
        if (storedCoins) { const n = parseInt(storedCoins, 10); setCoinBalanceState(Number.isFinite(n) ? n : 0); }
        if (storedSwipes) setSwipeCountState(parseInt(storedSwipes, 10));
        if (storedMatches) setMatches(JSON.parse(storedMatches));
        if (authToken) setIsAuthenticated(true);

      } catch (error) {
        console.error('UserContext: error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // ─── Daily swipe reset ───────────────────────────────────

  useEffect(() => {
    const checkSwipeReset = async () => {
      try {
        const resetTime = await AsyncStorage.getItem(STORAGE_KEYS.SWIPE_RESET_TIME);
        const now = Date.now();

        if (!resetTime) {
          await AsyncStorage.setItem(STORAGE_KEYS.SWIPE_RESET_TIME, (now + SWIPE_RESET_INTERVAL).toString());
          return;
        }

        if (now >= parseInt(resetTime, 10)) {
          setSwipeCountState(0);
          await AsyncStorage.setItem(STORAGE_KEYS.SWIPE_RESET_TIME, (now + SWIPE_RESET_INTERVAL).toString());
        }
      } catch (error) {
        console.error('UserContext: swipe reset error:', error);
      }
    };

    checkSwipeReset();
    const interval = setInterval(checkSwipeReset, 60000);
    return () => clearInterval(interval);
  }, []);

  // ─── Profile ─────────────────────────────────────────────

  const setProfile = useCallback((newProfile: UserProfile) => {
    setProfileState(newProfile);
  }, []);

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setProfileState(prev => {
      const next = prev
        ? { ...prev, ...data }
        : { name: '', gender: '', lookingFor: '', relationshipGoal: '', interests: [], photos: [], verified: false, ...data } as UserProfile;
      // Write immediately so data survives hot-reload / fast app restarts
      AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(next))
        .catch(e => console.error('[UserContext] updateProfile: PROFILE write failed:', e));
      // Write per-user backup so it isn't contaminated by a different account's data
      const backupKey = getUserBackupKey(next.email, next.id);
      AsyncStorage.setItem(backupKey, JSON.stringify(next))
        .catch(e => console.error('[UserContext] updateProfile: BACKUP write failed:', e));
      return next;
    });
  }, []);

  const clearProfile = useCallback(async () => {
    setProfileState(null);
    await AsyncStorage.removeItem(STORAGE_KEYS.PROFILE);
  }, []);

  // ─── Coins ───────────────────────────────────────────────

  const setCoinBalance = useCallback((balance: number) => {
    setCoinBalanceState(Number.isFinite(balance) ? Math.max(0, balance) : 0);
  }, []);

  const spendCoins = useCallback((amount: number, _description?: string): boolean => {
    let success = false;
    setCoinBalanceState(prev => {
      if (prev >= amount) {
        success = true;
        return prev - amount;
      }
      return prev;
    });
    return success;
  }, []);

  const addCoins = useCallback((amount: number) => {
    setCoinBalanceState(prev => prev + amount);
  }, []);

  // ─── Swipes ──────────────────────────────────────────────

  const incrementSwipeCount = useCallback(() => {
    setSwipeCountState(prev => prev + 1);
  }, []);

  const resetSwipeCount = useCallback(() => {
    setSwipeCountState(0);
  }, []);

  const freeSwipesRemaining = Math.max(0, FREE_SWIPE_LIMIT - swipeCount);

  // ─── Matches ─────────────────────────────────────────────

  const addMatch = useCallback((match: Match) => {
    setMatches(prev => {
      if (prev.find(m => m.id === match.id)) return prev;
      return [match, ...prev];
    });
  }, []);

  const getMatchById = useCallback((id: string | number): Match | undefined => {
    return matches.find(m => m.id === id);
  }, [matches]);

  // ─── Blocked users ───────────────────────────────────────

  const addBlockedUser = useCallback((id: string) => {
    setBlockedUserIds(prev => prev.includes(id) ? prev : [...prev, id]);
  }, []);

  const removeBlockedUser = useCallback((id: string) => {
    setBlockedUserIds(prev => prev.filter(uid => uid !== id));
  }, []);

  const isBlocked = useCallback((id: string) => {
    return blockedUserIds.includes(id);
  }, [blockedUserIds]);

  // ─── Auth ────────────────────────────────────────────────

  const login = useCallback(async (token: string, userData: UserProfile) => {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);

    // Clear any previously cached profile so a different account's stale data
    // can never leak into this session before the fresh profile is written.
    try {
      const existingStr = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
      if (existingStr) {
        const existing = JSON.parse(existingStr) as UserProfile;
        const isSameUser =
          (existing.email && userData.email && existing.email === userData.email) ||
          (existing.id && userData.id && String(existing.id) === String(userData.id));
        if (!isSameUser) {
          await AsyncStorage.removeItem(STORAGE_KEYS.PROFILE);
        }
      }
    } catch {}

    // Merge with profile backup saved at logout time.
    // This restores fields like prompts, height, weight, education that the
    // backend may not include in GET /api/auth/me, so they survive logout→login cycles.
    let finalProfile = userData;
    try {
      // Read per-user backup first (keyed by email/id so multi-account can't cross-contaminate).
      // Fall back to the legacy generic key for older installs that haven't migrated yet.
      const perUserKey = getUserBackupKey(userData.email, userData.id);
      let backupStr = await AsyncStorage.getItem(perUserKey);
      if (!backupStr && perUserKey !== PROFILE_BACKUP_KEY) {
        // Migration: check old generic key; only use it if it belongs to the same user.
        const legacyStr = await AsyncStorage.getItem(PROFILE_BACKUP_KEY);
        if (legacyStr) {
          const legacyParsed = JSON.parse(legacyStr) as UserProfile;
          const sameUser = (legacyParsed.email && legacyParsed.email === userData.email) ||
            (legacyParsed.id && userData.id && String(legacyParsed.id) === String(userData.id));
          if (sameUser) backupStr = legacyStr;
          // Always remove the legacy generic key to prevent future cross-user reads
          AsyncStorage.removeItem(PROFILE_BACKUP_KEY).catch(() => {});
        }
      }
      if (backupStr) {
        const backup = JSON.parse(backupStr) as UserProfile;
        // Backup (user's last saved state) wins over fresh API data.
        // API only fills fields that are empty/missing in the backup.
        // Exception: id and verified always come from the API.
        const merged = { ...userData, ...backup };
        (Object.keys(merged) as (keyof UserProfile)[]).forEach(key => {
          const freshVal  = (userData as any)[key];
          const backupVal = (backup   as any)[key];
          const backupIsEmpty = backupVal === undefined || backupVal === null || backupVal === '' ||
            (Array.isArray(backupVal) && backupVal.length === 0);
          if (backupIsEmpty && freshVal) (merged as any)[key] = freshVal;
        });
        // Backend is authoritative for these
        merged.id = userData.id || backup.id;
        merged.verified = userData.verified;
        finalProfile = merged;
      }
    } catch {}

    setProfileState(finalProfile);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    // Cancel any pending debounced persist so it can't overwrite the backup
    // we're about to write with a stale snapshot.
    if (persistTimer.current) {
      clearTimeout(persistTimer.current);
      persistTimer.current = null;
    }
    // Save a profile backup BEFORE clearing everything, so locally-filled fields
    // (prompts, height, weight, education) survive the next login if getMe doesn't return them.
    // Use per-user key so multiple accounts don't contaminate each other's backups.
    const currentProfile = dataRef.current.profile;
    if (currentProfile) {
      try {
        const backupKey = getUserBackupKey(currentProfile.email, currentProfile.id);
        await AsyncStorage.setItem(backupKey, JSON.stringify(currentProfile));
      } catch {}
    }
    await Promise.all(
      Object.values(STORAGE_KEYS).map(key => AsyncStorage.removeItem(key))
    );
    setProfileState(null);
    setCoinBalanceState(0);
    setSwipeCountState(0);
    setMatches([]);
    setBlockedUserIds([]);
    setIsAuthenticated(false);
  }, []);

  // Register the logout callback so the 401 interceptor can clear context
  // state without importing React or creating a circular dependency.
  useEffect(() => {
    registerSessionExpiredCallback(logout);
  }, [logout]);

  // ─── Context value ───────────────────────────────────────

  const value: UserContextType = {
    profile,
    setProfile,
    updateProfile,
    clearProfile,
    coinBalance,
    setCoinBalance,
    spendCoins,
    addCoins,
    swipeCount,
    incrementSwipeCount,
    resetSwipeCount,
    freeSwipesRemaining,
    matches,
    addMatch,
    getMatchById,
    isAuthenticated,
    login,
    logout,
    isLoading,
    unreadChatCount,
    setUnreadChatCount,
    blockedUserIds,
    addBlockedUser,
    removeBlockedUser,
    isBlocked,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// ─── Hook ──────────────────────────────────────────────────

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
