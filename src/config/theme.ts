// src/config/theme.ts

export interface Theme {
  colors: typeof COLORS;
  typography: typeof TYPOGRAPHY;
  spacing: typeof SPACING;
  sizes: typeof SIZES;
  shadows: typeof SHADOWS;
  layout: typeof LAYOUT;
}


export const COLORS = {
  // Primary Colors (from Figma design)
  primary: '#EA276D',
  primaryDark: '#E85A8A',
  primaryLight: '#FF8FB3',
  
  // Secondary Colors
  secondary: '#4ECDC4',
  secondaryDark: '#3DB5AD',
  secondaryLight: '#7EDDD6',
  
  // Neutral Colors
  black: '#000000',
  white: '#FFFFFF',
  gray100: '#F8F8F8',
  gray200: '#F0F0F0',
  gray300: '#E0E0E0',
  gray400: '#CCCCCC',
  gray500: '#999999',
  gray600: '#666666',
  gray700: '#4D4D4D',
  gray800: '#333333',
  gray900: '#1A1A1A',
  
  // Semantic Colors
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
  
  // Background Colors
  background: '#FFFFFF',
  backgroundSecondary: '#F8F8F8',
  backgroundTertiary: '#F5F5F5',
  
  // Text Colors
  textPrimary: '#000000',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textDisabled: '#CCCCCC',
  textInverse: '#FFFFFF',
  
  // Intent Colors
  intentFriendship: '#9C27B0',
  intentDating: '#FF6B9D',
  intentSerious: '#3F51B5',
  intentMarriage: '#E91E63',
  
  // Social Media Colors
  facebook: '#1877F2',
  google: '#EA4335',
  twitter: '#1DA1F2',
  
  // Input & Form Colors
  inputBorder: '#E0E0E0',
  inputBorderFocused: '#FF6B9D',
  inputBackground: '#FFFFFF',
  inputDisabled: '#F8F8F8',
  
  // Tag/Chip Colors
  tagBackground: '#F0F0F0',
  tagText: '#333333',
  tagSelected: '#FF6B9D',
  tagSelectedText: '#FFFFFF',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
} as const;

export const TYPOGRAPHY = {
  fontFamily: {
    regular: 'EBGaramond-Regular',
    medium: 'EBGaramond-Medium',
    semiBold: 'EBGaramond-SemiBold',
    bold: 'EBGaramond-Bold',
    extraBold: 'EBGaramond-ExtraBold',
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 22,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  fontWeight: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
} as const;

export const SIZES = {
  borderRadius: {
    none: 0,
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 9999,
  },
  
  icon: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 48,
  },
  
  avatar: {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
    '2xl': 128,
  },
  
  button: {
    sm: 40,
    md: 48,
    lg: 56,
  },
  
  input: {
    sm: 40,
    md: 48,
    lg: 56,
  },
} as const;

export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 16,
  },
} as const;

export const LAYOUT = {
  screenPadding: SPACING.lg,
  screenPaddingHorizontal: SPACING.lg,
  screenPaddingVertical: SPACING.xl,
  containerMaxWidth: 428,
  headerHeight: 56,
  tabBarHeight: 60,
  safeAreaTop: 44,
  safeAreaBottom: 34,
} as const;

export const theme: Theme = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  sizes: SIZES,
  shadows: SHADOWS,
  layout: LAYOUT,
};

export default theme;