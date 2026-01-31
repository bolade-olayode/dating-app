import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, TYPOGRAPHY } from '@config/theme';
import { LinearGradient } from 'expo-linear-gradient';

// Components
import Button from '../../components/common/Button/Button';
import MarqueeColumn from '../../components/common/AnimatedBackground/MarqueeColumn';

// Validation
import { isValidEmail, isValidPassword, ValidationErrors } from '../../utils/validation';

// Placeholder Images
const placeholderImages = [
  require('../../assets/images/opuehbckgdimg.jpg'),
  require('../../assets/images/opuehbckgdimg.jpg'),
  require('../../assets/images/opuehbckgdimg.jpg'),
];

const { height } = Dimensions.get('window');

const LoginScreen: React.FC<any> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });

  // Validate email
  const validateEmail = useCallback((value: string): boolean => {
    if (!value.trim()) {
      setEmailError(ValidationErrors.EMAIL_REQUIRED);
      return false;
    }
    if (!isValidEmail(value)) {
      setEmailError(ValidationErrors.EMAIL_INVALID);
      return false;
    }
    setEmailError('');
    return true;
  }, []);

  // Validate password
  const validatePassword = useCallback((value: string): boolean => {
    if (!value) {
      setPasswordError(ValidationErrors.PASSWORD_REQUIRED);
      return false;
    }
    if (!isValidPassword(value)) {
      setPasswordError(ValidationErrors.PASSWORD_TOO_SHORT);
      return false;
    }
    setPasswordError('');
    return true;
  }, []);

  // Handle input changes
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (touched.email) {
      validateEmail(value);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (touched.password) {
      validatePassword(value);
    }
  };

  // Handle blur events
  const handleEmailBlur = () => {
    setTouched(prev => ({ ...prev, email: true }));
    validateEmail(email);
  };

  const handlePasswordBlur = () => {
    setTouched(prev => ({ ...prev, password: true }));
    validatePassword(password);
  };

  // Check if form is valid
  const isFormValid =
    email.trim() &&
    password &&
    !emailError &&
    !passwordError &&
    isValidEmail(email) &&
    isValidPassword(password);

  const handleLogin = () => {
    // Final validation before submit
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      setTouched({ email: true, password: true });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Login Successful! (Navigating to Home...)');
      // navigation.navigate('Home');
    }, 1500);
  };

  return (
    <View style={styles.mainContainer}>
      {/* --- 1. ANIMATED BACKGROUND --- */}
      <View style={styles.backgroundLayer}>
        <MarqueeColumn images={placeholderImages} direction="up" duration={40000} />
        <MarqueeColumn images={placeholderImages} direction="down" duration={35000} />
        <MarqueeColumn images={placeholderImages} direction="up" duration={45000} />
      </View>

      {/* --- 2. DARK GRADIENT MASK --- */}
      <LinearGradient
        colors={[
          'transparent',
          COLORS.overlayDark,
          COLORS.black,
          COLORS.black,
        ]}
        locations={[0, 0.4, 0.6, 1]}
        style={styles.gradientLayer}
      />

      {/* --- 3. CONTENT AREA --- */}
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
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Log in to continue finding your meaningful connections.
              </Text>
            </View>

            <View style={styles.formContainer}>
              {/* Email Input */}
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={[
                styles.inputWrapper,
                touched.email && emailError ? styles.inputError : null,
              ]}>
                <View style={styles.iconWrapper}>
                  <Icon name="mail-outline" size={20} color={COLORS.gray600} />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="bigboladde@yahoo.com"
                  placeholderTextColor={COLORS.gray500}
                  value={email}
                  onChangeText={handleEmailChange}
                  onBlur={handleEmailBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {touched.email && emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}

              {/* Password Input */}
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[
                styles.inputWrapper,
                touched.password && passwordError ? styles.inputError : null,
              ]}>
                <View style={styles.iconWrapper}>
                  <Icon name="lock-closed-outline" size={20} color={COLORS.gray600} />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.gray500}
                  value={password}
                  onChangeText={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  activeOpacity={0.7}
                >
                  <Icon
                    name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={COLORS.gray600}
                  />
                </TouchableOpacity>
              </View>
              {touched.password && passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}

              {/* Forgot Password Link */}
              <TouchableOpacity
                style={styles.forgotPasswordContainer}
                onPress={() => alert('Navigate to Forgot Password')}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <Button
                onPress={handleLogin}
                loading={loading}
                disabled={!isFormValid}
                style={styles.loginButton}
              >
                Log In
              </Button>
            </View>

            {/* Social Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or log in with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialContainer}>
              <Button
                variant="outline"
                icon={<Icon name="logo-facebook" size={20} color={COLORS.facebook} />}
                style={styles.socialButton}
                textStyle={styles.socialButtonText}
                onPress={() => {}}
              >
                Log in with Facebook
              </Button>

              <Button
                variant="outline"
                icon={<Icon name="logo-google" size={20} color={COLORS.google} />}
                style={styles.socialButton}
                textStyle={styles.socialButtonText}
                onPress={() => {}}
              >
                Log in with Google
              </Button>
            </View>
          </ScrollView>
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
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'center',
    height: height * 0.5,
  },
  gradientLayer: {
    ...StyleSheet.absoluteFillObject,
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    justifyContent: 'flex-end',
  },

  // Header
  headerContainer: {
    marginBottom: SPACING.md,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 32,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.gray500,
    lineHeight: 24,
  },

  // Form
  formContainer: {
    marginTop: SPACING.sm,
  },

  // Input Label
  inputLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.gray500,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.xs,
  },

  // Input Field
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    height: 52,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xs,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.error,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  iconWrapper: {
    paddingRight: SPACING.sm,
    borderRightWidth: 1,
    borderRightColor: COLORS.gray300,
    marginRight: SPACING.sm,
    height: 28,
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.black,
  },
  eyeButton: {
    padding: SPACING.xs,
  },

  // Forgot Password
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.sm,
  },
  forgotPasswordText: {
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },

  // Login Button
  loginButton: {
    marginTop: SPACING.sm,
  },

  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray800,
  },
  dividerText: {
    paddingHorizontal: SPACING.md,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.gray600,
  },

  // Socials
  socialContainer: {
    gap: SPACING.sm,
  },
  socialButton: {
    borderColor: COLORS.gray800,
    backgroundColor: COLORS.gray900,
  },
  socialButtonText: {
    color: COLORS.white,
  },
});

export default LoginScreen;
