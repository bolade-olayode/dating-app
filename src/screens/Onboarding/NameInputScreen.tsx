// src/screens/Onboarding/NameInputScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, TYPOGRAPHY, SIZES } from '@config/theme';

// Components
import Button from '../../components/common/Button/Button';
import OnboardingProgressBar from '../../components/common/OnboardingProgressBar';

// Config
import { ONBOARDING_STEPS, TOTAL_ONBOARDING_STEPS } from '@config/onboardingFlow';

// Navigation
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/AppNavigator';

type NameInputScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'NameInput'
>;

interface Props {
  navigation: NameInputScreenNavigationProp;
}

const NameInputScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Onboarding progress: Step 2 of 9
  const CURRENT_STEP = ONBOARDING_STEPS.NAME_INPUT;
  const TOTAL_STEPS = TOTAL_ONBOARDING_STEPS;

  const validateName = (text: string): boolean => {
    // Remove extra spaces and validate
    const trimmedName = text.trim();
    
    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters');
      return false;
    }
    
    if (trimmedName.length > 50) {
      setError('Name is too long (max 50 characters)');
      return false;
    }
    
    // Check if name contains only letters and spaces
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(trimmedName)) {
      setError('Name can only contain letters');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleNameChange = (text: string) => {
    setName(text);
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleContinue = () => {
    if (!validateName(name)) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Navigate to Date of Birth screen
      navigation.navigate('DateOfBirthInput', { name: name.trim() });
    }, 800);
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
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Ok, Let's set up your profile!</Text>
              <Text style={styles.subtitle}>First, what's your name?</Text>
            </View>

            {/* Name Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="Boladde"
                placeholderTextColor={COLORS.gray500}
                value={name}
                onChangeText={handleNameChange}
                autoFocus
                autoCapitalize="words"
                autoCorrect={false}
                maxLength={50}
              />
              
              {/* Error Message */}
              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}
              
              {/* Helper Text */}
              <Text style={styles.helperText}>
                This is how your name will appear on your profile
              </Text>
            </View>
          </View>

          {/* Progress Bar - just above button */}
          <View style={styles.progressContainer}>
            <OnboardingProgressBar currentStep={CURRENT_STEP} totalSteps={TOTAL_STEPS} />
          </View>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <Button
              onPress={handleContinue}
              loading={loading}
              disabled={name.trim().length < 2}
            >
              Continue
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
    paddingHorizontal: SPACING.lg,
  },

  // Header
  header: {
    marginBottom: SPACING['3xl'],
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 32,
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.gray500,
    lineHeight: 28,
  },

  // Input
  inputContainer: {
    marginBottom: SPACING.xl,
  },
  input: {
    height: 56,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius.md,
    paddingHorizontal: SPACING.md,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.black,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.error,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  helperText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.gray500,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },

  // Progress Bar
  progressContainer: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },

  // Button
  buttonContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
});

export default NameInputScreen;