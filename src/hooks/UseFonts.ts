// src/hooks/UseFonts.ts
// Updated to load Sora font family (replacing EB Garamond)
import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Font files to load - Sora font family
const FONT_FILES = {
  'Sora-Thin': require('../assets/fonts/Sora-Thin.ttf'),
  'Sora-ExtraLight': require('../assets/fonts/Sora-ExtraLight.ttf'),
  'Sora-Light': require('../assets/fonts/Sora-Light.ttf'),
  'Sora-Regular': require('../assets/fonts/Sora-Regular.ttf'),
  'Sora-Medium': require('../assets/fonts/Sora-Medium.ttf'),
  'Sora-SemiBold': require('../assets/fonts/Sora-SemiBold.ttf'),
  'Sora-Bold': require('../assets/fonts/Sora-Bold.ttf'),
  'Sora-ExtraBold': require('../assets/fonts/Sora-ExtraBold.ttf'),
};

export const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync(FONT_FILES);
      } catch (e) {
        console.warn('Error loading fonts:', e);
      } finally {
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      }
    }

    loadFonts();
  }, []);

  return fontsLoaded;
};

// Export font files for use in _layout if needed
export { FONT_FILES };
