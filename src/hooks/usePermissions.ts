// src/hooks/usePermissions.ts

/**
 * PERMISSIONS HOOK
 *
 * Manages location and notification permissions for the app.
 * Provides check and request functions for both permission types.
 *
 * USAGE:
 * const { locationStatus, notificationStatus, requestLocation, requestNotifications } = usePermissions();
 */

import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

interface UsePermissionsReturn {
  locationStatus: PermissionStatus;
  notificationStatus: PermissionStatus;
  requestLocation: () => Promise<boolean>;
  requestNotifications: () => Promise<boolean>;
  isLoading: boolean;
}

export const usePermissions = (): UsePermissionsReturn => {
  const [locationStatus, setLocationStatus] = useState<PermissionStatus>('undetermined');
  const [notificationStatus, setNotificationStatus] = useState<PermissionStatus>('undetermined');
  const [isLoading, setIsLoading] = useState(false);

  // Check initial permission statuses
  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      // Check location permission
      const locationResult = await Location.getForegroundPermissionsAsync();
      setLocationStatus(
        locationResult.granted ? 'granted' :
        locationResult.canAskAgain ? 'undetermined' : 'denied'
      );

      // Check notification permission
      const notificationResult = await Notifications.getPermissionsAsync();
      setNotificationStatus(
        notificationResult.granted ? 'granted' :
        notificationResult.canAskAgain ? 'undetermined' : 'denied'
      );
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  const requestLocation = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      const newStatus: PermissionStatus =
        status === 'granted' ? 'granted' : 'denied';

      setLocationStatus(newStatus);
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLocationStatus('denied');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const requestNotifications = async (): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Check current status first
      const currentStatus = await Notifications.getPermissionsAsync();
      console.log('🔔 Current notification status:', currentStatus);

      // Request permission
      const { status, canAskAgain } = await Notifications.requestPermissionsAsync();
      console.log('🔔 Notification request result:', { status, canAskAgain });

      const newStatus: PermissionStatus =
        status === 'granted' ? 'granted' : 'denied';

      setNotificationStatus(newStatus);
      return status === 'granted';
    } catch (error) {
      console.error('❌ Error requesting notification permission:', error);
      setNotificationStatus('denied');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    locationStatus,
    notificationStatus,
    requestLocation,
    requestNotifications,
    isLoading,
  };
};
