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
  id: number;
  profile: {
    id: number;
    name: string;
    age: number;
    photo: any;
    location: string;
  };
  matchedAt: string;
  chatId?: number;
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
  getMatchById: (id: number) => Match | undefined;

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

// ─── Provider ────────────────────────────────────────────────

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [coinBalance, setCoinBalanceState] = useState(0);
  const [swipeCount, setSwipeCountState] = useState(0);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
        if (storedCoins) setCoinBalanceState(parseInt(storedCoins, 10));
        if (storedSwipes) setSwipeCountState(parseInt(storedSwipes, 10));
        if (storedMatches) setMatches(JSON.parse(storedMatches));
        if (authToken) setIsAuthenticated(true);

        console.log('UserContext: data loaded from storage');
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
          console.log('UserContext: resetting daily swipe count');
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
      if (prev) return { ...prev, ...data };
      // Create a new profile from partial data with sensible defaults
      return {
        name: '',
        gender: '',
        lookingFor: '',
        relationshipGoal: '',
        interests: [],
        photos: [],
        verified: false,
        ...data,
      } as UserProfile;
    });
  }, []);

  const clearProfile = useCallback(async () => {
    setProfileState(null);
    await AsyncStorage.removeItem(STORAGE_KEYS.PROFILE);
  }, []);

  // ─── Coins ───────────────────────────────────────────────

  const setCoinBalance = useCallback((balance: number) => {
    setCoinBalanceState(Math.max(0, balance));
  }, []);

  const spendCoins = useCallback((amount: number, description?: string): boolean => {
    let success = false;
    setCoinBalanceState(prev => {
      if (prev >= amount) {
        success = true;
        console.log(`Spent ${amount} coins${description ? ` on ${description}` : ''}. Balance: ${prev - amount}`);
        return prev - amount;
      }
      console.log(`Insufficient coins. Need ${amount}, have ${prev}`);
      return prev;
    });
    return success;
  }, []);

  const addCoins = useCallback((amount: number) => {
    setCoinBalanceState(prev => {
      console.log(`Added ${amount} coins. Balance: ${prev + amount}`);
      return prev + amount;
    });
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
      console.log('New match added:', match.profile.name);
      return [match, ...prev];
    });
  }, []);

  const getMatchById = useCallback((id: number): Match | undefined => {
    return matches.find(m => m.id === id);
  }, [matches]);

  // ─── Auth ────────────────────────────────────────────────

  const login = useCallback(async (token: string, userData: UserProfile) => {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    setProfileState(userData);
    setIsAuthenticated(true);
    console.log('User logged in:', userData.name);
  }, []);

  const logout = useCallback(async () => {
    await Promise.all(
      Object.values(STORAGE_KEYS).map(key => AsyncStorage.removeItem(key))
    );
    setProfileState(null);
    setCoinBalanceState(0);
    setSwipeCountState(0);
    setMatches([]);
    setIsAuthenticated(false);
    console.log('User logged out');
  }, []);

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
