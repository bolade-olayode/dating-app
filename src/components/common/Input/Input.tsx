// src/components/common/Input/Input.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
  StyleProp,
  TextStyle,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { COLORS, SPACING, SIZES, TYPOGRAPHY } from '@config/theme';
import Icon from 'react-native-vector-icons/Ionicons';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  password?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  password = false,
  containerStyle,
  labelStyle,
  onFocus,
  onBlur,
  editable = true,
  style,
  placeholder,
  ...props
}) => {
  const theme = useTheme();
  
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getBorderColor = () => {
    if (error) return theme.colors.error;
    if (isFocused) return theme.colors.primary;
    return theme.colors.inputBorder;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          { borderColor: getBorderColor() },
          isFocused && styles.focused,
          error && styles.errorBorder,
          !editable && styles.disabled,
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <TextInput
          style={[styles.input, style]}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textDisabled}
          secureTextEntry={password && !isPasswordVisible}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={editable}
          cursorColor={theme.colors.primary}
          selectionColor={theme.colors.primaryLight}
          {...props}
        />

        {password && (
          <TouchableOpacity 
            onPress={togglePasswordVisibility} 
            style={styles.iconRight}
            activeOpacity={0.7}
          >
            <Icon
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={theme.colors.gray500}
            />
          </TouchableOpacity>
        )}

        {!password && rightIcon && (
          <View style={styles.iconRight}>{rightIcon}</View>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// INLINE STYLES
const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
    width: '100%',
  },

  label: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.gray800,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.xs,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: SIZES.borderRadius.md,
    backgroundColor: COLORS.inputBackground,
    borderColor: COLORS.inputBorder,
    height: 56,
    paddingHorizontal: SPACING.md,
  },

  input: {
    flex: 1,
    height: '100%',
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textPrimary,
    paddingVertical: 0,
    textAlignVertical: 'center',
  },

  focused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
  },

  errorBorder: {
    borderColor: COLORS.error,
  },

  disabled: {
    backgroundColor: COLORS.gray100,
    borderColor: COLORS.gray200,
    opacity: 0.7,
  },

  errorText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },

  iconLeft: {
    marginRight: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  
  iconRight: {
    marginLeft: SPACING.sm,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Input;