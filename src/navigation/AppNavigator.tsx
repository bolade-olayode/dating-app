// src/navigation/AppNavigator.tsx
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTheme } from '@context/ThemeContext';
import { useUser, UserProfile } from '@context/UserContext';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@utils/constant';
import { authService } from '@services/api/authService';
import { devLog, ENV } from '@config/environment';
import { navigationRef } from '@navigation/navigationRef';
import OfflineBanner from '@components/common/OfflineBanner';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { LinkingOptions } from '@react-navigation/native';

// ─── Deep linking config ──────────────────────────────────────
// URL scheme: opueh://  |  HTTPS: https://opueh.app/
// Example: opueh://profile/123  →  ProfileDetail screen
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['opueh://', 'https://opueh.app'],
  config: {
    screens: {
      HomeTabs: '',
      ProfileDetail: 'profile/:id',
      ChatConversation: 'chat/:chatId',
      ProfileVerification: 'verify',
      TopUp: 'top-up',
      Welcome: 'welcome',
    },
  },
};

// Import Screens
import IntroSlideshowScreen from '@screens/IntroSlideshow/IntroSlideshowScreen';
import WelcomeScreen from '@screens/WelcomeScreen';
import SignupScreen from '@screens/Onboarding/SignupScreen';
import LoginScreen from '@screens/Onboarding/LoginScreen';
import OTPVerificationScreen from '@screens/Onboarding/OTPVerificationScreen';
import NameInputScreen from '@screens/Onboarding/NameInputScreen';
import DateOfBirthScreen from '@screens/Onboarding/DateOfBirthScreen';
import GenderSelectionScreen from '@screens/Onboarding/GenderSelectionScreen';
import LookingForScreen from '@screens/Onboarding/LookingForScreen';
import RelationshipGoalsScreen from '@screens/Onboarding/RelationshipGoalsScreen';
import InterestsSelectionScreen from '@screens/Onboarding/InterestsSelectionScreen';
import PhotoUploadScreen from '@screens/Onboarding/PhotoUploadScreen';
import RegisterScreen from '@screens/Onboarding/RegisterScreen';
import InitializingScreen from '@screens/Home/InitializingScreen';
import NearbyMatchesScreen from '@screens/Home/NearbyMatchesScreen';
import TabNavigator from '@navigation/TabNavigator';
import WalletScreen from '@screens/Home/WalletScreen';
import TopUpScreen from '@screens/Home/TopUpScreen';
import MatchScreen from '@screens/Home/MatchScreen';
import ProfileDetailScreen from '@screens/Home/ProfileDetailScreen';
import ChatConversationScreen from '@screens/Home/ChatConversationScreen';
import ProfileViewScreen from '@screens/Home/ProfileViewScreen';
import EditProfileScreen from '@screens/Home/EditProfileScreen';
import DiscoverySettingsScreen from '@screens/Home/DiscoverySettingsScreen';
import PrivacySafetyScreen from '@screens/Home/PrivacySafetyScreen';
import ProfilePerformanceScreen from '@screens/Home/ProfilePerformanceScreen';
import AccountActionsScreen from '@screens/Home/AccountActionsScreen';
import ExploreCategoryScreen from '@screens/Home/ExploreCategoryScreen';
import ProfileVerificationScreen from '@screens/Home/ProfileVerificationScreen';
import LikesYouScreen from '@screens/Home/LikesYouScreen';
import PrivacyConsentScreen from '@screens/Home/PrivacyConsentScreen';

// Define the parameters for each screen (undefined means no parameters required)
export type RootStackParamList = {
  IntroSlideshow: undefined;
  Welcome: undefined;
  Signup: undefined;
  Register: {
    mode: 'login' | 'signup';
  };
  Login: undefined;
  Verification: {
    phoneNumber?: string;
    email?: string;
    expiresAt?: number;
    mode: 'login' | 'signup';
  };
  NameInput: undefined;
  DateOfBirthInput: {
    name: string;
  };
  GenderSelection: {
    name: string;
    dateOfBirth: string;
    age: number;
  };
  LookingFor: {
    name: string;
    dateOfBirth: string;
    age: number;
    gender: string;
  };
  RelationshipGoals: {
    name: string;
    dateOfBirth: string;
    age: number;
    gender: string;
    lookingFor: string;
  };
  InterestsSelection: {
    name: string;
    dateOfBirth: string;
    age: number;
    gender: string;
    lookingFor: string;
    relationshipGoal: string;
  };
  PhotoUpload: {
    name: string;
    dateOfBirth: string;
    age: number;
    gender: string;
    lookingFor: string;
    relationshipGoal: string;
    interests: string[];
  };
  InitializingScreen: undefined;
  NearbyMatches: undefined;
  PrivacyConsent: undefined;
  HomeTabs: undefined;
  Wallet: undefined;
  TopUp: undefined;
  Match: {
    matchedProfile: {
      id?: string | number;
      name: string;
      photo: any;
      age: number;
    };
    userPhoto: any;
  };
  ProfileDetail: {
    profile: any;
    isPaidView?: boolean;
  };
  ChatConversation: {
    chatId: number;
    name: string;
    photo: any;
    age: number;
    location: string;
    isNewMatch?: boolean;
  };
  ProfileView: undefined;
  EditProfile: undefined;
  AccountSetup: {
    completion?: any;
  };
  DiscoverySettings: undefined;
  PrivacySafety: undefined;
  ProfilePerformance: undefined;
  AccountActions: undefined;
  ExploreCategory: {
    categoryId: string;
    categoryTitle: string;
    memberCount: string;
    type: 'interest' | 'relationship';
  };
  ProfileVerification: undefined;
  LikesYou: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const mapApiUserToProfile = (user: any): UserProfile => {
  // Backend updates 'username' via PATCH /api/user/profile; 'fullname' is set at signup and never updated.
  // Check 'username' first so saved edits aren't overridden by the stale signup name.
  const rawName = user.name || user.username || user.fullname || '';
  // Backend sends/returns DOB as 'dob' from onboarding, 'dateOfBirth' elsewhere
  const rawDob = user.dateOfBirth || user.dob || '';
  const calcAge = (dobStr: string) => {
    const dob = new Date(dobStr);
    const today = new Date();
    let a = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) a--;
    return a;
  };
  return {
    id: user.id || user._id,
    name: rawName,
    email: user.email,
    phoneNumber: user.phone,
    dateOfBirth: rawDob,
    age: user.age || (rawDob ? calcAge(rawDob) : undefined),
    gender: user.gender || '',
    // Backend field is 'interestedIn' — map 'male'/'female'/'both' back to display label
    lookingFor: ({ male: 'Men', female: 'Women', both: 'Both' } as Record<string, string>)[user.interestedIn]
      || user.lookingFor || '',
    // Backend field is 'goal' — map id back to display label
    relationshipGoal: (() => {
      const raw = user.goal || user.relationshipGoal || '';
      return ({
        'Get married':           'Get Married',
        'Find a relationship':   'Find a Relationship',
        'Chat and meet friends': 'Chat & Meet Friends',
        'Learn other cultures':  'Learn Other Cultures',
        'Travel the world':      'Travel the World',
      } as Record<string, string>)[raw] || raw;
    })(),
    interests: (user.interests || []).map((i: any) => (typeof i === 'string' ? i : i.name || '')).filter(Boolean),
    photos: user.photos || [],
    bio: user.bio || '',
    // height/weight stored as Numbers on backend — format as display strings for local state
    height: user.height ? `${user.height}cm` : '',
    weight: user.weight ? `${user.weight}kg` : '',
    // education stored as backend enum — convert to display label
    education: {
      high_school: 'High school', some_college: 'Some college',
      associate_degree: 'Associate degree', bachelor_degree: "Bachelor's degree",
      master_degree: "Master's degree", doctorate: 'Doctorate',
      trade_school: 'Trade school', prefer_not_to_say: 'Prefer not to say',
    }[user.education as string] || user.education || '',
    prompts: (user.prompts || []).filter((p: any) => p.question && p.answer),
    location: typeof user.location === 'string'
      ? user.location
      : user.location?.city || user.city || '',
    verified: user.verified || false,
  };
};

// ─── Push notification token registration ────────────────────
// Requests permission, gets the Expo push token, stores it locally,
// and sends it to the backend. Safe to call multiple times.

const registerPushToken = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      devLog('📱 Push notifications: permission denied');
      return;
    }
    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    const token = tokenData.data;
    await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_TOKEN, token);
    devLog('📱 Push token stored:', token);

    // Send token to backend — fails silently if endpoint not yet available
    try {
      const { apiClient } = require('@services/api/realAuthService');
      await apiClient.post('/api/notifications/device-token', { token, platform: 'expo' });
      devLog('📱 Push token sent to backend');
    } catch {
      devLog('📱 Push token: backend endpoint not available yet (non-blocking)');
    }
  } catch (e) {
    devLog('📱 Push token registration skipped (emulator or no project ID)');
  }
};

const AppNavigator = () => {
  const theme = useTheme();
  const { isLoading: contextLoading, isAuthenticated, profile, login: loginUser, logout: logoutUser } = useUser();
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    // Wait for UserContext to finish loading persisted data
    if (contextLoading) return;

    const initialize = async () => {
      try {
        // ⚠️ DEV ONLY: wipe all storage to test from scratch (set DEV_CLEAR_STORAGE: false after reset)
        if (ENV.FEATURES.DEV_CLEAR_STORAGE) {
          await AsyncStorage.clear();
          devLog('🧹 DEV: Storage cleared — set DEV_CLEAR_STORAGE: false to stop this');
        }

        // 1. Check if user has seen intro slideshow
        const hasSeen = await AsyncStorage.getItem(STORAGE_KEYS.HAS_SEEN_INTRO);
        if (!hasSeen) {
          setInitialRoute('IntroSlideshow');
          return;
        }

        // 2. Check for existing auth session
        if (!isAuthenticated) {
          setInitialRoute('Welcome');
          return;
        }

        // 3. Validate token with backend and refresh profile
        try {
          devLog('🔄 Session restore: validating token...');
          const result = await authService.getMe();

          if (result.success && result.profile) {
            devLog('✅ Session restore: token valid, refreshing profile');
            const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
            if (token) {
              const apiProfile = mapApiUserToProfile(result.profile);
              // Read local profile directly from storage to avoid stale closure issues.
              const storedProfileStr = await AsyncStorage.getItem('@opueh_profile');
              const storedProfile = storedProfileStr ? (JSON.parse(storedProfileStr) as UserProfile) : null;
              // Only use stored profile if it belongs to the SAME user — prevents a previous
              // account's cached data from leaking into the current user's session.
              const isSameUser = storedProfile && (
                (storedProfile.email && apiProfile.email && storedProfile.email === apiProfile.email) ||
                (storedProfile.id && apiProfile.id && String(storedProfile.id) === String(apiProfile.id))
              );
              const localProfile: UserProfile | null = isSameUser ? storedProfile : null;
              console.log('[AppNavigator] session restore: apiProfile.name =', apiProfile.name, '| localProfile.name =', localProfile?.name, '| sameUser =', !!isSameUser);
              // Merge: local (user-edited) data wins over API data.
              // API only fills in fields that are empty/missing locally.
              // Exception: id and verified always come from the backend.
              const merged = { ...apiProfile, ...(localProfile || {}) } as UserProfile;
              if (localProfile) {
                (Object.keys(merged) as (keyof UserProfile)[]).forEach((key) => {
                  const apiVal = (apiProfile as any)[key];
                  const localVal = (localProfile as any)[key];
                  const localIsEmpty = localVal === undefined || localVal === null || localVal === '' ||
                    (Array.isArray(localVal) && localVal.length === 0);
                  if (localIsEmpty && apiVal) {
                    (merged as any)[key] = apiVal;
                  }
                });
              }
              // Backend is authoritative for these — always override local
              merged.id = apiProfile.id || localProfile?.id;
              merged.verified = apiProfile.verified;
              console.log('[AppNavigator] session restore: merged.name =', merged.name);
              await loginUser(token, merged);

              // Onboarding resume: if user quit before completing their profile
              // (no name or no photos), send them back to finish it.
              const isProfileComplete =
                !!(merged.name && merged.name.trim()) &&
                (merged.photos || []).length > 0;
              if (!isProfileComplete) {
                devLog('⚠️ Session restore: incomplete profile — resuming onboarding');
                setInitialRoute('NameInput');
                return;
              }
            }
            setInitialRoute('HomeTabs');
            registerPushToken();
          } else {
            // Token invalid (401 or expired) — clear session
            devLog('⚠️ Session restore: token invalid, clearing session');
            await logoutUser();
            setInitialRoute('Welcome');
          }
        } catch {
          // Network error — use cached profile if available
          devLog('⚠️ Session restore: network error, using cached data');
          setInitialRoute(profile ? 'HomeTabs' : 'Welcome');
        }
      } catch {
        setInitialRoute('Welcome');
      }
    };

    initialize();
  }, [contextLoading]);

  // Show a brief loading screen while checking AsyncStorage
  if (!initialRoute) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF007B" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef} linking={linking}>
        <OfflineBanner />
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: theme.colors.background },
            gestureEnabled: true,
          }}
        >
          <Stack.Screen name="IntroSlideshow" component={IntroSlideshowScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Verification" component={OTPVerificationScreen} />
          <Stack.Screen name="NameInput" component={NameInputScreen} />
          <Stack.Screen name="DateOfBirthInput" component={DateOfBirthScreen} />
          <Stack.Screen name="GenderSelection" component={GenderSelectionScreen} />
          <Stack.Screen name="LookingFor" component={LookingForScreen} />
          <Stack.Screen name="RelationshipGoals" component={RelationshipGoalsScreen} />
          <Stack.Screen name="InterestsSelection" component={InterestsSelectionScreen} />
          <Stack.Screen name="PhotoUpload" component={PhotoUploadScreen} />
          <Stack.Screen name="InitializingScreen" component={InitializingScreen} />
          <Stack.Screen name="NearbyMatches" component={NearbyMatchesScreen} />
          <Stack.Screen name="HomeTabs" component={TabNavigator} />
          <Stack.Screen name="Wallet" component={WalletScreen} />
          <Stack.Screen name="TopUp" component={TopUpScreen} />
          <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
          <Stack.Screen name="ChatConversation" component={ChatConversationScreen} />
          <Stack.Screen name="ProfileView" component={ProfileViewScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="DiscoverySettings" component={DiscoverySettingsScreen} />
          <Stack.Screen name="PrivacySafety" component={PrivacySafetyScreen} />
          <Stack.Screen name="ProfilePerformance" component={ProfilePerformanceScreen} />
          <Stack.Screen name="AccountActions" component={AccountActionsScreen} />
          <Stack.Screen name="ExploreCategory" component={ExploreCategoryScreen} />
          <Stack.Screen name="ProfileVerification" component={ProfileVerificationScreen} />
          <Stack.Screen name="LikesYou" component={LikesYouScreen} />
          <Stack.Screen name="PrivacyConsent" component={PrivacyConsentScreen} />
          <Stack.Screen
            name="Match"
            component={MatchScreen}
            options={{
              gestureEnabled: false,
              cardStyleInterpolator: ({ current }) => ({
                cardStyle: { opacity: current.progress },
              }),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigator;