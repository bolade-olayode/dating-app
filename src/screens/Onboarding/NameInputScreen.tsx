import React, { useState } from 'react';
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Icons, { IconsType } from '@components/ui/Icons';
import { FONTS } from '@config/fonts';
import { PrimaryButton } from '@components/ui/Buttons';
import Flare from '@components/ui/Flare';
import ProgressIndicator from '@components/ui/ProgressIndicator';
import { ONBOARDING_STEPS, TOTAL_ONBOARDING_STEPS } from '@config/onboardingFlow';

interface Props {
  navigation: any;
}

const NameInputScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');

  // Onboarding progress
  const CURRENT_STEP = ONBOARDING_STEPS.NAME_INPUT;
  const TOTAL_STEPS = TOTAL_ONBOARDING_STEPS;

  const handleContinue = () => {
    if (name.trim()) {
      navigation.navigate('DateOfBirthInput', { name: name.trim() });
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
        <View style={[styles.content, { paddingTop: insets.top + 50 }]}>
          <View style={styles.header}>
            <Text style={styles.title}>Whats your name?</Text>
            <Text style={styles.subtitle}>
              Set up your profile to customize and maximize your in-app experience.
            </Text>
          </View>

          <View style={styles.inputSection}>
            <LinearGradient
              colors={['#FF007B', '#00B4D8']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.gradientBorder}
            >
              <View style={styles.inputInner}>
                <TextInput
                  style={styles.input}
                  placeholder="Boladde"
                  placeholderTextColor="#444"
                  value={name}
                  onChangeText={setName}
                  autoFocus
                  autoCapitalize="words"
                  autoCorrect={false}
                />
                {name.length > 0 && (
                  <TouchableOpacity onPress={() => setName('')}>
                    <Icons
                      type={IconsType.Ionicons}
                      name="close-circle"
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </LinearGradient>
            <Text style={styles.helperText}>
              People will see this name if you interact with them and they dont have you
              as a mutual contact.
            </Text>
          </View>

          <View style={styles.progressWrapper}>
            <ProgressIndicator step={CURRENT_STEP} totalSteps={TOTAL_STEPS} />
          </View>

          <View style={[styles.footer, { marginBottom: insets.bottom + 20 }]}>
            <PrimaryButton
              variant={1}
              text="Continue"
              disabled={name.trim().length === 0}
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
  header: {
    marginBottom: 30,
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
  inputSection: {
    marginTop: 20,
  },
  gradientBorder: {
    padding: 1.5,
    borderRadius: 14,
  },
  inputInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D0D0D',
    borderRadius: 13,
    paddingHorizontal: 16,
    height: 60,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.H3,
    fontSize: 18,
    color: '#fff',
  },
  helperText: {
    fontFamily: FONTS.Body,
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    lineHeight: 20,
  },
  progressWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    alignItems: 'center',
  },
});

export default NameInputScreen;
