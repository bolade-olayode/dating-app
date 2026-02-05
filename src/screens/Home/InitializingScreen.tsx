// src/screens/Home/InitializingScreen.tsx

/**
 * INITIALIZING / SPLASH SCREEN
 * 
 * Shows 3 columns of animated user photos while app initializes.
 * Uses MarqueeColumn component for smooth scrolling animation.
 * Auto-navigates to Home screen after loading.
 * 
 * FEATURES:
 * - 3 animated vertical columns (same as SignupScreen)
 * - Each column scrolls continuously
 * - Gradient background overlay
 * - "Initializing..." text
 * - Auto-navigation after 3 seconds
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FONTS } from '@config/fonts';
import MarqueeColumn from '@components/common/AnimatedBackground/MarqueeColumn';

// Import the 3 vertical column images
const COLUMN_IMAGES = {
  column1: [require('@assets/images/initscreen1.png')],
  column2: [require('@assets/images/initscreen2.png')],
  column3: [require('@assets/images/initscreen3.png')],
};

const InitializingScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  useEffect(() => {
    // Auto-navigate after 3 seconds
    // TODO: Uncomment when HomeTabs is created
    // const timer = setTimeout(() => {
    //   navigation.replace('HomeTabs' as never);
    // }, 3000);

    // return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Gradient Background */}
      <LinearGradient
        colors={['#6B21A8', '#1E40AF', '#0E7490']} // Purple → Blue → Teal
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* 3 Animated Columns */}
      <View style={styles.columnsContainer}>
        {/* Column 1 - Scrolls Up */}
        <MarqueeColumn
          images={COLUMN_IMAGES.column1}
          direction="up"
          duration={30000}
          borderRadius={0}
          marginHorizontal={0}
          marginBottom={4}
          imageHeight={200}
        />

        {/* Column 2 - Scrolls Down */}
        <MarqueeColumn
          images={COLUMN_IMAGES.column2}
          direction="down"
          duration={30000}
          borderRadius={0}
          marginHorizontal={0}
          marginBottom={4}
          imageHeight={200}
        />

        {/* Column 3 - Scrolls Up */}
        <MarqueeColumn
          images={COLUMN_IMAGES.column3}
          direction="up"
          duration={30000}
          borderRadius={0}
          marginHorizontal={0}
          marginBottom={4}
          imageHeight={200}
        />
      </View>

      {/* Dark Overlay */}
      <View style={styles.overlay} />

      {/* Initializing Text */}
      <View style={styles.textContainer}>
        <Text style={styles.text}>Initializing...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  columnsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay for text readability
  },
  textContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    transform: [{ translateY: -20 }],
  },
  text: {
    fontFamily: FONTS.Medium,
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default InitializingScreen;