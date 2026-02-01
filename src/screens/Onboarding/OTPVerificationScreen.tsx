// src/screens/Onboarding/OTPVerificationScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, TYPOGRAPHY } from '@config/theme';

// Components
import OTPInput from '../../components/common/OTPInput/OTPInput';
import Button from '../../components/common/Button/Button';
import OnboardingProgressBar from '../../components/common/OnboardingProgressBar';

// Services
import { authService } from '../../services/api/authService';
import { devLog } from '@config/environment';

// Config
import { ONBOARDING_STEPS, TOTAL_ONBOARDING_STEPS } from '@config/onboardingFlow';

// Navigation
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/AppNavigator';

type OTPVerificationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Verification'
>;

interface Props {
  navigation: OTPVerificationScreenNavigationProp;
  route: {
    params?: {
      phoneNumber?: string;
      email?: string;
      expiresAt?: number;
    };
  };
}

// Helper to format time as M:SS
const formatExpiryTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const OTPVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expiryTime, setExpiryTime] = useState<number | null>(null); // Seconds until OTP expires

  // Get phone number or email from params
  const phoneNumber = route.params?.phoneNumber || '+234 812 345 6789';
  const email = route.params?.email;
  const expiresAt = route.params?.expiresAt;
  const isPhoneMode = !email;
  const contact = isPhoneMode ? phoneNumber : email;

  // Onboarding progress: Step 1 of 9
  const CURRENT_STEP = ONBOARDING_STEPS.OTP_VERIFICATION;
  const TOTAL_STEPS = TOTAL_ONBOARDING_STEPS;

  // Initialize expiry countdown from params
  useEffect(() => {
    if (expiresAt) {
      const secondsRemaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setExpiryTime(secondsRemaining);
    }
  }, [expiresAt]);

  // OTP Expiry countdown timer
  useEffect(() => {
    if (expiryTime === null || expiryTime <= 0) return;

    const interval = setInterval(() => {
      setExpiryTime((prev) => {
        if (prev === null || prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTime]);

  // Resend countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOTPComplete = (code: string) => {
    setOtp(code);
    // Auto-verify when all digits entered
    handleVerify(code);
  };

  const handleVerify = async (code: string = otp) => {
    if (code.length < 6) return;

    // Check if OTP has expired
    if (expiryTime !== null && expiryTime <= 0) {
      setError('OTP has expired. Please request a new one.');
      Alert.alert('Expired', 'OTP has expired. Please request a new one.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      devLog('Verifying OTP:', code, 'for:', contact);
      const result = await authService.verifyOTP(code, contact);

      if (result.success) {
        devLog('OTP Verified successfully!', result);
        // Replace navigation stack to prevent going back to OTP screen
        // OTP has been consumed and should not be revisitable
        navigation.replace('NameInput');
      } else {
        setError(result.message);
        Alert.alert('Verification Failed', result.message);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    devLog('Resending OTP to:', contact);

    try {
      const result = await authService.resendOTP(contact || '');

      if (result.success) {
        // Reset timers
        setTimer(59);
        setCanResend(false);
        setError('');

        // Update expiry countdown with new expiration time
        if (result.expiresAt) {
          const secondsRemaining = Math.max(0, Math.floor((result.expiresAt - Date.now()) / 1000));
          setExpiryTime(secondsRemaining);
        }

        Alert.alert('OTP Sent', 'A new OTP has been sent to your ' + (isPhoneMode ? 'phone' : 'email'));
      } else {
        Alert.alert('Failed', result.message);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  };

  const handleUseAnother = () => {
    navigation.goBack();
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
            <Text style={styles.title}>Verify your number</Text>
            <Text style={styles.subtitle}>
              We've just sent an OTP to verify your{' '}
              {isPhoneMode ? 'number' : 'email'}
            </Text>
            
            {/* Show phone number or email */}
            <Text style={styles.contact}>
              {isPhoneMode ? phoneNumber : email}
            </Text>
          </View>

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            <OTPInput onComplete={handleOTPComplete} autoFocus />
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}
          </View>

          {/* OTP Expiry Timer */}
          {expiryTime !== null && (
            <View style={styles.expiryContainer}>
              {expiryTime > 0 ? (
                <Text style={styles.expiryText}>
                  Code expires in {formatExpiryTime(expiryTime)}
                </Text>
              ) : (
                <Text style={styles.expiryExpiredText}>
                  Code has expired
                </Text>
              )}
            </View>
          )}

          {/* Timer and Resend */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't get it? </Text>
            {!canResend ? (
              <Text style={styles.timerText}>
                in 0:{timer < 10 ? `0${timer}` : timer}
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
                <Text style={styles.resendLink}>Resend</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Use Another Number/Email */}
          <TouchableOpacity
            style={styles.changeContactContainer}
            onPress={handleUseAnother}
            activeOpacity={0.7}
          >
            <Text style={styles.changeContactText}>
              Use another {isPhoneMode ? 'number' : 'email'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress Bar - just above button */}
        <View style={styles.progressContainer}>
          <OnboardingProgressBar currentStep={CURRENT_STEP} totalSteps={TOTAL_STEPS} />
        </View>

        {/* Verify Button (Optional - auto-verifies on complete) */}
        <View style={styles.buttonContainer}>
          <Button
            variant="primary"
            onPress={() => handleVerify()}
            loading={loading}
            disabled={otp.length < 6}
          >
            Verify
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
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.gray500,
    lineHeight: 24,
    marginBottom: SPACING.xs,
  },
  contact: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.white,
    marginTop: SPACING.xs,
  },

  // OTP Input
  otpContainer: {
    marginBottom: SPACING.xl,
  },
  errorText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },

  // Expiry Timer
  expiryContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  expiryText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.gray500,
  },
  expiryExpiredText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.error,
  },

  // Resend
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  resendText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.gray500,
  },
  timerText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.gray500,
  },
  resendLink: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.primary,
  },

  // Change Contact
  changeContactContainer: {
    alignItems: 'center',
  },
  changeContactText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.primary,
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

export default OTPVerificationScreen;