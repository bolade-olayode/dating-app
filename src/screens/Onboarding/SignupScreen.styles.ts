// src/screens/Onboarding/SignupScreen.styles.ts
import { StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@config/theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  
  container: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
  },

  headerContainer: {
    marginBottom: SPACING.xl,
  },
  
  title: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 32,
    color: COLORS.black,
    marginBottom: SPACING.sm,
  },
  
  subtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.gray500,
    lineHeight: 24,
  },

  formContainer: {
    marginTop: SPACING.md,
  },

  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: SPACING.sm,
    borderRightWidth: 1,
    borderRightColor: COLORS.gray200,
    marginRight: SPACING.sm,
  },
  
  countryText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.black,
    marginRight: 4,
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray200,
  },
  
  dividerText: {
    paddingHorizontal: SPACING.md,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.gray400,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },

  socialContainer: {
    gap: SPACING.md,
  },

  toggleContainer: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  
  toggleText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.fontSize.base,
  },
});