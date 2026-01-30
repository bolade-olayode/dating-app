// src/hooks/useFonts.ts
import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          // Main fonts you'll use (Regular, Medium, SemiBold, Bold)
          'EBGaramond-Regular': require('../assets/fonts/EBGaramond-Regular.ttf'),
          'EBGaramond-Medium': require('../assets/fonts/EBGaramond-Medium.ttf'),
          'EBGaramond-SemiBold': require('../assets/fonts/EBGaramond-SemiBold.ttf'),
          'EBGaramond-Bold': require('../assets/fonts/EBGaramond-Bold.ttf'),
          'EBGaramond-ExtraBold': require('../assets/fonts/EBGaramond-ExtraBold.ttf'),
          
          
          /* 'EBGaramond-Italic': require('../../assets/fonts/EBGaramond-Italic.ttf'),
          'EBGaramond-MediumItalic': require('../../assets/fonts/EBGaramond-MediumItalic.ttf'),
          'EBGaramond-SemiBoldItalic': require('../../assets/fonts/EBGaramond-SemiBoldItalic.ttf'),
          'EBGaramond-BoldItalic': require('../../assets/fonts/EBGaramond-BoldItalic.ttf'),
          'EBGaramond-ExtraBoldItalic': require('../../assets/fonts/EBGaramond-ExtraBoldItalic.ttf'), */
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      }
    }

    loadFonts();
  }, []);

  return fontsLoaded;
};