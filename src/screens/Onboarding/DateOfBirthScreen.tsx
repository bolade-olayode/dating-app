// src/screens/Onboarding/DateOfBirthScreen.tsx

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/Ionicons';

// Config
import { FONTS } from '../../config/fonts';
import { ONBOARDING_STEPS, TOTAL_ONBOARDING_STEPS } from '@config/onboardingFlow';

// Components
import Flare from '../../components/ui/Flare';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import { PrimaryButton } from '../../components/ui/Buttons';

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
  const insets = useSafeAreaInsets();
  
  // Get name from previous screen params
  const userName = route.params?.name || 'There';

  // State
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);

  // Refs for auto-focus
  const monthRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);

  // Onboarding progress
  const CURRENT_STEP = ONBOARDING_STEPS.DATE_OF_BIRTH;
  const TOTAL_STEPS = TOTAL_ONBOARDING_STEPS;

  // --- HANDLERS ---

  const handleDayChange = (text: string) => {
    const val = text.replace(/[^0-9]/g, '');
    setDay(val);
    if (val.length === 2) {
      monthRef.current?.focus();
    }
  };

  const handleMonthChange = (text: string) => {
    const val = text.replace(/[^0-9]/g, '');
    setMonth(val);
    if (val.length === 2) {
      yearRef.current?.focus();
    }
  };

  const handleYearChange = (text: string) => {
    const val = text.replace(/[^0-9]/g, '');
    setYear(val);
    if (val.length === 4) {
      Keyboard.dismiss();
    }
  };

  const calculateAge = () => {
    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);
    const today = new Date();
    let age = today.getFullYear() - y;
    const mDiff = today.getMonth() + 1 - m;
    if (mDiff < 0 || (mDiff === 0 && today.getDate() < d)) {
      age--;
    }
    return age;
  };

  const isDateValid = () => {
    if (day.length < 1 || month.length < 1 || year.length !== 4) return false;
    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);
    
    if (isNaN(d) || isNaN(m) || isNaN(y)) return false;
    if (d < 1 || d > 31) return false;
    if (m < 1 || m > 12) return false;
    if (y < 1920 || y > new Date().getFullYear()) return false;
    
    return true;
  };

  const handleContinue = () => {
    const age = calculateAge();

    // 1. Validate Age Limit
    if (age < 18) {
      Alert.alert(
        'Age Restricted',
        'You must be at least 18 years old to use this app.',
        [{ text: 'OK' }]
      );
      return;
    }

    // 2. Confirm Age
    Alert.alert(
      'Confirm Age',
      `You are ${age} years old. Is this correct?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
             // 3. Navigate
             setLoading(true);
             const dobString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
             
             // Simulate small delay for UX
             setTimeout(() => {
                setLoading(false);
                navigation.navigate('GenderSelection', {
                  name: userName,
                  dateOfBirth: dobString,
                  age: age,
                });
             }, 300);
          }
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <Flare />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
          
          {/* Back Button */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Icon name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Header Text */}
          <View style={styles.header}>
            <Text style={styles.title}>
              Hi <Text style={styles.highlightName}>{userName},</Text> Now tell us your date of birth?
            </Text>
          </View>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <View style={styles.dateRow}>
              
              {/* Day Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Day</Text>
                <TextInput
                  style={styles.input}
                  placeholder="DD"
                  placeholderTextColor="#333"
                  keyboardType="number-pad"
                  maxLength={2}
                  value={day}
                  onChangeText={handleDayChange}
                  autoFocus
                />
              </View>

              {/* Month Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Month</Text>
                <TextInput
                  ref={monthRef}
                  style={styles.input}
                  placeholder="MM"
                  placeholderTextColor="#333"
                  keyboardType="number-pad"
                  maxLength={2}
                  value={month}
                  onChangeText={handleMonthChange}
                />
              </View>

              {/* Year Input */}
              <View style={[styles.inputWrapper, { flex: 1.5 }]}>
                <Text style={styles.label}>Year</Text>
                <TextInput
                  ref={yearRef}
                  style={styles.input}
                  placeholder="YYYY"
                  placeholderTextColor="#333"
                  keyboardType="number-pad"
                  maxLength={4}
                  value={year}
                  onChangeText={handleYearChange}
                />
              </View>
            </View>

            <Text style={styles.helperText}>
              We only show your age to potential matches, not your full date of birth.
            </Text>
          </View>

          {/* Spacer & Progress Indicator */}
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ProgressIndicator step={CURRENT_STEP} totalSteps={TOTAL_STEPS} />
          </View>

          {/* Footer Button */}
          <View style={[styles.footer, { marginBottom: insets.bottom + 20 }]}>
            <PrimaryButton
              variant={1}
              text="Continue"
              disabled={!isDateValid() || loading}
              onPress={handleContinue}
            />
          </View>

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  topBar: {
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#202427',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontFamily: FONTS.H3,
    fontSize: 32,
    color: '#fff',
    lineHeight: 40,
  },
  highlightName: {
    color: '#666',
  },
  inputSection: {
    marginTop: 10,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#0D0D0D', // Dark background as per reference
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#222', // Subtle border
    padding: 12,
    height: 80,
    justifyContent: 'center',
  },
  label: {
    fontFamily: FONTS.Body,
    fontSize: 12,
    color: '#444',
    marginBottom: 4,
  },
  input: {
    fontFamily: FONTS.H3,
    fontSize: 20,
    color: '#fff',
    padding: 0,
  },
  helperText: {
    fontFamily: FONTS.Body,
    fontSize: 14,
    color: '#666',
    marginTop: 20,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
  },
});

export default DateOfBirthScreen;