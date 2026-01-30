import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@config/theme';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  contentContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    width: '100%',
  },

  title: {
    fontFamily: TYPOGRAPHY.fontFamily.bold, 
    fontSize: 60, 
    color: COLORS.white,
    lineHeight: 70,
    marginBottom: SPACING.xs,
    textAlign: 'left', 
  },

  highlight: {
    color: COLORS.primary, 
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  subtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.gray200,
    marginTop: SPACING.md,
    marginBottom: SPACING.xl * 1.5,
    maxWidth: '90%',
  },

  buttonContainer: {
    width: '100%',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
    paddingTop: SPACING.xl,
  },

  // Black Button
  blackButton: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },

  // Terms and Conditions text
  termsText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 17,  
    color: COLORS.gray300,
    textAlign: 'center',
    marginTop: SPACING.sm,
    opacity: 0.8,
  },
});