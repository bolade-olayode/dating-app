// src/components/common/Button/Button.styles.ts
import { StyleSheet } from 'react-native';
import { COLORS, SPACING, SIZES, TYPOGRAPHY, SHADOWS } from '@config/theme';

export const styles = StyleSheet.create({
  // Base button style
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.borderRadius.md,
    ...SHADOWS.sm,
  },

  // Button sizes
  button_sm: {
    height: SIZES.button.sm,
    paddingHorizontal: SPACING.md,
  },
  button_md: {
    height: SIZES.button.md,
    paddingHorizontal: SPACING.lg,
  },
  button_lg: {
    height: SIZES.button.lg,
    paddingHorizontal: SPACING.xl,
  },

  // Button variants
  button_primary: {
    backgroundColor: COLORS.primary, // Pink (#FF6B9D)
  },
  button_secondary: {
    backgroundColor: COLORS.gray800, // Dark gray/black (Primary 2 from design)
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  button_ghost: {
    backgroundColor: 'transparent',
    ...SHADOWS.none,
  },
  button_danger: {
    backgroundColor: COLORS.error,
  },

  // Button states
  buttonDisabled: {
    backgroundColor: COLORS.gray200, // Light gray (Static/inactive from design)
    ...SHADOWS.none,
    opacity: 1, // Override default opacity
  },

  buttonFullWidth: {
    width: '100%',
  },

  // Content container
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Text styles
  text: {
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
  //  fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    textAlign: 'center',
  },

  // Text sizes
  text_sm: {
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  text_md: {
    fontSize: TYPOGRAPHY.fontSize.base,
  },
  text_lg: {
    fontSize: TYPOGRAPHY.fontSize.lg,
  },

  // Text variants
  text_primary: {
    color: COLORS.white,
  },
  text_secondary: {
    color: COLORS.white,
  },
  text_outline: {
    color: COLORS.primary,
  },
  text_ghost: {
    color: COLORS.primary,
  },
  text_danger: {
    color: COLORS.white,
  },

  // Text disabled state
  textDisabled: {
    color: COLORS.gray500, // Gray text for inactive state
  },

  // Icon styles
  iconLeft: {
    marginRight: SPACING.sm,
  },
  iconRight: {
    marginLeft: SPACING.sm,
  },
});