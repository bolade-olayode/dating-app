// src/screens/Home/WalletScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';
import Flare from '@components/ui/Flare';
import CoinBalance from '@components/ui/CoinBalance';

// Premium token packages with placeholder costs
const TOKEN_PACKAGES = [
  {
    id: 1,
    name: 'Super like',
    description: 'Stand out with a super like',
    icon: 'heart-outline',
    cost: 5,
  },
  {
    id: 2,
    name: 'Profile boost',
    description: '30min profile visibility boost',
    icon: 'person-outline',
    cost: 20,
  },
  {
    id: 3,
    name: 'See who likes you',
    description: 'View your admirers',
    icon: 'star-outline',
    cost: 15,
  },
  {
    id: 4,
    name: 'Priority messages',
    description: 'Your message appears first',
    icon: 'sparkles-outline',
    cost: 10,
  },
  {
    id: 5,
    name: 'Super comment',
    description: 'Your comments get the most visibility',
    icon: 'chatbubble-outline',
    cost: 8,
  },
];

// What you can do items
const FEATURES = [
  { id: 1, title: 'Unlimited swipes', description: 'Swipe without limits', icon: 'infinite-outline' },
  { id: 2, title: 'Undo last swipe', description: 'Take back accidental passes', icon: 'arrow-undo-outline' },
  { id: 3, title: 'Verified badge', description: 'Get a blue checkmark', icon: 'checkmark-circle-outline' },
];

const WalletScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [balance] = useState(20000); // Mock balance - placeholder

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <StatusBar barStyle="light-content" />
      <Flare />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wallet</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Balance Banner */}
        <CoinBalance
          balance={balance}
          variant="banner"
          onBuyPress={() => navigation.navigate('TopUp')}
        />

        {/* Token Packages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Token packages</Text>

          {TOKEN_PACKAGES.map((pkg) => (
            <TouchableOpacity
              key={pkg.id}
              style={styles.packageRow}
              activeOpacity={0.7}
            >
              <View style={styles.packageIconContainer}>
                <Icon name={pkg.icon} size={20} color="#FF007B" />
              </View>

              <View style={styles.packageInfo}>
                <Text style={styles.packageName}>{pkg.name}</Text>
                <Text style={styles.packageDescription}>{pkg.description}</Text>
              </View>

              <View style={styles.packageCostContainer}>
                <Icon name="heart" size={14} color="#FF007B" />
                <Text style={styles.packageCost}>{pkg.cost}</Text>
              </View>

              <Icon name="chevron-forward" size={18} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        {/* What you can do */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What you can do</Text>

          {FEATURES.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={styles.packageRow}
              activeOpacity={0.7}
            >
              <View style={styles.packageIconContainer}>
                <Icon name={feature.icon} size={20} color="#FF007B" />
              </View>

              <View style={styles.packageInfo}>
                <Text style={styles.packageName}>{feature.title}</Text>
                <Text style={styles.packageDescription}>{feature.description}</Text>
              </View>

              <Icon name="chevron-forward" size={18} color="#666" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  // Header
  header: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 28,
    color: '#FFF',
  },
  scrollContent: {
    paddingBottom: 140,
  },
  // Sections
  section: {
    marginTop: 28,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: FONTS.H2,
    fontSize: 18,
    color: '#FFF',
    marginBottom: 16,
  },
  // Package rows
  packageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  packageIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  packageInfo: {
    flex: 1,
  },
  packageName: {
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
    color: '#FFF',
    marginBottom: 3,
  },
  packageDescription: {
    fontFamily: FONTS.Regular,
    fontSize: 12,
    color: '#888',
  },
  packageCostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 8,
  },
  packageCost: {
    fontFamily: FONTS.SemiBold,
    fontSize: 14,
    color: '#FF007B',
  },
});

export default WalletScreen;
