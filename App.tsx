import React, { useCallback } from 'react';
import { View } from 'react-native';
import { ThemeProvider } from '@context/ThemeContext';
import { useFonts } from './src/hooks/UseFonts';
import * as SplashScreen from 'expo-splash-screen';

import AppNavigator from '@navigation/AppNavigator';

// Keep splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

function App(): React.JSX.Element | null {
  const fontsLoaded = useFonts();

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Show nothing until fonts are ready
  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </View>
  );
}

export default App;