// src/config/onboardingFlow.ts

/**
 * ONBOARDING FLOW CONFIGURATION
 *
 * Centralized configuration for the onboarding steps.
 * Used by progress bar and navigation throughout the onboarding flow.
 *
 * STEPS:
 * 1. OTP Verification (11%)
 * 2. Name Input (22%)
 * 3. Date of Birth (33%)
 * 4. Gender Selection (44%)
 * 5. Looking For (55%)
 * 6. Relationship Goals (66%)
 * 7. Interests (77%)
 * 8. Photos (88%)
 * 9. Bio/Completion (100%)
 */

export const TOTAL_ONBOARDING_STEPS = 9;

export const ONBOARDING_STEPS = {
  OTP_VERIFICATION: 1,
  NAME_INPUT: 2,
  DATE_OF_BIRTH: 3,
  GENDER_SELECTION: 4,
  LOOKING_FOR: 5,
  RELATIONSHIP_GOALS: 6,
  INTERESTS: 7,
  PHOTOS: 8,
  BIO_COMPLETION: 9,
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
  9: 'Bio',
};

/**
 * Calculate progress percentage for a given step
 * @param step Current step number (1-9)
 * @returns Progress percentage (0-100)
 */
export const getProgressPercentage = (step: number): number => {
  return Math.round((step / TOTAL_ONBOARDING_STEPS) * 100);
};
