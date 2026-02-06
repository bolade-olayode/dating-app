// src/components/permissions/ProximityPermissionSheet.tsx

/**
 * PROXIMITY PERMISSION BOTTOM SHEET
 *
 * Shows permission request UI for location and notifications.
 * Appears as a bottom sheet with explanation and CTA button.
 *
 * FEATURES:
 * - Animated bottom sheet entrance
 * - Location radar icon
 * - Clear explanation text
 * - Primary CTA button
 * - Optional skip link
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';
import { PrimaryButton } from '@components/ui/Buttons';

const { width } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onEnablePress: () => void;
  onSkipPress?: () => void;
  isLoading?: boolean;
}

const ProximityPermissionSheet: React.FC<Props> = ({
  visible,
  onEnablePress,
  onSkipPress,
  isLoading = false,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.sheetContainer}>
        {/* Icon with gradient background */}
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={['#FF007B', '#FF4D94']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconGradient}
          >
            <Icon name="radio-outline" size={32} color="#FFF" />
          </LinearGradient>
        </View>

        {/* Title */}
        <Text style={styles.title}>Don't Miss a Connection</Text>

        {/* Description */}
        <Text style={styles.description}>
          To show you people in your immediate area, we need to send you
          occasional updates. It's how we keep the nearby in your discovery.
        </Text>

        {/* Enable Button */}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            text="Enable proximity alerts"
            variant={1}
            onPress={onEnablePress}
            disabled={isLoading}
          />
        </View>

        {/* Skip Link (Optional) */}
        {onSkipPress && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={onSkipPress}
            disabled={isLoading}
          >
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: 100, // Space for map above
  },
  sheetContainer: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: 'center',
    minHeight: 320,
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.H3,
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontFamily: FONTS.Body,
    fontSize: 15,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 16,
  },
  skipButton: {
    paddingVertical: 12,
  },
  skipText: {
    fontFamily: FONTS.Medium,
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },
});

export default ProximityPermissionSheet;
