// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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
import BioScreen from '@screens/Onboarding/BioScreen';

// Define the parameters for each screen (undefined means no parameters required)
export type RootStackParamList = {
  Welcome: undefined;
  Signup: undefined;
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
  BioScreen: {
    name: string;
    dateOfBirth: string;
    age: number;
    gender: string;
    lookingFor: string;
    relationshipGoal: string;
    interests: string[];
    photos: string[];
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const theme = useTheme();

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false, // We will build custom headers if needed
          cardStyle: { backgroundColor: theme.colors.background }, // Default white bg
          // Standard iOS-style slide animation for all phones
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Verification" component={OTPVerificationScreen} />
        <Stack.Screen name="NameInput" component={NameInputScreen} />
        <Stack.Screen name="DateOfBirthInput" component={DateOfBirthScreen} />
        <Stack.Screen name="GenderSelection" component={GenderSelectionScreen} />
        <Stack.Screen name="LookingFor" component={LookingForScreen} />
        <Stack.Screen name="RelationshipGoals" component={RelationshipGoalsScreen} />
        <Stack.Screen name="InterestsSelection" component={InterestsSelectionScreen} />
        <Stack.Screen name="PhotoUpload" component={PhotoUploadScreen} />
        <Stack.Screen name="BioScreen" component={BioScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;