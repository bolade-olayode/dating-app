// src/components/common/OTPInput/OTPInput.tsx
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Platform,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, SIZES } from '@config/theme';

interface OTPInputProps {
  length?: number;
  onComplete: (code: string) => void;
  autoFocus?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  onComplete,
  autoFocus = true,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const hasCompletedRef = useRef(false); // Track if we've already called onComplete

  useEffect(() => {
    // Auto-focus first input on mount
    if (autoFocus && inputRefs.current[0]) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [autoFocus]);

  useEffect(() => {
    // Check if OTP is complete (all boxes filled)
    const allFilled = otp.every(digit => digit !== '');

    if (allFilled && !hasCompletedRef.current) {
      // Only call onComplete once
      hasCompletedRef.current = true;
      const otpString = otp.join('');
      onComplete(otpString);
    } else if (!allFilled) {
      // Reset the flag if user clears any digit
      hasCompletedRef.current = false;
    }
  }, [otp, length, onComplete]);

  const handleChange = (text: string, index: number) => {
    // Handle paste
    if (text.length > 1) {
      const pastedCode = text.slice(0, length).split('');
      const newOtp = [...otp];
      pastedCode.forEach((char, i) => {
        if (index + i < length && /^\d$/.test(char)) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      
      // Focus last filled input or next empty
      const nextIndex = Math.min(index + pastedCode.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    // Handle single digit input
    if (/^\d$/.test(text) || text === '') {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Auto-focus next input
      if (text && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current box is empty, go back and clear previous
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleFocus = (index: number) => {
    // Select all text on focus for easy replacement
    if (Platform.OS === 'ios') {
      inputRefs.current[index]?.setNativeProps({
        selection: { start: 0, end: 1 },
      });
    }
  };

  return (
    <View style={styles.container}>
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[
              styles.input,
              otp[index] && styles.inputFilled,
            ]}
            value={otp[index]}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => handleFocus(index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            textContentType="oneTimeCode" // iOS autofill
            autoComplete="sms-otp" // Android autofill
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    height: 56,
    borderWidth: 1.5,
    borderColor: COLORS.gray300,
    borderRadius: SIZES.borderRadius.md,
    backgroundColor: COLORS.white,
    fontSize: 24,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.black,
    textAlign: 'center',
  },
  inputFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
});

export default OTPInput;