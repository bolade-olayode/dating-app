import React, { useState } from 'react';
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
import CountryPickerModal from '../../components/common/CountryPicker/CountryPickerModal';
import { Country, COUNTRY_CODES } from '../../data/CountryCodes';

// Placeholder Images
const placeholderImages = [
  require('../../assets/images/opuehbckgdimg.jpg'), 
  require('../../assets/images/opuehbckgdimg.jpg'),
  require('../../assets/images/opuehbckgdimg.jpg'),
];

const { width, height } = Dimensions.get('window');

const SignupScreen: React.FC<any> = ({ navigation }) => {
  const [isPhoneMode, setIsPhoneMode] = useState(true);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRY_CODES[0]); // Default: Nigeria
  const [isCountryPickerVisible, setIsCountryPickerVisible] = useState(false);

  const handleContinue = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Verification');
    }, 1500);
  };

  // The Country Selector Component
  const CountrySelector = () => (
    <TouchableOpacity
      style={styles.countrySelector}
      onPress={() => setIsCountryPickerVisible(true)}
      activeOpacity={0.7}
    >
      <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
      <Text style={styles.countryText}>{selectedCountry.dial_code}</Text>
      <Icon name="chevron-down" size={14} color={COLORS.black} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      
      {/* --- 1. ANIMATED BACKGROUND (Top Half) --- */}
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
            {/* Dynamic Spacer: Pushes content down */}
            <View style={{ height: height * 0.35 }} /> 

            <View style={styles.headerContainer}>
              <Text style={styles.title}>Sign up for MeetPie</Text>
              <Text style={styles.subtitle}>
                Create a profile, follow your heart, and find meaningful Connections.
              </Text>
            </View>

            <View style={styles.formContainer}>
              {/* Tab Selector: Phone / Email */}
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[styles.tab, isPhoneMode && styles.tabActive]}
                  onPress={() => setIsPhoneMode(true)}
                  activeOpacity={0.7}
                >
                  <Icon
                    name="call-outline"
                    size={18}
                    color={isPhoneMode ? COLORS.white : COLORS.gray500}
                  />
                  <Text style={[styles.tabText, isPhoneMode && styles.tabTextActive]}>
                    Phone
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tab, !isPhoneMode && styles.tabActive]}
                  onPress={() => setIsPhoneMode(false)}
                  activeOpacity={0.7}
                >
                  <Icon
                    name="mail-outline"
                    size={18}
                    color={!isPhoneMode ? COLORS.white : COLORS.gray500}
                  />
                  <Text style={[styles.tabText, !isPhoneMode && styles.tabTextActive]}>
                    Email
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Input Field */}
              <View style={styles.inputWrapper}>
                {isPhoneMode ? (
                  <>
                    <CountrySelector />
                    <TextInput
                      style={styles.textInput}
                      placeholder="812 345 6789"
                      placeholderTextColor={COLORS.gray500}
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="number-pad"
                    />
                  </>
                ) : (
                  <>
                    <View style={styles.emailIconWrapper}>
                      <Icon name="mail-outline" size={20} color={COLORS.gray600} />
                    </View>
                    <TextInput
                      style={styles.textInput}
                      placeholder="bigboladde@yahoo.com"
                      placeholderTextColor={COLORS.gray500}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </>
                )}
              </View>

              <Button onPress={handleContinue} loading={loading} style={styles.continueButton}>
                Continue
              </Button>
            </View>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialContainer}>
              <Button
                variant="outline"
                icon={<Icon name="logo-facebook" size={20} color={COLORS.facebook} />}
                style={styles.socialButton}
                textStyle={styles.socialButtonText}
                onPress={() => {}}
              >
                Sign up with Facebook
              </Button>

              <Button
                variant="outline"
                icon={<Icon name="logo-google" size={20} color={COLORS.google} />}
                style={styles.socialButton}
                textStyle={styles.socialButtonText}
                onPress={() => {}}
              >
                Sign Up with Google
              </Button>
            </View>
            
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Country Picker Modal */}
      <CountryPickerModal
        visible={isCountryPickerVisible}
        onClose={() => setIsCountryPickerVisible(false)}
        onSelect={(country) => setSelectedCountry(country)}
      />
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
    height: height * 0.7,
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
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
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

  // Tab Selector
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray900,
    borderRadius: 12,
    padding: 4,
    marginBottom: SPACING.lg,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.gray500,
  },
  tabTextActive: {
    color: COLORS.white,
  },

  // Input Field
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    height: 56,
    paddingHorizontal: SPACING.md,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.black,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: SPACING.sm,
    borderRightWidth: 1,
    borderRightColor: COLORS.gray300,
    marginRight: SPACING.sm,
    height: 28,
    gap: 6,
  },
  countryFlag: {
    fontSize: 18,
  },
  countryText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.black,
  },
  emailIconWrapper: {
    paddingRight: SPACING.sm,
    borderRightWidth: 1,
    borderRightColor: COLORS.gray300,
    marginRight: SPACING.sm,
    height: 28,
    justifyContent: 'center',
  },

  // Continue Button
  continueButton: {
    marginTop: SPACING.lg,
  },

  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xl,
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
    gap: SPACING.md,
  },
  socialButton: {
    borderColor: COLORS.gray800,
    backgroundColor: COLORS.gray900,
  },
  socialButtonText: {
    color: COLORS.white,
  },
});

export default SignupScreen;