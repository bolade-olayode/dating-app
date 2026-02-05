// src/screens/Onboarding/BioScreen.tsx
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
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

// Config
import { FONTS } from '../../config/fonts';
import { ONBOARDING_STEPS, TOTAL_ONBOARDING_STEPS } from '@config/onboardingFlow';
import { DEFAULT_BIO_PROMPTS, BIO_LIMITS } from '../../utils/bioPrompts';

// Components
import Flare from '../../components/ui/Flare';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import { PrimaryButton } from '../../components/ui/Buttons';

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
  const {
    name,
    dateOfBirth,
    age,
    gender,
    lookingFor,
    relationshipGoal,
    interests,
    photos,
  } = route.params || {};

  const [bio, setBio] = useState('');
  const [prompt1, setPrompt1] = useState('');
  const [prompt2, setPrompt2] = useState('');
  const [prompt3, setPrompt3] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const prompts = DEFAULT_BIO_PROMPTS;

  // Onboarding progress
  const CURRENT_STEP = ONBOARDING_STEPS.BIO_COMPLETION;
  const TOTAL_STEPS = TOTAL_ONBOARDING_STEPS;

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Auto-saved draft:', { bio, prompt1, prompt2, prompt3 });
    }, 2000);
    return () => clearTimeout(timer);
  }, [bio, prompt1, prompt2, prompt3]);

  const hasEnoughContent = (): boolean => {
    const hasBio = bio.trim().length >= BIO_LIMITS.MIN_LENGTH;
    const hasPrompt1 = prompt1.trim().length >= BIO_LIMITS.MIN_LENGTH;
    const hasPrompt2 = prompt2.trim().length >= BIO_LIMITS.MIN_LENGTH;
    const hasPrompt3 = prompt3.trim().length >= BIO_LIMITS.MIN_LENGTH;
    return hasBio || hasPrompt1 || hasPrompt2 || hasPrompt3;
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Bio?',
      'You can add your bio later in profile settings.',
      [
        { text: 'Go Back', style: 'cancel' },
        { text: 'Skip', onPress: () => handleComplete(true) },
      ]
    );
  };

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

  const handleComplete = (skipped: boolean) => {
    setLoading(true);

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
      ].filter(Boolean),
      completedAt: new Date().toISOString(),
      skippedBio: skipped,
    };

    console.log('🎉 ONBOARDING COMPLETE! Final Profile Data:', profileData);

    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        '🎉 Profile Complete!',
        "Welcome to Opueh! Let's find your match.",
        [
          {
            text: 'Start Swiping',
            onPress: () => {
              console.log('Navigate to Home Screen');
            },
          },
        ]
      );
    }, 1000);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderTextArea = (
    value: string,
    onChange: (text: string) => void,
    placeholder: string,
    maxLength: number,
    fieldKey: string,
    minHeight: number = 100
  ) => {
    const isFocused = focusedField === fieldKey;
    const hasValue = value.length > 0;
    const showGradient = isFocused || hasValue;

    return (
      <View style={styles.inputWrapper}>
        {showGradient ? (
          <LinearGradient
            colors={['#FF007B', '#6366F1', '#00B4D8']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradientBorder}
          >
            <View style={[styles.inputInner, { minHeight }]}>
              <TextInput
                style={[styles.textInput, { minHeight: minHeight - 4 }]}
                placeholder={placeholder}
                placeholderTextColor="#444"
                value={value}
                onChangeText={onChange}
                onFocus={() => setFocusedField(fieldKey)}
                onBlur={() => setFocusedField(null)}
                multiline
                maxLength={maxLength}
                textAlignVertical="top"
              />
            </View>
          </LinearGradient>
        ) : (
          <View style={[styles.inputBorder, { minHeight }]}>
            <TextInput
              style={[styles.textInput, { minHeight: minHeight - 4 }]}
              placeholder={placeholder}
              placeholderTextColor="#444"
              value={value}
              onChangeText={onChange}
              onFocus={() => setFocusedField(fieldKey)}
              onBlur={() => setFocusedField(null)}
              multiline
              maxLength={maxLength}
              textAlignVertical="top"
            />
          </View>
        )}
        <Text style={styles.charCounter}>
          {value.length}/{maxLength}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Flare Background Effect */}
      <Flare />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Header with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Icon name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Title */}
            <Text style={styles.title}>Write your bio</Text>
            <Text style={styles.subtitle}>
              Tell potential matches about yourself
            </Text>

            {/* Bio Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>About Me</Text>
              {renderTextArea(
                bio,
                setBio,
                'Share a bit about yourself...',
                BIO_LIMITS.BIO_MAX,
                'bio',
                120
              )}
            </View>

            {/* Prompt 1 */}
            <View style={styles.fieldContainer}>
              <View style={styles.promptHeader}>
                <Text style={styles.promptEmoji}>{prompts[0].emoji}</Text>
                <Text style={styles.promptQuestion}>{prompts[0].question}</Text>
              </View>
              {renderTextArea(
                prompt1,
                setPrompt1,
                prompts[0].placeholder,
                BIO_LIMITS.PROMPT_MAX,
                'prompt1'
              )}
            </View>

            {/* Prompt 2 */}
            <View style={styles.fieldContainer}>
              <View style={styles.promptHeader}>
                <Text style={styles.promptEmoji}>{prompts[1].emoji}</Text>
                <Text style={styles.promptQuestion}>{prompts[1].question}</Text>
              </View>
              {renderTextArea(
                prompt2,
                setPrompt2,
                prompts[1].placeholder,
                BIO_LIMITS.PROMPT_MAX,
                'prompt2'
              )}
            </View>

            {/* Prompt 3 */}
            <View style={styles.fieldContainer}>
              <View style={styles.promptHeader}>
                <Text style={styles.promptEmoji}>{prompts[2].emoji}</Text>
                <Text style={styles.promptQuestion}>{prompts[2].question}</Text>
              </View>
              {renderTextArea(
                prompt3,
                setPrompt3,
                prompts[2].placeholder,
                BIO_LIMITS.PROMPT_MAX,
                'prompt3'
              )}
            </View>

            {/* Bottom spacing */}
            <View style={{ height: 40 }} />
          </ScrollView>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            {/* Skip Button */}
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              activeOpacity={0.7}
            >
              <Text style={styles.skipButtonText}>Skip for now</Text>
            </TouchableOpacity>

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              <ProgressIndicator step={CURRENT_STEP} totalSteps={TOTAL_STEPS} />
            </View>

            {/* Continue Button */}
            <View style={styles.buttonContainer}>
              <PrimaryButton
                text="Finish & Start Matching"
                onPress={handleContinue}
                disabled={!hasEnoughContent() || loading}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 20,
  },
  title: {
    fontFamily: FONTS.Bold,
    fontSize: 28,
    color: '#fff',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: FONTS.Regular,
    fontSize: 15,
    color: '#9A9A9A',
    lineHeight: 22,
    marginBottom: 32,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
  },
  inputWrapper: {
    width: '100%',
  },
  gradientBorder: {
    borderRadius: 12,
    padding: 2,
  },
  inputBorder: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#202427',
  },
  inputInner: {
    borderRadius: 10,
    backgroundColor: '#202427',
  },
  textInput: {
    padding: 14,
    fontFamily: FONTS.Regular,
    fontSize: 15,
    color: '#fff',
    lineHeight: 22,
  },
  charCounter: {
    fontFamily: FONTS.Regular,
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 8,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  promptEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  promptQuestion: {
    flex: 1,
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    color: '#fff',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
    paddingTop: 12,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 8,
  },
  skipButtonText: {
    fontFamily: FONTS.Medium,
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    marginBottom: 16,
  },
  buttonContainer: {
    width: '100%',
  },
});

export default BioScreen;
