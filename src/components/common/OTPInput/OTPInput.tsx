import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, SIZES } from '@config/theme'; // Ensure these match your theme export
import { FONTS } from '../../../config/fonts'; // Adjust path if needed based on your structure

interface OTPInputProps {
  length?: number; // Defaults to 5 now
  onComplete: (code: string) => void;
  autoFocus?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
  length = 5, // <--- CHANGED FROM 6 TO 5 TO MATCH ENV.TEST_OTP
  onComplete,
  autoFocus = true,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const hasCompletedRef = useRef(false);

  // Auto-focus first input on mount
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [autoFocus]);

  // Check for completion
  useEffect(() => {
    const allFilled = otp.every(digit => digit !== '');
    if (allFilled && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      const otpString = otp.join('');
      onComplete(otpString);
    } else if (!allFilled) {
      hasCompletedRef.current = false;
    }
  }, [otp, length, onComplete]);

  // Handle Input Change
  const handleChange = (text: string, index: number) => {
    // 1. Handle Paste (e.g., user pastes "12345")
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

    // 2. Handle Single Digit
    if (/^\d$/.test(text) || text === '') {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Auto-focus next input if typing a digit
      if (text && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle Backspace
  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace') {
      // If current box is empty, delete previous box and focus it
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // Select all text on focus (iOS UX improvement)
  const handleFocus = (index: number) => {
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
        .map((_, index) => {
          const isFilled = !!otp[index];
          
          return (
            <View key={index} style={styles.inputWrapper}>
              {isFilled ? (
                // Active/Filled State (Gradient Border)
                <LinearGradient
                  colors={['#FF007B', '#6366F1', '#00B4D8']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.gradientBorder}
                >
                  <View style={styles.inputInner}>
                    <TextInput
                      ref={(ref) => { inputRefs.current[index] = ref; }}
                      style={styles.input}
                      value={otp[index]}
                      onChangeText={(text) => handleChange(text, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      onFocus={() => handleFocus(index)}
                      keyboardType="number-pad"
                      maxLength={1} // Prevent multiple digits in one box
                      selectTextOnFocus
                      textContentType="oneTimeCode"
                      autoComplete="sms-otp" // Android auto-fill
                      placeholderTextColor="#444"
                      // Important: Remove 'value' prop if using uncontrolled input logic, 
                      // but here controlled is fine since we handle paste logic.
                    />
                  </View>
                </LinearGradient>
              ) : (
                // Inactive/Empty State (Simple Border)
                <View style={styles.inputBorder}>
                  <TextInput
                    ref={(ref) => { inputRefs.current[index] = ref; }}
                    style={styles.input}
                    value={otp[index]}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    onFocus={() => handleFocus(index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    textContentType="oneTimeCode"
                    autoComplete="sms-otp"
                    placeholderTextColor="#444"
                  />
                </View>
              )}
            </View>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8, // Adjust gap if needed for smaller screens
    width: '100%',
  },
  inputWrapper: {
    flex: 1,
    height: 56, // Tall tap target
    maxWidth: 60, // Prevent them from getting too wide on tablets
  },
  gradientBorder: {
    flex: 1,
    borderRadius: 12, // SIZES.borderRadius.md
    padding: 2, // Thickness of the gradient border
  },
  inputBorder: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#202427',
  },
  inputInner: {
    flex: 1,
    borderRadius: 10, // Slightly less than outer to fit inside
    backgroundColor: '#202427', // Match background
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: '100%',
    fontSize: 24,
    fontFamily: FONTS.Bold, // Ensure FONTS.Bold is loaded
    color: '#fff',
    textAlign: 'center',
    padding: 0, // Remove default Android padding
  },
});

export default OTPInput;