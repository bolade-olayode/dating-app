/**
 * LOOKING FOR SCREEN
 * * Step 5 of Onboarding.
 * Users select their dating preference.
 * * FEATURES:
 * - Options: Men, Women, Everyone (Both)
 * - Card-based selection
 * - Passes accumulated data to next screen (RelationshipGoals)
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
import { LOOKING_FOR_OPTIONS } from '../../utils/constant';

// Navigation
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';

type LookingForScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LookingFor'
>;

type LookingForScreenRouteProp = RouteProp<RootStackParamList, 'LookingFor'>;

interface Props {
  navigation: LookingForScreenNavigationProp;
  route: LookingForScreenRouteProp;
}

const LookingForScreen: React.FC<Props> = ({ navigation, route }) => {
  // Get data from previous screens
  const { name, dateOfBirth, age, gender } = route.params || {};

  // State
  const [preference, setPreference] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    if (!preference) {
      Alert.alert('Required', 'Please tell us who you are looking for.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      
      console.log('User Profile Data:', { 
        name, 
        dateOfBirth, 
        age, 
        gender, 
        lookingFor: preference 
      });

      // Navigate to Relationship Goals (Next Step)
      navigation.navigate('RelationshipGoals', {
        name,
        dateOfBirth,
        age,
        gender,
        lookingFor: preference,
      });
    }, 500);
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

        <View style={styles.container}>
          <View style={styles.content}>
            
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>
                Who do you want to date?
              </Text>
              <Text style={styles.subtitle}>
                We'll show you people based on this preference.
                You can always change this later in settings.
              </Text>
            </View>

            {/* Preference Cards */}
            <View style={styles.optionsContainer}>
              {LOOKING_FOR_OPTIONS.map((option) => {
                const isSelected = preference === option.id;
                
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionCard,
                      isSelected && styles.optionCardActive
                    ]}
                    onPress={() => setPreference(option.id)}
                    activeOpacity={0.9}
                  >
                    <View style={[
                      styles.iconContainer,
                      isSelected && styles.iconContainerActive
                    ]}>
                      <Icon 
                        name={option.icon} 
                        size={28} 
                        color={isSelected ? COLORS.white : COLORS.gray500} 
                      />
                    </View>
                    
                    <Text style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelActive
                    ]}>
                      {option.label}
                    </Text>
                    
                    {/* Checkmark */}
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

          {/* Progress Bar (Step 5) */}
          <View style={styles.progressContainer}>
            <OnboardingProgressBar
              currentStep={ONBOARDING_STEPS.LOOKING_FOR}
              totalSteps={TOTAL_ONBOARDING_STEPS}
            />
          </View>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <Button
              onPress={handleContinue}
              loading={loading}
              disabled={!preference}
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
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray900,
    borderRadius: 16,
    padding: SPACING.md,
    height: 72,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionCardActive: {
    borderColor: COLORS.primary,
  },
  
  // Icon Styling
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  iconContainerActive: {
    backgroundColor: COLORS.primary,
  },

  // Text Styling
  optionLabel: {
    flex: 1,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.gray500,
  },
  optionLabelActive: {
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

export default LookingForScreen;