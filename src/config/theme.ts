// src/config/theme.ts
// Updated to match MeetPieApp design system

export interface Theme {
  colors: typeof COLORS;
  typography: typeof TYPOGRAPHY;
  spacing: typeof SPACING;
  sizes: typeof SIZES;
  shadows: typeof SHADOWS;
  layout: typeof LAYOUT;
  gradients: typeof GRADIENTS;
}

export const COLORS = {
  // Primary Colors (MeetPieApp style)
  primary: '#FF1B6D',
  primaryAlt: '#FF007B',
  primaryDark: '#E8005A',
  primaryLight: '#FF4D8D',

  // Gradient Colors
  gradientPink: '#FF007B',
  gradientPurple: '#6366F1',
  gradientCyan: '#00B4D8',

  // Secondary/Accent Colors
  secondary: '#6366F1',
  secondaryDark: '#4F46E5',
  secondaryLight: '#818CF8',
  accent: '#00B4D8',

  // Neutral Colors (Dark Theme)
  black: '#000000',
  background: '#000000',
  backgroundAlt: '#090812',
  surface: '#0D0D0D',
  white: '#FFFFFF',
  gray100: '#F8F8F8',
  gray200: '#E5E5E5',
  gray300: '#D4D4D4',
  gray400: '#A3A3A3',
  gray500: '#666666',
  gray600: '#444444',
  gray700: '#333333',
  gray800: '#222222',
  gray900: '#1A1A1A',

  // Semantic Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#FF4444',
  info: '#3B82F6',

  // Text Colors
  textPrimary: '#FFFFFF',
  textSecondary: '#666666',
  textTertiary: '#444444',
  textDisabled: '#333333',
  textInverse: '#000000',

  // Intent Colors
  intentFriendship: '#A855F7',
  intentDating: '#FF007B',
  intentSerious: '#6366F1',
  intentMarriage: '#FF1B6D',

  // Social Media Colors
  facebook: '#1877F2',
  google: '#EA4335',
  twitter: '#1DA1F2',

  // Input & Form Colors (Dark Theme)
  inputBorder: '#222222',
  inputBorderFocused: '#FF007B',
  inputBackground: '#0D0D0D',
  inputDisabled: '#1A1A1A',

  // Tag/Chip Colors
  tagBackground: '#1A1A1A',
  tagText: '#666666',
  tagSelected: '#FF007B',
  tagSelectedText: '#FFFFFF',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',

  // Glass effect
  glass: 'rgba(255, 255, 255, 0.03)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
} as const;

// Gradient configurations for LinearGradient
export const GRADIENTS = {
  primary: {
    colors: ['#FF007B', '#6366F1', '#00B4D8'] as const,
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
  },
  primaryVertical: {
    colors: ['#FF007B', '#6366F1', '#00B4D8'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  pinkCyan: {
    colors: ['#FF007B', '#00B4D8'] as const,
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
  },
  overlay: {
    colors: ['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,1)'] as const,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
} as const;

export const TYPOGRAPHY = {
  fontFamily: {
    // Sora font family (replacing EB Garamond)
    thin: 'Sora-Thin',
    extraLight: 'Sora-ExtraLight',
    light: 'Sora-Light',
    regular: 'Sora-Regular',
    medium: 'Sora-Medium',
    semiBold: 'Sora-SemiBold',
    bold: 'Sora-Bold',
    extraBold: 'Sora-ExtraBold',

    // Semantic aliases
    h1: 'Sora-Bold',
    h2: 'Sora-SemiBold',
    h3: 'Sora-Medium',
    body: 'Sora-Regular',
    bodyBold: 'Sora-Bold',
    caption: 'Sora-ExtraLight',
  },

  fontSize: {
    xs: 12,
    sm: 14,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
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
    thin: '100',
    extraLight: '200',
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
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
    lg: 14,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    full: 100,
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
    xl: 60,
    '2xl': 64,
  },

  input: {
    sm: 40,
    md: 48,
    lg: 56,
    xl: 60,
    '2xl': 80,
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
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
} as const;

export const LAYOUT = {
  screenPadding: SPACING.lg,
  screenPaddingHorizontal: 24,
  screenPaddingVertical: SPACING.xl,
  containerMaxWidth: 428,
  headerHeight: 56,
  tabBarHeight: 80,
  safeAreaTop: 44,
  safeAreaBottom: 34,
  backButtonSize: 40,
} as const;

export const theme: Theme = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  sizes: SIZES,
  shadows: SHADOWS,
  layout: LAYOUT,
  gradients: GRADIENTS,
};

export default theme;
