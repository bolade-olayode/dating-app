// src/screens/ButtonTestScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Button from '@components/common/Button';
import { useTheme } from '@context/ThemeContext';

const ButtonTestScreen: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const handlePress = () => {
    console.log('Button pressed!');
  };

  const handleLoadingPress = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Button Component Test</Text>
        <Text style={styles.subtitle}>All variants from Figma design</Text>

        {/* Primary Button (Pressed State - Pink) */}
        <View style={styles.section}>
          <Text style={styles.label}>Primary (Pressed State - Pink)</Text>
          <Button onPress={handlePress}>Pressed State</Button>
        </View>

        {/* Secondary Button (Primary 2 - Dark) */}
        <View style={styles.section}>
          <Text style={styles.label}>Secondary (Primary 2 - Dark)</Text>
          <Button variant="secondary" onPress={handlePress}>
            Primary 2
          </Button>
        </View>

        {/* Disabled/Inactive Button */}
        <View style={styles.section}>
          <Text style={styles.label}>Disabled (Static/Inactive)</Text>
          <Button disabled onPress={handlePress}>
            Static/inactive
          </Button>
        </View>

        {/* Outline Button */}
        <View style={styles.section}>
          <Text style={styles.label}>Outline Variant</Text>
          <Button variant="outline" onPress={handlePress}>
            Outline Button
          </Button>
        </View>

        {/* Loading State */}
        <View style={styles.section}>
          <Text style={styles.label}>Loading State</Text>
          <Button loading={loading} onPress={handleLoadingPress}>
            {loading ? 'Loading...' : 'Click to Load'}
          </Button>
        </View>

        {/* Different Sizes */}
        <View style={styles.section}>
          <Text style={styles.label}>Button Sizes</Text>
          <View style={styles.buttonGroup}>
            <Button size="sm" onPress={handlePress}>
              Small
            </Button>
            <Button size="md" onPress={handlePress}>
              Medium
            </Button>
            <Button size="lg" onPress={handlePress}>
              Large
            </Button>
          </View>
        </View>

        {/* Full Width */}
        <View style={styles.section}>
          <Text style={styles.label}>Full Width Button</Text>
          <Button fullWidth onPress={handlePress}>
            Get Started
          </Button>
        </View>

        {/* All Variants */}
        <View style={styles.section}>
          <Text style={styles.label}>All Variants</Text>
          <View style={styles.buttonList}>
            <Button onPress={handlePress}>Primary</Button>
            <Button variant="secondary" onPress={handlePress}>
              Secondary
            </Button>
            <Button variant="outline" onPress={handlePress}>
              Outline
            </Button>
            <Button variant="ghost" onPress={handlePress}>
              Ghost
            </Button>
            <Button variant="danger" onPress={handlePress}>
              Danger
            </Button>
            <Button disabled onPress={handlePress}>
              Disabled
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  buttonList: {
    gap: 12,
  },
});

export default ButtonTestScreen;