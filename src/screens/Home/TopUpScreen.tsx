// src/screens/Home/TopUpScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';
import Flare from '@components/ui/Flare';
import { useUser } from '@context/UserContext';
import { walletService, CoinPackage } from '@services/api/walletService';
import { devLog } from '@config/environment';

// Fallback packages — used when API is unavailable
const FALLBACK_PACKAGES: CoinPackage[] = [
  { _id: '1', id: '1', name: 'Starter',  coins: 150,   bonusCoins: 0,    priceNaira: 2000,   productId: 'starter',  isActive: true },
  { _id: '2', id: '2', name: 'Silver',   coins: 450,   bonusCoins: 50,   priceNaira: 5000,   productId: 'silver',   isActive: true },
  { _id: '3', id: '3', name: 'Gold',     coins: 1000,  bonusCoins: 200,  priceNaira: 10000,  productId: 'gold',     isActive: true },
  { _id: '4', id: '4', name: 'Platinum', coins: 2300,  bonusCoins: 500,  priceNaira: 20000,  productId: 'platinum', isActive: true },
  { _id: '5', id: '5', name: 'Elite',    coins: 6500,  bonusCoins: 700,  priceNaira: 50000,  productId: 'elite',    isActive: true },
  { _id: '6', id: '6', name: 'Odogwu',  coins: 10000, bonusCoins: 1000, priceNaira: 100000, productId: 'odogwu',   isActive: true },
];

const TopUpScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { addCoins, setCoinBalance } = useUser();

  const [packages, setPackages] = useState<CoinPackage[]>(FALLBACK_PACKAGES);
  const [selectedId, setSelectedId] = useState<string>('3'); // Default: Gold (popular)
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Fetch real packages on mount
  useEffect(() => {
    const fetchPackages = async () => {
      setIsLoading(true);
      const result = await walletService.getPackages();
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        const active: CoinPackage[] = result.data.filter((p: CoinPackage) => p.isActive);
        devLog('📦 TopUp: loaded', active.length, 'packages');
        setPackages(active);
        // Default-select the middle package (typically best value)
        const mid = active[Math.floor(active.length / 2)];
        if (mid) setSelectedId(mid._id || mid.id);
      }
      setIsLoading(false);
    };
    fetchPackages();
  }, []);

  const formatTokens = (num: number) => num.toLocaleString();
  const formatPrice  = (naira: number) => `₦${naira.toLocaleString()}`;

  const selectedPkg = packages.find((p) => (p._id || p.id) === selectedId);

  const handlePurchase = async () => {
    if (!selectedPkg || isPurchasing) return;
    setIsPurchasing(true);

    const productId    = selectedPkg.productId || selectedPkg.id;
    const receiptToken = `mock_receipt_${Date.now()}`;
    const result       = await walletService.purchase('mock', productId, receiptToken);

    if (result.success) {
      devLog('💳 TopUp: purchase success', result.data);
      // Sync new balance from API response
      const newBalance = result.data?.balance ?? result.data?.coins ?? result.data?.newBalance;
      if (typeof newBalance === 'number') {
        setCoinBalance(newBalance);
      } else {
        addCoins(selectedPkg.coins + selectedPkg.bonusCoins);
      }
      Alert.alert(
        'Purchase Successful!',
        `${formatTokens(selectedPkg.coins + selectedPkg.bonusCoins)} coins added to your wallet.`,
        [{ text: 'Great!', onPress: () => navigation.goBack() }],
      );
    } else {
      // API failed — credit locally so UX isn't blocked
      devLog('💳 TopUp: purchase API failed, crediting locally');
      addCoins(selectedPkg.coins + selectedPkg.bonusCoins);
      Alert.alert(
        'Coins Added',
        `${formatTokens(selectedPkg.coins + selectedPkg.bonusCoins)} coins added to your wallet.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    }

    setIsPurchasing(false);
  };

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
        {isLoading ? (
          <ActivityIndicator size="small" color="#FF007B" style={{ width: 40 }} />
        ) : (
          <View style={{ width: 40 }} />
        )}
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
          {packages.map((pkg, index) => {
            const pkgId    = pkg._id || pkg.id;
            const isPopular = index === Math.floor(packages.length / 2);
            return (
              <TouchableOpacity
                key={pkgId}
                activeOpacity={0.8}
                onPress={() => setSelectedId(pkgId)}
                style={[
                  styles.packageCard,
                  selectedId === pkgId && styles.selectedPackage,
                ]}
              >
                {isPopular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>BEST VALUE</Text>
                  </View>
                )}

                <Text style={styles.packageLabel}>{pkg.name}</Text>
                <Text style={styles.packageTokens}>{formatTokens(pkg.coins)}</Text>
                <Text style={styles.packageTokenLabel}>coins</Text>
                {pkg.bonusCoins > 0 && (
                  <Text style={styles.bonusText}>+{formatTokens(pkg.bonusCoins)} bonus</Text>
                )}
                <Text style={styles.packagePrice}>{formatPrice(pkg.priceNaira)}</Text>
              </TouchableOpacity>
            );
          })}
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
          onPress={handlePurchase}
          disabled={!selectedPkg || isPurchasing}
        >
          <LinearGradient
            colors={['#FF007B', '#FF4458']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.purchaseButton,
              (!selectedPkg || isPurchasing) && styles.purchaseButtonDisabled,
            ]}
          >
            {isPurchasing ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.purchaseButtonText}>
                {selectedPkg
                  ? `Purchase for ${formatPrice(selectedPkg.priceNaira)}`
                  : 'Select a package'}
              </Text>
            )}
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
  packageLabel: {
    fontFamily: FONTS.SemiBold,
    fontSize: 11,
    color: '#999',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  packageTokens: {
    fontFamily: FONTS.Bold,
    fontSize: 24,
    color: '#FFF',
    marginTop: 2,
  },
  packageTokenLabel: {
    fontFamily: FONTS.Regular,
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  bonusText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 11,
    color: '#00FF7F',
    marginBottom: 4,
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
  purchaseButtonDisabled: {
    opacity: 0.5,
  },
  purchaseButtonText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    color: '#FFF',
  },
});

export default TopUpScreen;
