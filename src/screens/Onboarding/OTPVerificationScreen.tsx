import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Icons, { IconsType } from '@components/ui/Icons';
import { FONTS } from '@config/fonts';
import { PrimaryButton } from '@components/ui/Buttons';
import Flare from '@components/ui/Flare';
import ProgressIndicator from '@components/ui/ProgressIndicator';
import { ONBOARDING_STEPS, TOTAL_ONBOARDING_STEPS } from '@config/onboardingFlow';
import { authService } from '../../services/api/authService';
import { devLog } from '@config/environment';

const { width } = Dimensions.get('window');

interface Props {
  navigation: any;
  route: {
    params?: {
      phoneNumber?: string;
      email?: string;
      expiresAt?: number;
    };
  };
}

const OTPVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();

  // Get phone number or email from params
  const phoneNumber = route.params?.phoneNumber;
  const email = route.params?.email;
  const isPhoneMode = !!phoneNumber;
  const contact = isPhoneMode ? phoneNumber : email;
  const type = isPhoneMode ? 'phone' : 'email';

  const [otp, setOtp] = useState(['', '', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [timer, setTimer] = useState(30);
  const [focusedInput, setFocusedInput] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Onboarding progress
  const CURRENT_STEP = ONBOARDING_STEPS.OTP_VERIFICATION;
  const TOTAL_STEPS = TOTAL_ONBOARDING_STEPS;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (text: string, index: number) => {
    // Handle paste
    if (text.length > 1) {
      const sanitized = text.replace(/[^0-9]/g, '');
      const pastedData = sanitized.slice(0, 5).split('');
      const newOtp = [...otp];
      pastedData.forEach((char, i) => {
        if (index + i < 5) newOtp[index + i] = char;
      });
      setOtp(newOtp);

      const nextIndex = Math.min(index + pastedData.length - 1, 4);
      if (nextIndex === 4 && pastedData.length >= 5) {
        Keyboard.dismiss();
      } else {
        inputRefs.current[Math.min(nextIndex + 1, 4)]?.focus();
      }
      return;
    }

    const char = text.charAt(text.length - 1);
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);

    if (char && index < 4) {
      inputRefs.current[index + 1]?.focus();
    } else if (char && index === 4) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleContinue = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 5) return;

    setLoading(true);

    try {
      devLog('Verifying OTP:', otpCode, 'for:', contact);
      const result = await authService.verifyOTP(otpCode, contact);

      if (result.success) {
        devLog('OTP Verified successfully!', result);
        navigation.replace('NameInput');
      } else {
        Alert.alert('Verification Failed', result.message);
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    try {
      const result = await authService.resendOTP(contact || '');
      if (result.success) {
        setTimer(30);
        Alert.alert('OTP Sent', 'A new OTP has been sent to your ' + (isPhoneMode ? 'phone' : 'email'));
      } else {
        Alert.alert('Failed', result.message);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  };

  const isComplete = otp.every((d) => d !== '');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <Flare />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[styles.content, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Icons
              type={IconsType.Feather}
              name="chevron-left"
              size={24}
              color="#fff"
            />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>
              Verify your {type === 'email' ? 'Email' : 'phone'}
            </Text>
            <Text style={styles.subtitle}>
              We've just sent an OTP to verify your {type === 'email' ? 'email' : 'number'}{' '}
              {contact && <Text style={styles.valueText}>{contact}</Text>}
            </Text>
          </View>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                style={[
                  styles.otpInput,
                  {
                    borderColor:
                      otp[index] || focusedInput === index ? '#FF007B' : '#333',
                  },
                ]}
                textContentType="oneTimeCode"
                keyboardType="number-pad"
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => setFocusedInput(index)}
                onBlur={() => setFocusedInput(null)}
                selectionColor="#FF007B"
                placeholderTextColor="#444"
                autoFocus={index === 0}
                maxLength={1}
              />
            ))}
          </View>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Didn't get it?{' '}
              <Text
                style={[styles.resendAction, timer > 0 && styles.disabledResend]}
                onPress={handleResend}
              >
                Resend
              </Text>
              {timer > 0 && ` in 0:${timer < 10 ? `0${timer}` : timer}`}
            </Text>
          </View>

          <View style={styles.progressWrapper}>
            <ProgressIndicator step={CURRENT_STEP} totalSteps={TOTAL_STEPS} />
          </View>

          <View style={[styles.footer, { marginBottom: insets.bottom + 20 }]}>
            <PrimaryButton
              variant={1}
              text="Continue"
              disabled={!isComplete || loading}
              onPress={handleContinue}
            />
            <TouchableOpacity
              style={styles.anotherMethod}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Text style={styles.anotherMethodText}>
                Use another {type === 'email' ? 'email' : 'number'}
              </Text>
            </TouchableOpacity>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#202427',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontFamily: FONTS.H3,
    fontSize: 32,
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FONTS.Body,
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  valueText: {
    fontFamily: FONTS.H2,
    fontSize: 15,
    color: '#fff',
    marginTop: 4,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpInput: {
    width: width / 7,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333',
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    fontFamily: FONTS.H2,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resendText: {
    fontFamily: FONTS.Body,
    fontSize: 14,
    color: '#666',
  },
  resendAction: {
    color: '#FF007B',
    fontFamily: FONTS.SemiBold,
  },
  disabledResend: {
    color: '#444',
  },
  progressWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    alignItems: 'center',
  },
  anotherMethod: {
    marginTop: 20,
    padding: 10,
  },
  anotherMethodText: {
    fontFamily: FONTS.Body,
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});

export default OTPVerificationScreen;
