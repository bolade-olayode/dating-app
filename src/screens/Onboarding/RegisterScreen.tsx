import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRoute, RouteProp } from '@react-navigation/native';
// [PHONE_DISABLED] import axios from 'axios';
import * as Yup from 'yup';
import Icons, { IconsType } from '@components/ui/Icons';
import { FONTS } from '@config/fonts';
import { InputField } from '@components/ui/Inputs';
import { PrimaryButton } from '@components/ui/Buttons';
import Flare from '@components/ui/Flare';
// [PHONE_DISABLED] import CountryPickerModal from '@components/common/CountryPicker/CountryPickerModal';
// [PHONE_DISABLED] import { Country, COUNTRY_CODES } from '../../data/CountryCodes';
import { authService } from '@services/api/authService';
import { RootStackParamList } from '@navigation/AppNavigator';

const RegisterScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<RootStackParamList, 'Register'>>();
  const mode = route.params?.mode || 'login';

  // [PHONE_DISABLED] Login tab state removed — email only
  // const [activeTab, setActiveTab] = useState<'phone' | 'email'>('phone');
  const [value, setValue] = useState('');

  // Signup mode: email only
  // [PHONE_DISABLED] const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // [PHONE_DISABLED] const [country, setCountry] = useState<Country>(COUNTRY_CODES[0]);
  const [error, setError] = useState<string | null>(null);
  // [PHONE_DISABLED] const [isCountryPickerVisible, setIsCountryPickerVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // [PHONE_DISABLED] Country detection removed (no phone support)
  // useEffect(() => {
  //   const detectCountry = async () => {
  //     try {
  //       const response = await axios.get('https://ipwho.is/');
  //       const countryCode = response.data.country_code;
  //       const matchedCountry = COUNTRY_CODES.find((c) => c.code === countryCode);
  //       if (matchedCountry) { setCountry(matchedCountry); }
  //     } catch (err) { console.log('Error detecting country:', err); }
  //   };
  //   detectCountry();
  // }, []);

  // [PHONE_DISABLED] const phoneSchema = Yup.object().shape({
  //   phone: Yup.string().required('Phone number is required').min(7, 'Invalid phone number'),
  // });

  const emailSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email address is required')
      .email('Invalid email address'),
  });

  const handleContinue = async () => {
    setError(null);

    try {
      if (mode === 'signup') {
        // [PHONE_DISABLED] Signup: email only (phone removed)
        // await phoneSchema.validate({ phone });
        await emailSchema.validate({ email });

        // [PHONE_DISABLED] const fullPhone = `${country.dial_code}${phone}`;

        setLoading(true);
        const result = await authService.sendOTP(email, 'signup', {
          email,
          // [PHONE_DISABLED] phone: fullPhone,
        });
        setLoading(false);

        if (!result.success) {
          Alert.alert('Error', result.message);
          return;
        }

        navigation.navigate('Verification', {
          // [PHONE_DISABLED] phoneNumber: fullPhone,
          email,
          expiresAt: result.expiresAt,
          mode: 'signup',
        });
      } else {
        // [PHONE_DISABLED] Login: email only (phone tab removed)
        await emailSchema.validate({ email: value });

        setLoading(true);
        const result = await authService.sendOTP(value, 'login');
        setLoading(false);

        if (!result.success) {
          Alert.alert('Error', result.message);
          return;
        }

        navigation.navigate('Verification', {
          email: value,
          expiresAt: result.expiresAt,
          mode: 'login',
        });
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
    }
  };

  // ─── Signup Mode: Both fields stacked ──────────────────────

  const renderSignupFields = () => (
    <View style={styles.inputContainer}>
      {/* [PHONE_DISABLED] Phone Number field removed
      <Text style={styles.fieldLabel}>Phone Number</Text>
      <InputField
        placeholder="08123456789"
        keyboardType="phone-pad"
        countryCode={`${country.flag} ${country.dial_code}`}
        onCountryPress={() => setIsCountryPickerVisible(true)}
        value={phone}
        onChangeText={(text: string) => { setPhone(text); if (error) setError(null); }}
        autoFocus
      />
      <View style={{ height: 20 }} />
      */}

      <Text style={styles.fieldLabel}>Email Address</Text>
      <InputField
        placeholder="Enter your email"
        keyboardType="email-address"
        value={email}
        onChangeText={(text: string) => {
          setEmail(text);
          if (error) setError(null);
        }}
        autoFocus
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Text style={styles.helperText}>
        We'll send a verification code to confirm your identity.
      </Text>
    </View>
  );

  // ─── Login Mode: Email only ─────────────────────────────────
  // [PHONE_DISABLED] Phone tab removed

  const renderLoginFields = () => (
    <>
      {/* [PHONE_DISABLED] Phone/Email tab bar removed */}

      <View style={styles.inputContainer}>
        <InputField
          placeholder="Enter your email"
          keyboardType="email-address"
          value={value}
          onChangeText={(text: string) => {
            setValue(text);
            if (error) setError(null);
          }}
          error={error}
          autoFocus
        />

        <Text style={styles.helperText}>
          Your email address will be used to receive a verification code.
        </Text>
      </View>
    </>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <Flare />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[styles.content, { paddingTop: insets.top + 10 }]}>
          {/* Back Button */}
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

          {/* Title for signup mode */}
          {mode === 'signup' && (
            <Text style={styles.screenTitle}>Create your account</Text>
          )}

          {mode === 'signup' ? renderSignupFields() : renderLoginFields()}

          <View style={[styles.footer, { marginBottom: insets.bottom + 20 }]}>
            <PrimaryButton
              variant={1}
              text={loading ? '' : 'Continue'}
              onPress={handleContinue}
              disabled={loading}
            />
            {loading && (
              <ActivityIndicator
                size="small"
                color="#FFF"
                style={styles.loadingIndicator}
              />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* [PHONE_DISABLED] Country Picker Modal removed
      <CountryPickerModal
        visible={isCountryPickerVisible}
        onClose={() => setIsCountryPickerVisible(false)}
        onSelect={(selectedCountry) => setCountry(selectedCountry)}
      />
      */}
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
    marginBottom: 15,
  },
  screenTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 24,
    color: '#FFF',
    marginBottom: 24,
  },
  fieldLabel: {
    fontFamily: FONTS.Medium,
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
  tabText: {
    fontFamily: FONTS.H2,
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 2,
    backgroundColor: '#FF007B',
  },
  inputContainer: {
    marginTop: 0,
  },
  helperText: {
    fontFamily: FONTS.Body,
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginTop: 12,
  },
  errorText: {
    fontFamily: FONTS.Regular,
    fontSize: 13,
    color: '#FF3B30',
    marginTop: 8,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: 10,
  },
  loadingIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    top: 16,
  },
});

export default RegisterScreen;
