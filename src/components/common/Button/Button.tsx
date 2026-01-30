// src/components/common/Button/Button.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { styles } from './Button.styles';
import { useTheme } from '@context/ThemeContext';

export interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactElement;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}) => {
  const theme = useTheme();

  // Determine button container style
  const getButtonStyle = (): ViewStyle[] => {
    const baseStyles: ViewStyle[] = [
      styles.button,
      styles[`button_${size}`],
      styles[`button_${variant}`],
    ];

    if (fullWidth) {
      baseStyles.push(styles.buttonFullWidth);
    }

    if (disabled || loading) {
      baseStyles.push(styles.buttonDisabled);
    }

    if (style) {
      baseStyles.push(style);
    }

    return baseStyles;
  };

  // Determine text style
  const getTextStyle = (): TextStyle[] => {
    const baseStyles: TextStyle[] = [
      styles.text,
      styles[`text_${size}`],
      styles[`text_${variant}`],
    ];

    if (disabled) {
      baseStyles.push(styles.textDisabled);
    }

    if (textStyle) {
      baseStyles.push(textStyle);
    }

    return baseStyles;
  };

  // Get loading indicator color based on variant
  const getLoadingColor = (): string => {
    if (variant === 'outline' || variant === 'ghost') {
      return theme.colors.primary;
    }
    return theme.colors.white;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getLoadingColor()} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          
          <Text style={getTextStyle()}>{children}</Text>
          
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;