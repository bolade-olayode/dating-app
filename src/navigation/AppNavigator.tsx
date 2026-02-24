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
import { devLog } from '@config/environment';
import { navigationRef } from '@navigation/navigationRef';
import OfflineBanner from '@components/common/OfflineBanner';

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
};

const Stack = createStackNavigator<RootStackParamList>();

const mapApiUserToProfile = (user: any): UserProfile => ({
  id: user.id || user._id,
  name: user.name || '',
  email: user.email,
  phoneNumber: user.phone,
  dateOfBirth: user.dateOfBirth,
  age: user.age || (user.dateOfBirth ? (() => {
    const dob = new Date(user.dateOfBirth);
    const today = new Date();
    let a = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) a--;
    return a;
  })() : undefined),
  gender: user.gender || '',
  lookingFor: user.lookingFor || '',
  relationshipGoal: user.relationshipGoal || '',
  interests: (user.interests || []).map((i: any) => (typeof i === 'string' ? i : i.name || '')).filter(Boolean),
  photos: user.photos || [],
  bio: user.bio,
  location: typeof user.location === 'string'
    ? user.location
    : user.location?.city || user.city || '',
  verified: user.verified || false,
});

const AppNavigator = () => {
  const theme = useTheme();
  const { isLoading: contextLoading, isAuthenticated, profile, login: loginUser, logout: logoutUser } = useUser();
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    // Wait for UserContext to finish loading persisted data
    if (contextLoading) return;

    const initialize = async () => {
      try {
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
              // Merge: keep locally-saved values for any field the API returned empty/missing.
              // This prevents a backend non-200 name (or missing field) from overwriting
              // edits the user made and saved locally.
              const merged = { ...(profile || {}), ...apiProfile } as UserProfile;
              if (profile) {
                (Object.keys(merged) as (keyof UserProfile)[]).forEach((key) => {
                  const apiVal = (apiProfile as any)[key];
                  const localVal = (profile as any)[key];
                  const isEmpty = apiVal === undefined || apiVal === null || apiVal === '' ||
                    (Array.isArray(apiVal) && apiVal.length === 0);
                  if (isEmpty && localVal) {
                    (merged as any)[key] = localVal;
                  }
                });
              }
              await loginUser(token, merged);
            }
            setInitialRoute('HomeTabs');
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
      <NavigationContainer ref={navigationRef}>
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