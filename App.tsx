import React, { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '@context/ThemeContext';
import { UserProvider } from '@context/UserContext';
import { QueryProvider } from '@services/api-new/QueryProvider';
import { FONT_FILES } from '@config/fonts';
import AppNavigator from '@navigation/AppNavigator';
import ErrorBoundary from '@components/common/ErrorBoundary';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts(FONT_FILES);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryProvider>
          <UserProvider>
            <ThemeProvider>
              <AppNavigator />
            </ThemeProvider>
          </UserProvider>
        </QueryProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
