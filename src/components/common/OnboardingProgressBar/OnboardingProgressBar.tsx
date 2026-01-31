// src/components/common/OnboardingProgressBar/OnboardingProgressBar.tsx

/**
 * ONBOARDING PROGRESS BAR
 * 
 * A thin progress bar that shows users how far they are in the signup flow.
 * Appears at the top of onboarding screens (OTP, Name, DOB, Gender, etc.)
 * 
 * 
 * USAGE:
 * <OnboardingProgressBar currentStep={2} totalSteps={7} />
 * 
 * ONBOARDING STEPS:
 * 1. OTP Verification (14%)
 * 2. Name Input (28%)
 * 3. Date of Birth (42%)
 * 4. Gender Selection (57%)
 * 5. Interests (71%)
 * 6. Photos (85%)
 * 7. Bio/Completion (100%)
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS } from '@config/theme';

interface OnboardingProgressBarProps {
  currentStep: number;  // Current step number (1-7)
  totalSteps: number;   // Total steps in onboarding (7)
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
   * Example: Step 2 of 7 = (2/7) * 100 = 28.57%
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