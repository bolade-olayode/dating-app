// src/screens/Onboarding/BioScreen.tsx

/**
 * BIO SCREEN
 * 
 * Final step of onboarding (Step 9 of 9).
 * Users share their personality through bio and prompts.
 * 
 * FEATURES:
 * - About Me bio (0-300 chars, optional)
 * - 3 prompt questions (1 required, 2 optional)
 * - Real-time character counters
 * - Auto-save to draft
 * - Skip option (saves progress)
 * - Progress bar at 100%
 * 
 * VALIDATION:
 * - Must fill at least 1 prompt OR bio (min 20 chars)
 * - Can skip entire screen if needed
 * 
 * NAVIGATION:
 * After completion → Profile Review or Home Screen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, TYPOGRAPHY } from '@config/theme';

// Components
import Button from '../../components/common/Button/Button';
import OnboardingProgressBar from '../../components/common/OnboardingProgressBar';

// Config & Constants
import { ONBOARDING_STEPS, TOTAL_ONBOARDING_STEPS } from '@config/onboardingFlow';
import { DEFAULT_BIO_PROMPTS, BIO_LIMITS } from '../../utils/bioPrompts';

// Navigation
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';

type BioScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BioScreen'>;
type BioScreenRouteProp = RouteProp<RootStackParamList, 'BioScreen'>;

interface Props {
  navigation: BioScreenNavigationProp;
  route: BioScreenRouteProp;
}

const BioScreen: React.FC<Props> = ({ navigation, route }) => {
  // Get accumulated data from previous screens
  const { 
    name, 
    dateOfBirth, 
    age, 
    gender, 
    lookingFor, 
    relationshipGoal, 
    interests, 
    photos 
  } = route.params || {};

  // State
  const [bio, setBio] = useState('');
  const [prompt1, setPrompt1] = useState('');
  const [prompt2, setPrompt2] = useState('');
  const [prompt3, setPrompt3] = useState('');
  const [loading, setLoading] = useState(false);

  // Get prompts
  const prompts = DEFAULT_BIO_PROMPTS;

  /**
   * AUTO-SAVE DRAFT
   * 
   * Save bio/prompts to draft service every 2 seconds.
   * Prevents data loss if user navigates away.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      // TODO: Implement draft service
      // await draftService.save({ bio, prompt1, prompt2, prompt3 });
      console.log('Auto-saved draft:', { bio, prompt1, prompt2, prompt3 });
    }, 2000);

    return () => clearTimeout(timer);
  }, [bio, prompt1, prompt2, prompt3]);

  /**
   * VALIDATE CONTENT
   * 
   * At least ONE field must have minimum 20 characters.
   */
  const hasEnoughContent = (): boolean => {
    const hasBio = bio.trim().length >= BIO_LIMITS.MIN_LENGTH;
    const hasPrompt1 = prompt1.trim().length >= BIO_LIMITS.MIN_LENGTH;
    const hasPrompt2 = prompt2.trim().length >= BIO_LIMITS.MIN_LENGTH;
    const hasPrompt3 = prompt3.trim().length >= BIO_LIMITS.MIN_LENGTH;

    return hasBio || hasPrompt1 || hasPrompt2 || hasPrompt3;
  };

  /**
   * SKIP FOR NOW
   * 
   * Saves whatever they've entered (if any) and proceeds.
   */
  const handleSkip = () => {
    Alert.alert(
      'Skip Bio?',
      'You can add your bio later in profile settings.',
      [
        {
          text: 'Go Back',
          style: 'cancel',
        },
        {
          text: 'Skip',
          onPress: () => handleComplete(true),
        },
      ]
    );
  };

  /**
   * CONTINUE
   * 
   * Validates and proceeds to next screen.
   */
  const handleContinue = () => {
    if (!hasEnoughContent()) {
      Alert.alert(
        'Add More Details',
        'Please fill in your bio or answer at least one prompt (minimum 20 characters).'
      );
      return;
    }

    handleComplete(false);
  };

  /**
   * COMPLETE ONBOARDING
   * 
   * Saves all data and navigates to completion screen.
   */
  const handleComplete = (skipped: boolean) => {
    setLoading(true);

    // Prepare final profile data
    const profileData = {
      name,
      dateOfBirth,
      age,
      gender,
      lookingFor,
      relationshipGoal,
      interests,
      photos,
      bio: bio.trim() || null,
      prompts: [
        prompt1.trim() ? { question: prompts[0].question, answer: prompt1.trim() } : null,
        prompt2.trim() ? { question: prompts[1].question, answer: prompt2.trim() } : null,
        prompt3.trim() ? { question: prompts[2].question, answer: prompt3.trim() } : null,
      ].filter(Boolean), // Remove null values
      completedAt: new Date().toISOString(),
      skippedBio: skipped,
    };

    console.log('🎉 ONBOARDING COMPLETE! Final Profile Data:', profileData);

    setTimeout(() => {
      setLoading(false);

      // TODO: Send to backend
      // await profileService.createProfile(profileData);

      // TODO: Clear onboarding draft
      // await draftService.clear();

      // Navigate to completion/home screen
      // For now, show success alert
      Alert.alert(
        '🎉 Profile Complete!',
        'Welcome to Opueh! Let\'s find your match.',
        [
          {
            text: 'Start Swiping',
            onPress: () => {
              // TODO: Navigate to Home/Discovery screen
              console.log('Navigate to Home Screen');
            },
          },
        ]
      );
    }, 1000);
  };

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safeArea}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Tell us about yourself</Text>
              <Text style={styles.subtitle}>
                Answer prompts to show your personality. Fill in your bio or at least one prompt.
              </Text>
            </View>

            {/* Bio Field (Optional) */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>About Me</Text>
              <Text style={styles.fieldHint}>Optional - Share a bit about yourself</Text>
              
              <TextInput
                style={styles.bioInput}
                placeholder="I love exploring new places, good food, and deep conversations..."
                placeholderTextColor={COLORS.gray600}
                value={bio}
                onChangeText={setBio}
                multiline
                maxLength={BIO_LIMITS.BIO_MAX}
                textAlignVertical="top"
              />
              
              <Text style={styles.charCounter}>
                {bio.length}/{BIO_LIMITS.BIO_MAX} characters
              </Text>
            </View>

            {/* Prompt 1 (Required) */}
            <View style={styles.fieldContainer}>
              <View style={styles.promptHeader}>
                <Text style={styles.promptEmoji}>{prompts[0].emoji}</Text>
                <Text style={styles.promptQuestion}>{prompts[0].question}</Text>
              </View>
              <Text style={styles.fieldHint}>Required</Text>
              
              <TextInput
                style={styles.promptInput}
                placeholder={prompts[0].placeholder}
                placeholderTextColor={COLORS.gray600}
                value={prompt1}
                onChangeText={setPrompt1}
                multiline
                maxLength={BIO_LIMITS.PROMPT_MAX}
              />
              
              <Text style={styles.charCounter}>
                {prompt1.length}/{BIO_LIMITS.PROMPT_MAX} characters
              </Text>
            </View>

            {/* Prompt 2 (Optional) */}
            <View style={styles.fieldContainer}>
              <View style={styles.promptHeader}>
                <Text style={styles.promptEmoji}>{prompts[1].emoji}</Text>
                <Text style={styles.promptQuestion}>{prompts[1].question}</Text>
              </View>
              <Text style={styles.fieldHint}>Optional</Text>
              
              <TextInput
                style={styles.promptInput}
                placeholder={prompts[1].placeholder}
                placeholderTextColor={COLORS.gray600}
                value={prompt2}
                onChangeText={setPrompt2}
                multiline
                maxLength={BIO_LIMITS.PROMPT_MAX}
              />
              
              <Text style={styles.charCounter}>
                {prompt2.length}/{BIO_LIMITS.PROMPT_MAX} characters
              </Text>
            </View>

            {/* Prompt 3 (Optional) */}
            <View style={styles.fieldContainer}>
              <View style={styles.promptHeader}>
                <Text style={styles.promptEmoji}>{prompts[2].emoji}</Text>
                <Text style={styles.promptQuestion}>{prompts[2].question}</Text>
              </View>
              <Text style={styles.fieldHint}>Optional</Text>
              
              <TextInput
                style={styles.promptInput}
                placeholder={prompts[2].placeholder}
                placeholderTextColor={COLORS.gray600}
                value={prompt3}
                onChangeText={setPrompt3}
                multiline
                maxLength={BIO_LIMITS.PROMPT_MAX}
              />
              
              <Text style={styles.charCounter}>
                {prompt3.length}/{BIO_LIMITS.PROMPT_MAX} characters
              </Text>
            </View>

            {/* Bottom spacing for footer */}
            <View style={{ height: 180 }} />
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            {/* Skip Button */}
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              activeOpacity={0.7}
            >
              <Text style={styles.skipButtonText}>Skip for now</Text>
            </TouchableOpacity>

            {/* Progress Bar */}
            <View style={styles.progressWrapper}>
              <OnboardingProgressBar
                currentStep={ONBOARDING_STEPS.BIO_COMPLETION}
                totalSteps={TOTAL_ONBOARDING_STEPS}
              />
            </View>

            {/* Continue Button */}
            <Button
              onPress={handleContinue}
              loading={loading}
              disabled={!hasEnoughContent()}
            >
              Finish & Start Matching
            </Button>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  safeArea: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: SPACING.xl,
    left: SPACING.md,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingTop: SPACING['3xl'],
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
  },

  // Header
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 32,
    color: COLORS.white,
    marginBottom: SPACING.sm,
    lineHeight: 40,
  },
  subtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.gray500,
    lineHeight: 24,
  },

  // Field Container
  fieldContainer: {
    marginBottom: SPACING.xl,
  },
  fieldLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  fieldHint: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.gray600,
    marginBottom: SPACING.sm,
  },

  // Bio Input
  bioInput: {
    backgroundColor: COLORS.gray900,
    borderRadius: 12,
    padding: SPACING.md,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.white,
    minHeight: 120,
    borderWidth: 1,
    borderColor: COLORS.gray800,
  },

  // Prompt Header
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  promptEmoji: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  promptQuestion: {
    flex: 1,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.white,
  },

  // Prompt Input
  promptInput: {
    backgroundColor: COLORS.gray900,
    borderRadius: 12,
    padding: SPACING.md,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.white,
    minHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.gray800,
  },

  // Character Counter
  charCounter: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.gray600,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.black,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray900,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
  },
  skipButtonText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.gray500,
  },
  progressWrapper: {
    marginBottom: SPACING.md,
  },
});

export default BioScreen;