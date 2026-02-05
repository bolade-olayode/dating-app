// src/config/fonts.ts
// Sora font family configuration (matching MeetPieApp)

// Font family names to use in your components
export const FONTS = {
  // Weight variants
  Thin: 'Sora-Thin',
  ExtraLight: 'Sora-ExtraLight',
  Light: 'Sora-Light',
  Regular: 'Sora-Regular',
  Medium: 'Sora-Medium',
  SemiBold: 'Sora-SemiBold',
  Bold: 'Sora-Bold',
  ExtraBold: 'Sora-ExtraBold',

  // Semantic aliases for easier use
  H1: 'Sora-Bold',
  H2: 'Sora-SemiBold',
  H3: 'Sora-Medium',
  Body: 'Sora-Regular',
  BodyBold: 'Sora-Bold',
  Caption: 'Sora-ExtraLight',
} as const;

// Font files to load (used in UseFonts hook)
export const FONT_FILES = {
  'Sora-Thin': require('../assets/fonts/Sora-Thin.ttf'),
  'Sora-ExtraLight': require('../assets/fonts/Sora-ExtraLight.ttf'),
  'Sora-Light': require('../assets/fonts/Sora-Light.ttf'),
  'Sora-Regular': require('../assets/fonts/Sora-Regular.ttf'),
  'Sora-Medium': require('../assets/fonts/Sora-Medium.ttf'),
  'Sora-SemiBold': require('../assets/fonts/Sora-SemiBold.ttf'),
  'Sora-Bold': require('../assets/fonts/Sora-Bold.ttf'),
  'Sora-ExtraBold': require('../assets/fonts/Sora-ExtraBold.ttf'),
};

export default FONTS;
