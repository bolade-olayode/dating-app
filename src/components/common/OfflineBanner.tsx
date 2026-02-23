// src/components/common/OfflineBanner.tsx
// Shows a persistent banner at the top when the device has no internet connection.

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(-40)).current;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline = !state.isConnected || state.isInternetReachable === false;
      setIsOffline(offline);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOffline ? 0 : -40,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOffline]);

  return (
    <Animated.View
      style={[styles.banner, { transform: [{ translateY: slideAnim }] }]}
      pointerEvents="none"
    >
      <Text style={styles.text}>No internet connection</Text>
    </Animated.View>
  );
};

export default OfflineBanner;

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    backgroundColor: '#333',
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
