// src/screens/Home/ExploreScreen.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS } from '@config/fonts';

const ExploreScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.subtitle}>Coming Soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: FONTS.H1,
    fontSize: 32,
    color: '#FFF',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: FONTS.Body,
    fontSize: 16,
    color: '#666',
  },
});

export default ExploreScreen;
