// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTheme } from '@context/ThemeContext';
import { StatusBar } from 'react-native';

// Import Screens
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

// Define the parameters for each screen (undefined means no parameters required)
export type RootStackParamList = {
  Welcome: undefined;
  Signup: undefined;
  Register: undefined;
  Login: undefined;
  Verification: {
    phoneNumber?: string;
    email?: string;
    expiresAt?: number;
  } | undefined;
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
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const theme = useTheme();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        <Stack.Navigator
          // TODO: Change back to "Welcome" when APIs are ready
          initialRouteName="InitializingScreen"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: theme.colors.background },
            gestureEnabled: true,
          }}
        >
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