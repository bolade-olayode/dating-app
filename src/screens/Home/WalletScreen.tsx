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
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';
import Flare from '@components/ui/Flare';
import CoinBalance from '@components/ui/CoinBalance';
import { useUser } from '@context/UserContext';
import { walletService, CoinAction, WalletResponse } from '@services/api/walletService';
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
  { id: 1, title: 'Swipe Pass (24hrs)', description: 'Unlimited swipes for a full day', icon: 'infinite-outline',       cost: 120, actionKey: 'swipe_pass'    },
  { id: 2, title: 'Rewind',             description: 'Undo your last swipe',             icon: 'arrow-undo-outline',    cost: 30,  actionKey: 'rewind'         },
  { id: 3, title: 'Read Receipts',      description: 'Know when messages are read',       icon: 'checkmark-done-outline',cost: 40,  actionKey: 'read_receipts'  },
  { id: 4, title: 'Verified Badge',     description: 'Get verified (one-time)',           icon: 'checkmark-circle-outline', cost: 250, actionKey: 'verified_badge' },
];

// Where each action takes the user after spending
const ACTION_REDIRECT: Record<string | number, string> = {
  // Token Packages — by actionKey
  see_likes:        'LikesYou',
  super_like:       'Discovery',
  boost:            'ProfilePerformance',
  priority_message: 'Chats',
  visitors:         'ProfilePerformance',
  spotlight:        'ProfilePerformance',
  // Features — by actionKey
  swipe_pass:       'Discovery',
  rewind:           'Discovery',
  read_receipts:    'Chats',
  // Token Packages — by fallback id
  1: 'LikesYou',
  2: 'Discovery',
  3: 'ProfilePerformance',
  4: 'Chats',
  5: 'ProfilePerformance',
  6: 'ProfilePerformance',
};

// Detailed descriptions shown in the modal
const ACTION_DETAIL: Record<string | number, string> = {
  // Token Packages
  see_likes:        'Reveal everyone who has already liked your profile. Match instantly with a tap.',
  super_like:       'Stand out from the crowd — send a Super Like and they\'ll know you\'re seriously interested.',
  boost:            'Jump to the top of the discovery feed in your area for 30 minutes. Get up to 10× more profile views.',
  priority_message: 'Your first message appears at the very top of their inbox — impossible to miss.',
  visitors:         'See a full list of everyone who has visited your profile in the last 7 days.',
  spotlight:        'Get featured prominently in the Explore tab for 1 hour, reaching users who are actively browsing.',
  // Features
  swipe_pass:       'Swipe freely for 24 hours — no daily limit. Keep discovering new people without interruption.',
  rewind:           'Accidentally passed on someone great? Rewind your last swipe and give them a second chance.',
  read_receipts:    'See exactly when your messages have been read so you know when to follow up.',
  verified_badge:   'Verify your identity with a quick selfie check. Earn a badge that shows you\'re real and trustworthy.',
  // Token Packages by numeric id (fallback)
  1: 'Reveal everyone who has already liked your profile. Match instantly with a tap.',
  2: 'Stand out from the crowd — send a Super Like and they\'ll know you\'re seriously interested.',
  3: 'Jump to the top of the discovery feed in your area for 30 minutes. Get up to 10× more profile views.',
  4: 'Your first message appears at the very top of their inbox — impossible to miss.',
  5: 'See a full list of everyone who has visited your profile in the last 7 days.',
  6: 'Get featured prominently in the Explore tab for 1 hour, reaching users who are actively browsing.',
};

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
  const { coinBalance, setCoinBalance, addCoins } = useUser();

  const [apiActions, setApiActions] = useState<CoinAction[]>([]);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [selectedAction, setSelectedAction] = useState<typeof TOKEN_PACKAGES[0] | null>(null);
  const [isSpending, setIsSpending] = useState(false);

  // Fetch real balance + actions whenever screen is focused
  useEffect(() => {
    if (!isFocused) return;

    const fetchWalletData = async () => {
      setIsLoadingBalance(true);

      const [balanceResult, actionsResult] = await Promise.all([
        walletService.getBalance(),
        walletService.getActions(),
      ]);

      // Sync real balance into context.
      // Use Math.max so a locally-credited balance (e.g. from a fallback purchase)
      // is never silently overwritten by a stale backend value.
      if (balanceResult.success && balanceResult.data != null) {
        const raw = typeof balanceResult.data === 'number'
          ? balanceResult.data
          : balanceResult.data?.balance ?? balanceResult.data?.coins ?? 0;
        const balance = Number.isFinite(Number(raw)) ? Number(raw) : 0;
        devLog('💰 Wallet: balance =', balance);
        setCoinBalance(Math.max(Number.isFinite(coinBalance) ? coinBalance : 0, balance));
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

  const handleSpend = async () => {
    if (!selectedAction || isSpending) return;
    if (coinBalance < selectedAction.cost) {
      Alert.alert('Not enough coins', 'You need more coins to use this feature.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Buy Coins', onPress: () => { setSelectedAction(null); navigation.navigate('TopUp'); } },
      ]);
      return;
    }

    setIsSpending(true);
    const actionKey = (selectedAction as any).actionKey;
    let spendResult: WalletResponse = { success: false, message: 'No action key' };
    if (actionKey) {
      spendResult = await walletService.spend(actionKey);
    }

    if (spendResult.success) {
      const newBal = spendResult.data?.balance ?? spendResult.data?.newBalance;
      setCoinBalance(typeof newBal === 'number' ? newBal : Math.max(0, coinBalance - selectedAction.cost));
    } else {
      // Deduct locally if backend action not configured
      setCoinBalance(Math.max(0, coinBalance - selectedAction.cost));
    }

    const dest = ACTION_REDIRECT[actionKey] || ACTION_REDIRECT[selectedAction.id];
    setIsSpending(false);
    setSelectedAction(null);

    if (dest) {
      navigation.navigate(dest as any);
    }
  };

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
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <View style={styles.backButton}>
            <Icon name="chevron-back" size={22} color="#FFF" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet</Text>
        {isLoadingBalance
          ? <ActivityIndicator size="small" color="#FF007B" style={{ width: 36 }} />
          : <View style={{ width: 36 }} />
        }
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
              onPress={() => setSelectedAction(pkg as any)}
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
              onPress={feature.id === 4
                ? () => navigation.navigate('ProfileVerification')
                : () => setSelectedAction({ id: feature.id, name: feature.title, description: feature.description, icon: feature.icon, cost: feature.cost, actionKey: feature.actionKey } as any)
              }
            >
              <View style={styles.packageIconContainer}>
                <Icon name={feature.icon} size={20} color="#FF007B" />
              </View>

              <View style={styles.packageInfo}>
                <Text style={styles.packageName}>{feature.title}</Text>
                <Text style={styles.packageDescription}>{feature.description}</Text>
              </View>

              <View style={styles.packageCostContainer}>
                <Icon name="heart" size={14} color="#FF007B" />
                <Text style={styles.packageCost}>{feature.cost}</Text>
              </View>

              <Icon name="chevron-forward" size={18} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Dev-only: quick coin top-up for testing */}
        {__DEV__ && (
          <View style={[styles.section, { marginTop: 32 }]}>
            <Text style={[styles.sectionTitle, { color: '#FFD700', fontSize: 13 }]}>
              DEV TOOLS
            </Text>
            {[100, 500, 1000].map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[styles.packageRow, { borderBottomColor: 'rgba(255,215,0,0.1)' }]}
                activeOpacity={0.7}
                onPress={() => addCoins(amount)}
              >
                <View style={[styles.packageIconContainer, { backgroundColor: 'rgba(255,215,0,0.08)' }]}>
                  <Icon name="flash-outline" size={20} color="#FFD700" />
                </View>
                <View style={styles.packageInfo}>
                  <Text style={[styles.packageName, { color: '#FFD700' }]}>Add {amount} coins</Text>
                  <Text style={styles.packageDescription}>Dev shortcut — not in production</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Token Action Detail Modal */}
      <Modal
        visible={!!selectedAction}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedAction(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedAction(null)}
        >
          <TouchableOpacity
            style={styles.modalSheet}
            activeOpacity={1}
            onPress={() => {}}
          >
            {selectedAction && (
              <>
                {/* Icon */}
                <View style={styles.modalIconRing}>
                  <Icon name={selectedAction.icon} size={32} color="#FF007B" />
                </View>

                {/* Name + detail */}
                <Text style={styles.modalTitle}>{selectedAction.name}</Text>
                <Text style={styles.modalDetail}>
                  {ACTION_DETAIL[(selectedAction as any).actionKey] || ACTION_DETAIL[selectedAction.id] || selectedAction.description}
                </Text>

                {/* Balance vs cost */}
                <View style={styles.modalCostRow}>
                  <View style={styles.modalCostItem}>
                    <Text style={styles.modalCostLabel}>Your balance</Text>
                    <Text style={styles.modalCostValue}>{coinBalance.toLocaleString()}</Text>
                  </View>
                  <Icon name="arrow-forward" size={16} color="#444" />
                  <View style={styles.modalCostItem}>
                    <Text style={styles.modalCostLabel}>Cost</Text>
                    <Text style={[styles.modalCostValue, { color: '#FF007B' }]}>
                      {selectedAction.cost.toLocaleString()}
                    </Text>
                  </View>
                </View>

                {/* Spend button */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleSpend}
                  disabled={isSpending}
                  style={styles.modalSpendBtn}
                >
                  <LinearGradient
                    colors={['#FF007B', '#FF4458']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.modalSpendGradient, isSpending && { opacity: 0.6 }]}
                  >
                    {isSpending
                      ? <ActivityIndicator color="#FFF" />
                      : <Text style={styles.modalSpendText}>
                          Use {selectedAction.cost} coins
                        </Text>
                    }
                  </LinearGradient>
                </TouchableOpacity>

                {coinBalance < selectedAction.cost && (
                  <TouchableOpacity
                    style={styles.modalBuyLink}
                    onPress={() => { setSelectedAction(null); navigation.navigate('TopUp'); }}
                  >
                    <Text style={styles.modalBuyLinkText}>Not enough coins — Buy more</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => setSelectedAction(null)} style={{ marginTop: 12 }}>
                  <Text style={styles.modalCancel}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 22,
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
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#111',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 48,
    alignItems: 'center',
  },
  modalIconRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,0,123,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,0,123,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 22,
    color: '#FFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalDetail: {
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalCostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 28,
  },
  modalCostItem: {
    alignItems: 'center',
    gap: 4,
  },
  modalCostLabel: {
    fontFamily: FONTS.Regular,
    fontSize: 12,
    color: '#555',
  },
  modalCostValue: {
    fontFamily: FONTS.Bold,
    fontSize: 22,
    color: '#FFF',
  },
  modalSpendBtn: {
    width: '100%',
  },
  modalSpendGradient: {
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  modalSpendText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    color: '#FFF',
  },
  modalBuyLink: {
    marginTop: 14,
  },
  modalBuyLinkText: {
    fontFamily: FONTS.Regular,
    fontSize: 13,
    color: '#FF007B',
    textDecorationLine: 'underline',
  },
  modalCancel: {
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#555',
  },
});

export default WalletScreen;
