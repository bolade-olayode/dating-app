// src/components/common/OnboardingProgressBar/OnboardingProgressBar.tsx

/**
 * ONBOARDING PROGRESS BAR
 *
 * A thin progress bar that shows users how far they are in the signup flow.
 * Appears at the bottom of onboarding screens, just above the Continue button.
 *
 * USAGE:
 * import { ONBOARDING_STEPS, TOTAL_ONBOARDING_STEPS } from '@config/onboardingFlow';
 * <OnboardingProgressBar currentStep={ONBOARDING_STEPS.NAME_INPUT} totalSteps={TOTAL_ONBOARDING_STEPS} />
 *
 * ONBOARDING STEPS (9 Total):
 * 1. OTP Verification    (11%)
 * 2. Name Input          (22%)
 * 3. Date of Birth       (33%)
 * 4. Gender Selection    (44%)
 * 5. Looking For         (55%)
 * 6. Relationship Goals  (66%)
 * 7. Interests           (77%)
 * 8. Photos              (88%)
 * 9. Bio/Completion      (100%)
 *
 * NOTE: Always use constants from @config/onboardingFlow instead of hardcoded numbers
 * to ensure consistency across all screens.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS } from '@config/theme';

interface OnboardingProgressBarProps {
  currentStep: number;  // Current step number (1-9)
  totalSteps: number;   // Total steps in onboarding (9)
  height?: number;      // Bar height in pixels (default: 3)
  backgroundColor?: string;  // Background color (default: gray)
  progressColor?: string;    // Fill color (default: primary pink)
}

const OnboardingProgressBar: React.FC<OnboardingProgressBarProps> = ({
  currentStep,
  totalSteps,
  height = 3,
  backgroundColor = COLORS.gray800,
  progressColor = COLORS.primary,
}) => {
  // Animated value for smooth progress animation
  const progressAnimation = React.useRef(new Animated.Value(0)).current;

  /**
   * CALCULATE PROGRESS PERCENTAGE
   *
   * Formula: (currentStep / totalSteps) * 100
   * Example: Step 2 of 9 = (2/9) * 100 = 22.22%
   */
  const progressPercentage = (currentStep / totalSteps) * 100;

  /**
   * ANIMATE PROGRESS BAR
   * 
   * Smoothly animates from current progress to new progress
   * when currentStep changes.
   */
  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: progressPercentage,
      duration: 400,  // 400ms smooth animation
      useNativeDriver: false,  // Width animation doesn't support native driver
    }).start();
  }, [currentStep, progressPercentage]);

  /**
   * INTERPOLATE WIDTH
   * 
   * Converts percentage (0-100) to actual width (0% - 100%)
   * for the animated progress bar.
   */
  const progressWidth = progressAnimation.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Background bar (full width, gray) */}
      <View 
        style={[
          styles.backgroundBar, 
          { 
            height,
            backgroundColor,
          }
        ]} 
      />
      
      {/* Progress fill (animated width, pink) */}
      <Animated.View
        style={[
          styles.progressBar,
          {
            height,
            backgroundColor: progressColor,
            width: progressWidth,  // Animated from 0% to 100%
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 3,
    position: 'relative',
  },
  backgroundBar: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default OnboardingProgressBar;