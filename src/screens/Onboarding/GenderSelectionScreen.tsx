/**
 * GENDER SELECTION SCREEN
 * * Step 4 of Onboarding.
 * Users select their gender identity.
 * * FEATURES:
 * - Card-based selection (Male/Female)
 * - Visual active states
 * - Data passing chain (Name -> DOB -> Gender -> LookingFor)
 * - Progress bar (Step 4 of 9)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, TYPOGRAPHY } from '@config/theme';

// Components
import Button from '../../components/common/Button/Button';
import OnboardingProgressBar from '../../components/common/OnboardingProgressBar';

// Config
import { ONBOARDING_STEPS, TOTAL_ONBOARDING_STEPS } from '@config/onboardingFlow';

// Constants
import { GENDER_OPTIONS } from '../../utils/constant';

// Navigation
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';

type GenderSelectionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'GenderSelection'
>;

type GenderSelectionScreenRouteProp = RouteProp<RootStackParamList, 'GenderSelection'>;

interface Props {
  navigation: GenderSelectionScreenNavigationProp;
  route: GenderSelectionScreenRouteProp;
}

const GenderSelectionScreen: React.FC<Props> = ({ navigation, route }) => {
  // Get data from previous screens
  const { name, dateOfBirth, age } = route.params || {};

  // State
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * HANDLE CONTINUE
   * * Validates selection and moves to Interests screen.
   */
  const handleContinue = () => {
    if (!selectedGender) {
      Alert.alert('Required', 'Please select your gender to continue.');
      return;
    }

    setLoading(true);

    // Simulate short processing delay for UX smoothness
    setTimeout(() => {
      setLoading(false);
      
      console.log('User Data So Far:', { name, dateOfBirth, age, gender: selectedGender });

      // Navigate to Looking For Screen (Next Step)
      navigation.navigate('LookingFor', {
        name,
        dateOfBirth,
        age,
        gender: selectedGender,
      });
    }, 500);
  };

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* Back Button (Consistent with DOB Screen) */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>

        <View style={styles.container}>
          <View style={styles.content}>
            
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>
                How do you identify?
              </Text>
              <Text style={styles.subtitle}>
                Select your gender to help us find you the right matches.
                You can change who you see later in settings.
              </Text>
            </View>

            {/* Gender Selection Cards */}
            <View style={styles.optionsContainer}>
              {GENDER_OPTIONS.map((option) => {
                const isSelected = selectedGender === option.id;
                
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.genderCard,
                      isSelected && styles.genderCardActive
                    ]}
                    onPress={() => setSelectedGender(option.id)}
                    activeOpacity={0.9}
                  >
                    <View style={[
                      styles.iconContainer,
                      isSelected && styles.iconContainerActive
                    ]}>
                      <Icon 
                        name={option.icon} 
                        size={32} 
                        color={isSelected ? COLORS.white : COLORS.gray500} 
                      />
                    </View>
                    <Text style={[
                      styles.genderLabel,
                      isSelected && styles.genderLabelActive
                    ]}>
                      {option.label}
                    </Text>
                    
                    {/* Checkmark Indicator for Active State */}
                    {isSelected && (
                      <View style={styles.checkmark}>
                        <Icon name="checkmark-circle" size={24} color={COLORS.primary} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <OnboardingProgressBar
              currentStep={ONBOARDING_STEPS.GENDER_SELECTION} // Step 4
              totalSteps={TOTAL_ONBOARDING_STEPS}
            />
          </View>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <Button
              onPress={handleContinue}
              loading={loading}
              disabled={!selectedGender}
            >
              Continue
            </Button>
          </View>
        </View>

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
  // Back Button - Matched exactly to DOB Screen
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
    marginBottom: SPACING['2xl'],
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

  // Options Styling
  optionsContainer: {
    gap: SPACING.md,
  },
  genderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray900,
    borderRadius: 16,
    padding: SPACING.md,
    height: 80, // Substantial tap area
    borderWidth: 1,
    borderColor: 'transparent',
  },
  genderCardActive: {
    backgroundColor: COLORS.gray900, // Keep background dark
    borderColor: COLORS.primary, // Pink border highlight
  },
  
  // Icon Styling
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  iconContainerActive: {
    backgroundColor: COLORS.primary, // Filled circle when active
  },

  // Text Styling
  genderLabel: {
    flex: 1,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.gray500,
  },
  genderLabelActive: {
    color: COLORS.white,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  // Checkmark
  checkmark: {
    marginLeft: SPACING.sm,
  },

  // Progress & Footer
  progressContainer: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  buttonContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
});

export default GenderSelectionScreen;