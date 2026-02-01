// src/screens/Onboarding/DateOfBirthScreen.tsx

/**
 * DATE OF BIRTH INPUT SCREEN
 * 
 * Users enter their date of birth to verify they're old enough (18+).
 * 
 * FEATURES:
 * - Platform-specific date picker (iOS wheel, Android calendar)
 * - Age validation (18-100 years)
 * - Privacy note (birth year hidden by default)
 * - Progress bar (Step 3 of 7 - 42%)
 * - Personalized greeting with user's name
 * 
 * VALIDATION RULES:
 * - Must be 18+ years old (dating app requirement)
 * - Must be under 100 years old (reasonable limit)
 * - Valid date format
 * 
 * DATA SAVED:
 * - Full date: YYYY-MM-DD (for backend)
 * - Display age: Calculated from DOB
 * - Privacy setting: Birth year hidden by default
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, SPACING, TYPOGRAPHY } from '@config/theme';

// Components
import Button from '../../components/common/Button/Button';
import OnboardingProgressBar from '../../components/common/OnboardingProgressBar';

// Config
import { ONBOARDING_STEPS, TOTAL_ONBOARDING_STEPS } from '@config/onboardingFlow';

// Navigation
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';

type DateOfBirthScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'DateOfBirthInput'
>;

type DateOfBirthScreenRouteProp = RouteProp<RootStackParamList, 'DateOfBirthInput'>;

interface Props {
  navigation: DateOfBirthScreenNavigationProp;
  route: DateOfBirthScreenRouteProp;
}

const DateOfBirthScreen: React.FC<Props> = ({ navigation, route }) => {
  // Get name from previous screen
  const userName = route.params?.name || 'there';

  // State
  const [date, setDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * CALCULATE AGE FROM DATE OF BIRTH
   * 
   * Returns age in years.
   * Used for validation (must be 18+)
   */
  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust if birthday hasn't occurred this year yet
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  /**
   * VALIDATE DATE OF BIRTH
   * 
   * Checks:
   * - User is at least 18 years old
   * - User is under 100 years old
   * - Date is not in the future
   */
  const validateDate = (selectedDate: Date): boolean => {
    const age = calculateAge(selectedDate);
    
    // Too young (under 18)
    if (age < 18) {
      Alert.alert(
        'Age Requirement',
        'You must be at least 18 years old to use MeetPie.',
        [{ text: 'OK' }]
      );
      return false;
    }
    
    // Unrealistic age (over 100)
    if (age > 100) {
      Alert.alert(
        'Invalid Date',
        'Please enter a valid date of birth.',
        [{ text: 'OK' }]
      );
      return false;
    }
    
    // Date in the future
    if (selectedDate > new Date()) {
      Alert.alert(
        'Invalid Date',
        'Date of birth cannot be in the future.',
        [{ text: 'OK' }]
      );
      return false;
    }
    
    return true;
  };

  /**
   * HANDLE DATE CHANGE
   * 
   * Called when user selects a date from picker.
   * Validates and saves the date.
   */
  const handleDateChange = (event: any, selectedDate?: Date) => {
    // Android: Close picker after selection
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (selectedDate) {
      if (validateDate(selectedDate)) {
        setDate(selectedDate);
      }
    }
  };

  /**
   * FORMAT DATE FOR DISPLAY
   * 
   * Converts Date object to readable format.
   * Example: January 15, 1995
   */
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  /**
   * CONTINUE TO NEXT SCREEN
   * 
   * Saves DOB and navigates to Gender Selection.
   */
  const handleContinue = () => {
    if (!date) {
      Alert.alert('Required', 'Please select your date of birth.');
      return;
    }

    setLoading(true);
    
    // TODO: Save to backend or local storage
    // Format: YYYY-MM-DD for backend
    const dobString = date.toISOString().split('T')[0];
    const age = calculateAge(date);
    
    console.log('DOB:', dobString, 'Age:', age);
    
    setTimeout(() => {
      setLoading(false);
      // Navigate to Gender Selection screen
      navigation.navigate('GenderSelection', {
        name: userName,
        dateOfBirth: dobString,
        age,
      });
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

        <View style={styles.container}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>
                Hi {userName}, Now tell us your date of birth?
              </Text>
              <Text style={styles.subtitle}>
                Your birth year is hidden by default, you can make it visible in 
                your profile settings.
              </Text>
            </View>

            {/* Date Picker Button */}
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowPicker(true)}
              activeOpacity={0.7}
            >
              <View style={styles.dateButtonContent}>
                <Icon 
                  name="calendar-outline" 
                  size={24} 
                  color={date ? COLORS.black : COLORS.gray500} 
                />
                <Text style={[
                  styles.dateButtonText,
                  !date && styles.dateButtonTextPlaceholder
                ]}>
                  {date ? formatDate(date) : 'Select your date of birth'}
                </Text>
              </View>
              <Icon name="chevron-forward" size={20} color={COLORS.gray500} />
            </TouchableOpacity>

            {/* Display Age (if date selected) */}
            {date && (
              <View style={styles.ageDisplay}>
                <Text style={styles.ageText}>
                  Age: {calculateAge(date)} years old
                </Text>
              </View>
            )}

            {/* Privacy Note */}
            <View style={styles.noteContainer}>
              <Icon name="lock-closed-outline" size={16} color={COLORS.gray500} />
              <Text style={styles.noteText}>
                Only your age will be visible to others. Your exact birth date 
                remains private.
              </Text>
            </View>
          </View>

          {/* Progress Bar - just above button */}
          <View style={styles.progressContainer}>
            <OnboardingProgressBar
              currentStep={ONBOARDING_STEPS.DATE_OF_BIRTH}
              totalSteps={TOTAL_ONBOARDING_STEPS}
            />
          </View>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <Button
              onPress={handleContinue}
              loading={loading}
              disabled={!date}
            >
              Continue
            </Button>
          </View>
        </View>

        {/* Date Picker Modal */}
        {showPicker && (
          <DateTimePicker
            value={date || new Date(2000, 0, 1)} // Default: Jan 1, 2000
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()} // Can't select future dates
            minimumDate={new Date(1924, 0, 1)} // 100 years ago
            textColor={COLORS.white} // iOS only
            // iOS: Show inline picker
            // Android: Shows native modal automatically
          />
        )}

        {/* iOS: Done button for date picker */}
        {showPicker && Platform.OS === 'ios' && (
          <View style={styles.pickerControls}>
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setShowPicker(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}
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
    lineHeight: 40,
  },
  subtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.gray500,
    lineHeight: 24,
  },

  // Date Button
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingHorizontal: SPACING.md,
    height: 56,
    marginBottom: SPACING.md,
  },
  dateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  dateButtonText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.black,
  },
  dateButtonTextPlaceholder: {
    color: COLORS.gray500,
  },

  // Age Display
  ageDisplay: {
    backgroundColor: COLORS.gray900,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  ageText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.white,
    textAlign: 'center',
  },

  // Privacy Note
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.gray900,
    borderRadius: 12,
  },
  noteText: {
    flex: 1,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.gray500,
    lineHeight: 20,
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

  // iOS Picker Controls
  pickerControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.gray900,
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray800,
  },
  doneButton: {
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },
  doneButtonText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.white,
  },
});

export default DateOfBirthScreen;