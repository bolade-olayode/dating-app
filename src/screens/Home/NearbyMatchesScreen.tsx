// src/screens/Home/NearbyMatchesScreen.tsx

/**
 * NEARBY MATCHES SCREEN
 *
 * Shows static map background with user location pins.
 * Displays proximity permission bottom sheet on mount.
 * Handles location and notification permission flow.
 *
 * FLOW:
 * 1. Screen loads with map background
 * 2. Bottom sheet appears after 500ms
 * 3. User clicks "Enable" → Request Location → Request Notifications
 * 4. Navigate to HomeTabs regardless of permission results
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';
import ProximityPermissionSheet from '@components/permissions/ProximityPermissionSheet';
import { usePermissions } from '@hooks/usePermissions';

const NearbyMatchesScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { requestLocation, requestNotifications, isLoading } = usePermissions();

  const [showSheet, setShowSheet] = useState(false);

  useEffect(() => {
    // Show bottom sheet after a brief delay to let map render
    const timer = setTimeout(() => {
      setShowSheet(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleEnablePress = async () => {
    try {
      // Request location permission first
      console.log('🔍 Requesting location permission...');
      const locationGranted = await requestLocation();
      console.log('📍 Location permission result:', locationGranted);

      // Request notifications permission (regardless of location result)
      console.log('🔔 Requesting notification permission...');
      const notificationGranted = await requestNotifications();
      console.log('🔔 Notification permission result:', notificationGranted);

      // Navigate to HomeTabs regardless of permission results
      console.log('✅ Permissions requested. Navigating to HomeTabs.');
      navigation.replace('HomeTabs');
    } catch (error) {
      console.error('❌ Error requesting permissions:', error);
    }
  };

  const handleSkipPress = () => {
    // User skipped permissions - navigate to HomeTabs anyway
    console.log('User skipped permissions. Navigating to HomeTabs.');
    navigation.replace('HomeTabs');
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleCancelPress = () => {
    // Navigate to HomeTabs or go back
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Static Map Background */}
      <ImageBackground
        source={require('@assets/images/mapimg.png')}
        style={styles.mapBackground}
        resizeMode="cover"
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Icon name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Nearby matches</Text>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelPress}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Proximity Permission Bottom Sheet */}
      <ProximityPermissionSheet
        visible={showSheet}
        onEnablePress={handleEnablePress}
        onSkipPress={handleSkipPress}
        isLoading={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  mapBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FONTS.H3,
    fontSize: 18,
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cancelText: {
    fontFamily: FONTS.Medium,
    fontSize: 16,
    color: '#FF007B',
  },
});

export default NearbyMatchesScreen;
