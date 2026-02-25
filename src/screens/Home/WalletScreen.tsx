// src/screens/Home/WalletScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';
import Flare from '@components/ui/Flare';
import CoinBalance from '@components/ui/CoinBalance';
import { useUser } from '@context/UserContext';
import { walletService, CoinAction } from '@services/api/walletService';
import { devLog } from '@config/environment';

// Premium features with coin costs (from revenue plan)
const TOKEN_PACKAGES = [
  {
    id: 1,
    name: 'See who likes you',
    description: 'View your secret admirers',
    icon: 'eye-outline',
    cost: 25,
  },
  {
    id: 2,
    name: 'Super Like',
    description: 'Send a bold signal of interest',
    icon: 'heart-outline',
    cost: 50,
  },
  {
    id: 3,
    name: 'Profile Boost',
    description: '30min visibility boost in your area',
    icon: 'rocket-outline',
    cost: 50,
  },
  {
    id: 4,
    name: 'Priority Message',
    description: 'Your message appears first',
    icon: 'sparkles-outline',
    cost: 80,
  },
  {
    id: 5,
    name: 'Profile Visitors',
    description: 'See who viewed your profile',
    icon: 'people-outline',
    cost: 100,
  },
  {
    id: 6,
    name: 'Spotlight',
    description: 'Featured in Explore for 1 hour',
    icon: 'flashlight-outline',
    cost: 200,
  },
];

// Additional purchasable features
const FEATURES = [
  { id: 1, title: 'Swipe Pass (24hrs)', description: 'Unlimited swipes for a full day — 120 coins', icon: 'infinite-outline' },
  { id: 2, title: 'Rewind', description: 'Undo your last swipe — 30 coins', icon: 'arrow-undo-outline' },
  { id: 3, title: 'Read Receipts', description: 'Know when messages are read — 40 coins', icon: 'checkmark-done-outline' },
  { id: 4, title: 'Verified Badge', description: 'Get verified — 250 coins (one-time)', icon: 'checkmark-circle-outline' },
];

// Map backend actionKey → icon name (Ionicons)
const ACTION_ICON: Record<string, string> = {
  super_like:       'heart-outline',
  boost:            'rocket-outline',
  see_likes:        'eye-outline',
  priority_message: 'sparkles-outline',
  visitors:         'people-outline',
  spotlight:        'flashlight-outline',
  swipe_pass:       'infinite-outline',
  rewind:           'arrow-undo-outline',
  read_receipts:    'checkmark-done-outline',
  verified_badge:   'checkmark-circle-outline',
};

const WalletScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const { coinBalance, setCoinBalance } = useUser();

  const [apiActions, setApiActions] = useState<CoinAction[]>([]);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // Fetch real balance + actions whenever screen is focused
  useEffect(() => {
    if (!isFocused) return;

    const fetchWalletData = async () => {
      setIsLoadingBalance(true);

      const [balanceResult, actionsResult] = await Promise.all([
        walletService.getBalance(),
        walletService.getActions(),
      ]);

      // Sync real balance into context
      if (balanceResult.success && balanceResult.data != null) {
        const balance = typeof balanceResult.data === 'number'
          ? balanceResult.data
          : balanceResult.data?.balance ?? balanceResult.data?.coins ?? 0;
        devLog('💰 Wallet: balance =', balance);
        setCoinBalance(balance);
      }

      // Replace actions list with real data
      if (actionsResult.success && Array.isArray(actionsResult.data) && actionsResult.data.length > 0) {
        devLog('🎯 Wallet: loaded', actionsResult.data.length, 'actions');
        setApiActions(actionsResult.data.filter((a: CoinAction) => a.isActive));
      }

      setIsLoadingBalance(false);
    };

    fetchWalletData();
  }, [isFocused, setCoinBalance]);

  // Merge API actions with local fallback — API wins if available
  const displayActions = apiActions.length > 0
    ? apiActions.map((a) => ({
        id: a._id || a.actionKey,
        name: a.label,
        description: `${a.cost} coins`,
        icon: ACTION_ICON[a.actionKey] || 'flash-outline',
        cost: a.cost,
        actionKey: a.actionKey,
      }))
    : TOKEN_PACKAGES;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <StatusBar barStyle="light-content" />
      <Flare />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wallet</Text>
        {isLoadingBalance && (
          <ActivityIndicator size="small" color="#FF007B" />
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Balance Banner */}
        <CoinBalance
          balance={coinBalance}
          variant="banner"
          onBuyPress={() => navigation.navigate('TopUp')}
        />

        {/* Coin-gated actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Token packages</Text>

          {displayActions.map((pkg) => (
            <TouchableOpacity
              key={pkg.id}
              style={styles.packageRow}
              activeOpacity={0.7}
              onPress={
                (pkg as any).actionKey === 'see_likes' || pkg.id === 1
                  ? () => navigation.navigate('LikesYou')
                  : undefined
              }
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

        {/* What you can do — static list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What you can do</Text>

          {FEATURES.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={styles.packageRow}
              activeOpacity={0.7}
              onPress={feature.id === 4 ? () => navigation.navigate('ProfileVerification') : undefined}
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
