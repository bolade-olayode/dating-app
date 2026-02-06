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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import * as Yup from 'yup';
import Icons, { IconsType } from '@components/ui/Icons';
import { FONTS } from '@config/fonts';
import { InputField } from '@components/ui/Inputs';
import { PrimaryButton } from '@components/ui/Buttons';
import Flare from '@components/ui/Flare';
import CountryPickerModal from '@components/common/CountryPicker/CountryPickerModal';
import { Country, COUNTRY_CODES } from '../../data/CountryCodes';

const RegisterScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('phone');
  const [value, setValue] = useState('');
  const [country, setCountry] = useState<Country>(COUNTRY_CODES[0]);
  const [error, setError] = useState<string | null>(null);
  const [isCountryPickerVisible, setIsCountryPickerVisible] = useState(false);

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await axios.get('https://ipwho.is/');
        const countryCode = response.data.country_code;
        const matchedCountry = COUNTRY_CODES.find((c) => c.code === countryCode);
        if (matchedCountry) {
          setCountry(matchedCountry);
        }
      } catch (err) {
        console.log('Error detecting country:', err);
      }
    };

    detectCountry();
  }, []);

  const phoneSchema = Yup.object().shape({
    phone: Yup.string()
      .required('Phone number is required')
      .min(7, 'Invalid phone number'),
  });

  const emailSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email address is required')
      .email('Invalid email address'),
  });

  const handleContinue = async () => {
    setError(null);
    try {
      if (activeTab === 'phone') {
        await phoneSchema.validate({ phone: value });
        navigation.navigate('Verification', {
          phoneNumber: `${country.dial_code} ${value}`,
        });
      } else {
        await emailSchema.validate({ email: value });
        navigation.navigate('Verification', {
          email: value,
        });
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

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

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => {
                setActiveTab('phone');
                setValue('');
                setError(null);
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'phone' && styles.activeTabText,
                ]}
              >
                Phone Number
              </Text>
              {activeTab === 'phone' && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => {
                setActiveTab('email');
                setValue('');
                setError(null);
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'email' && styles.activeTabText,
                ]}
              >
                Email
              </Text>
              {activeTab === 'email' && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          </View>

          {/* Input Section */}
          <View style={styles.inputContainer}>
            <InputField
              key={activeTab}
              placeholder={activeTab === 'phone' ? '08123456789' : 'Enter your email'}
              keyboardType={activeTab === 'phone' ? 'phone-pad' : 'email-address'}
              countryCode={activeTab === 'phone' ? `${country.flag} ${country.dial_code}` : undefined}
              onCountryPress={() => setIsCountryPickerVisible(true)}
              value={value}
              onChangeText={(text: string) => {
                setValue(text);
                if (error) setError(null);
              }}
              error={error}
              autoFocus
            />

            <Text style={styles.helperText}>
              {activeTab === 'phone'
                ? 'Your phone number will be used to receive a verification code, SMS fees may apply. Learn more.'
                : 'Your email address will be used to receive a verification code.'}
            </Text>
          </View>

          <View style={[styles.footer, { marginBottom: insets.bottom + 20 }]}>
            <PrimaryButton
              variant={1}
              text="Continue"
              onPress={handleContinue}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* Country Picker Modal */}
      <CountryPickerModal
        visible={isCountryPickerVisible}
        onClose={() => setIsCountryPickerVisible(false)}
        onSelect={(selectedCountry) => setCountry(selectedCountry)}
      />
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
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: 10,
  },
});

export default RegisterScreen;
