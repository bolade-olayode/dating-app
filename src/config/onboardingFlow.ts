// src/config/onboardingFlow.ts

/**
 * ONBOARDING FLOW CONFIGURATION
 *
 * Centralized configuration for the onboarding steps.
 * Used by progress bar and navigation throughout the onboarding flow.
 *
 * STEPS:
 * 1. OTP Verification (12.5%)
 * 2. Name Input (25%)
 * 3. Date of Birth (37.5%)
 * 4. Gender Selection (50%)
 * 5. Looking For (62.5%)
 * 6. Relationship Goals (75%)
 * 7. Interests (87.5%)
 * 8. Photos/Completion (100%)
 */

export const TOTAL_ONBOARDING_STEPS = 8;

export const ONBOARDING_STEPS = {
  OTP_VERIFICATION: 1,
  NAME_INPUT: 2,
  DATE_OF_BIRTH: 3,
  GENDER_SELECTION: 4,
  LOOKING_FOR: 5,
  RELATIONSHIP_GOALS: 6,
  INTERESTS: 7,
  PHOTOS: 8,
} as const;

export const ONBOARDING_STEP_NAMES: Record<number, string> = {
  1: 'OTP Verification',
  2: 'Name',
  3: 'Date of Birth',
  4: 'Gender',
  5: 'Looking For',
  6: 'Relationship Goals',
  7: 'Interests',
  8: 'Photos',
};

/**
 * Calculate progress percentage for a given step
 * @param step Current step number (1-8)
 * @returns Progress percentage (0-100)
 */
export const getProgressPercentage = (step: number): number => {
  return Math.round((step / TOTAL_ONBOARDING_STEPS) * 100);
};
