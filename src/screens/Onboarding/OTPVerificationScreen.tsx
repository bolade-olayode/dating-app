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
import { useUser, UserProfile } from '@context/UserContext';

const { width } = Dimensions.get('window');

interface Props {
  navigation: any;
  route: {
    params?: {
      phoneNumber?: string;
      email?: string;
      expiresAt?: number;
      mode?: 'login' | 'signup';
    };
  };
}

const OTPVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { login: loginUser } = useUser();

  // Get phone number or email from params
  const phoneNumber = route.params?.phoneNumber;
  const email = route.params?.email;
  const mode = route.params?.mode || 'login';
  const isPhoneMode = !!phoneNumber;
  const contact = isPhoneMode ? phoneNumber : email;
  const type = isPhoneMode ? 'phone' : 'email';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [timer, setTimer] = useState(30);
  const [focusedInput, setFocusedInput] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Parse "try again in X seconds" from a backend rate-limit message.
  const parseRateLimitSeconds = (msg: string): number | null => {
    const match = msg.match(/(\d+)\s*second/i);
    return match ? parseInt(match[1], 10) : null;
  };

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
      const pastedData = sanitized.slice(0, 6).split('');
      const newOtp = [...otp];
      pastedData.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char;
      });
      setOtp(newOtp);

      const nextIndex = Math.min(index + pastedData.length - 1, 5);
      if (nextIndex === 5 && pastedData.length >= 6) {
        Keyboard.dismiss();
      } else {
        inputRefs.current[Math.min(nextIndex + 1, 5)]?.focus();
      }
      return;
    }

    const char = text.charAt(text.length - 1);
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (char && index === 5) {
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
    if (otpCode.length < 6) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const verifyContact = (mode === 'signup' && email) ? email : contact;
      const extra = mode === 'signup' ? { email, phone: phoneNumber } : undefined;
      devLog('Verifying OTP:', otpCode, 'for:', verifyContact, 'mode:', mode, 'extra:', extra);
      const result = await authService.verifyOTP(otpCode, verifyContact, mode, extra);

      if (result.success) {
        devLog('OTP Verified successfully!', result);

        if (mode === 'login' || (mode === 'signup' && result.token)) {
          // For login OR for existing users going through signup (backend logs them in via OTP),
          // fetch their full profile and route to HomeTabs.
          if (result.token) {
            try {
              const meResult = await authService.getMe();
              devLog('getMe result:', meResult);
              if (meResult.success && meResult.profile) {
                const userProfile: UserProfile = {
                  id: meResult.profile.id || meResult.profile._id,
                  name: meResult.profile.name || meResult.profile.fullname || meResult.profile.username || '',
                  email: meResult.profile.email,
                  phoneNumber: meResult.profile.phone,
                  dateOfBirth: meResult.profile.dateOfBirth || meResult.profile.dob || '',
                  age: meResult.profile.age,
                  gender: meResult.profile.gender || '',
                  lookingFor: ({ male: 'Men', female: 'Women', both: 'Both' } as Record<string, string>)[meResult.profile.interestedIn] || meResult.profile.lookingFor || '',
                  relationshipGoal: meResult.profile.goal || meResult.profile.relationshipGoal || '',
                  interests: (meResult.profile.interests || []).map((i: any) => (typeof i === 'string' ? i : i.name || '')).filter(Boolean),
                  photos: meResult.profile.photos || [],
                  bio: meResult.profile.bio || '',
                  location: typeof meResult.profile.location === 'string'
                    ? meResult.profile.location
                    : meResult.profile.location?.city || meResult.profile.city || '',
                  verified: meResult.profile.verified || false,
                };
                await loginUser(result.token, userProfile);

                // If this was a signup attempt but the account is already complete
                // (has photos = finished onboarding), go straight to HomeTabs.
                const isComplete = (meResult.profile.photos?.length || 0) > 0;
                if (mode === 'signup' && !isComplete) {
                  devLog('New account — proceeding to onboarding');
                  navigation.replace('NameInput');
                  return;
                }
              }
            } catch (e) {
              devLog('getMe failed after verify:', e);
              if (mode === 'signup') {
                navigation.replace('NameInput');
                return;
              }
            }
          }
          navigation.reset({ index: 0, routes: [{ name: 'HomeTabs' }] });
        } else {
          // New signup — no token yet, proceed through onboarding
          navigation.replace('NameInput');
        }
      } else {
        // Show inline error instead of Alert
        const waitSecs = parseRateLimitSeconds(result.message);
        if (waitSecs) {
          setTimer(waitSecs);
          setErrorMessage(`Too many attempts. Try again in ${waitSecs}s.`);
        } else {
          setErrorMessage(result.message || 'Invalid OTP. Please try again.');
        }
      }
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    setErrorMessage(null);
    try {
      const result = await authService.resendOTP(contact || '');
      if (result.success) {
        setTimer(30);
      } else {
        const waitSecs = parseRateLimitSeconds(result.message);
        if (waitSecs) {
          setTimer(waitSecs);
          setErrorMessage(`Too many requests. Try again in ${waitSecs}s.`);
        } else {
          setErrorMessage(result.message || 'Failed to resend OTP.');
        }
      }
    } catch {
      setErrorMessage('Failed to resend OTP. Please try again.');
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

          {errorMessage && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}

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
    width: width / 8.5,
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
  errorText: {
    color: '#FF4D4D',
    fontSize: 13,
    fontFamily: FONTS.Body,
    textAlign: 'center',
    marginBottom: 12,
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
