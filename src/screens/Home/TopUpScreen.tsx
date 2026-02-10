// src/screens/Home/TopUpScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';
import Flare from '@components/ui/Flare';
import { useUser } from '@context/UserContext';

const TOKEN_PACKAGES = [
  { id: 1, tokens: 100, price: '₦999', popular: false },
  { id: 2, tokens: 500, price: '₦1,999', popular: false },
  { id: 3, tokens: 1500, price: '₦4,999', popular: true },
  { id: 4, tokens: 5000, price: '₦12,999', popular: false },
  { id: 5, tokens: 15000, price: '₦24,999', popular: false },
  { id: 6, tokens: 50000, price: '₦49,999', popular: false },
];

const TopUpScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { addCoins } = useUser();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(3); // Default to popular

  const formatTokens = (num: number) => num.toLocaleString();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <StatusBar barStyle="light-content" />
      <Flare />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Icon name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buy Tokens</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Icon name="heart" size={40} color="#FF007B" />
          <Text style={styles.heroTitle}>Get More Tokens</Text>
          <Text style={styles.heroSubtitle}>
            Unlock premium swipes, comments, and more
          </Text>
        </View>

        {/* Token Packages */}
        <View style={styles.packagesGrid}>
          {TOKEN_PACKAGES.map((pkg) => (
            <TouchableOpacity
              key={pkg.id}
              activeOpacity={0.8}
              onPress={() => setSelectedPackage(pkg.id)}
              style={[
                styles.packageCard,
                selectedPackage === pkg.id && styles.selectedPackage,
              ]}
            >
              {pkg.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>BEST VALUE</Text>
                </View>
              )}

              <Text style={styles.packageTokens}>
                {formatTokens(pkg.tokens)}
              </Text>
              <Text style={styles.packageTokenLabel}>tokens</Text>
              <Text style={styles.packagePrice}>{pkg.price}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Icon name="shield-checkmark-outline" size={18} color="#00FF7F" />
            <Text style={styles.infoText}>Secure payment processing</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="refresh-outline" size={18} color="#00B4D8" />
            <Text style={styles.infoText}>Tokens never expire</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="flash-outline" size={18} color="#FFD700" />
            <Text style={styles.infoText}>Instant delivery to your wallet</Text>
          </View>
        </View>
      </ScrollView>

      {/* Purchase Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            const pkg = TOKEN_PACKAGES.find((p) => p.id === selectedPackage);
            if (pkg) {
              // TODO: Integrate payment gateway before adding coins
              addCoins(pkg.tokens);
              console.log(`Purchased ${pkg.tokens} tokens for ${pkg.price}`);
              navigation.goBack();
            }
          }}
        >
          <LinearGradient
            colors={['#FF007B', '#FF4458']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.purchaseButton}
          >
            <Text style={styles.purchaseButtonText}>
              {selectedPackage
                ? `Purchase for ${TOKEN_PACKAGES.find((p) => p.id === selectedPackage)?.price}`
                : 'Select a package'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#202427',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FONTS.H2,
    fontSize: 20,
    color: '#FFF',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  // Hero
  heroSection: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 8,
  },
  heroTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 26,
    color: '#FFF',
    marginTop: 8,
  },
  heroSubtitle: {
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#999',
  },
  // Packages Grid
  packagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    justifyContent: 'center',
  },
  packageCard: {
    width: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  selectedPackage: {
    borderColor: '#FF007B',
    backgroundColor: 'rgba(255, 0, 123, 0.08)',
  },
  popularBadge: {
    position: 'absolute',
    top: -1,
    right: -1,
    left: -1,
    backgroundColor: '#FF007B',
    paddingVertical: 4,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
  },
  popularText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 10,
    color: '#FFF',
    letterSpacing: 1,
  },
  packageTokens: {
    fontFamily: FONTS.Bold,
    fontSize: 24,
    color: '#FFF',
    marginTop: 4,
  },
  packageTokenLabel: {
    fontFamily: FONTS.Regular,
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  packagePrice: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    color: '#FF007B',
  },
  // Info Section
  infoSection: {
    marginTop: 28,
    paddingHorizontal: 24,
    gap: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#999',
  },
  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  purchaseButton: {
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  purchaseButtonText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    color: '#FFF',
  },
});

export default TopUpScreen;
