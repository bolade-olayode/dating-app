// src/screens/Home/LikesYouScreen.tsx

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  FlatList,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';
import Flare from '@components/ui/Flare';
import { useUser } from '@context/UserContext';
import { matchingService } from '@services/api/matchingService';
import { walletService } from '@services/api/walletService';
import { devLog } from '@config/environment';

// ─── Constants ───────────────────────────────────────────────

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 48) / 2; // 2 columns, 8px gap, 20px side padding
const SEE_LIKES_COST_DEFAULT = 25;

// ─── Types ───────────────────────────────────────────────────

interface LikeProfile {
  id: string;
  name: string;
  age: number;
  photoUri: string | null;
  location: string;
  verified: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────

const calcAge = (dobStr: string): number => {
  const dob = new Date(dobStr);
  const today = new Date();
  let a = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) a--;
  return a;
};

const mapApiProfile = (p: any): LikeProfile => ({
  id: p._id || p.id || String(Math.random()),
  name: p.name || p.fullname || p.username || 'Someone',
  age: p.age ?? (p.dateOfBirth || p.dob ? calcAge(p.dateOfBirth || p.dob) : 0),
  photoUri: p.photos?.[0] ?? null,
  location:
    typeof p.location === 'string'
      ? p.location
      : p.location?.city || p.city || '',
  verified: p.verified || false,
});

// ─── Component ───────────────────────────────────────────────

const LikesYouScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { coinBalance, setCoinBalance } = useUser();

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [profiles, setProfiles] = useState<LikeProfile[]>([]);
  const [seelikesCost, setSeelikesCost] = useState(SEE_LIKES_COST_DEFAULT);

  const hasEnoughCoins = coinBalance >= seelikesCost;

  // Fetch real cost from actions API on mount
  useEffect(() => {
    const fetchCost = async () => {
      const result = await walletService.getActions();
      if (result.success && Array.isArray(result.data)) {
        const action = result.data.find((a: any) => a.actionKey === 'see_likes');
        if (action?.cost) {
          devLog('💰 LikesYou: cost from API =', action.cost);
          setSeelikesCost(action.cost);
        }
      }
    };
    fetchCost();
  }, []);

  // Fetch profiles from backend
  const fetchLikes = useCallback(async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    const result = await matchingService.getLikes();
    devLog('❤️ LikesYou: getLikes result', result.success, result.message);

    if (result.success) {
      const raw = Array.isArray(result.data)
        ? result.data
        : result.data?.likes || result.data?.users || [];
      setProfiles(raw.map(mapApiProfile));
    } else {
      devLog('⚠️ getLikes failed:', result.message);
      setProfiles([]);
    }

    if (showRefresh) setIsRefreshing(false);
    else setIsLoading(false);
  }, []);

  // Spend coins and reveal likes
  const handleUnlock = async () => {
    if (isUnlocking || !hasEnoughCoins) return;
    setIsUnlocking(true);

    const spendResult = await walletService.spend('see_likes');

    if (!spendResult.success) {
      Alert.alert(
        'Payment Failed',
        spendResult.message || 'Could not deduct coins. Please try again.',
      );
      setIsUnlocking(false);
      return;
    }

    // Update balance locally
    const newBalance = spendResult.data?.balance ?? spendResult.data?.newBalance;
    if (typeof newBalance === 'number') {
      setCoinBalance(newBalance);
    } else {
      setCoinBalance(Math.max(0, coinBalance - seelikesCost));
    }

    setIsUnlocked(true);
    await fetchLikes();
    setIsUnlocking(false);
  };

  // ─── Render card ─────────────────────────────────────────

  const renderCard = ({ item }: { item: LikeProfile }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() =>
        navigation.navigate('ProfileDetail', {
          profile: {
            id: item.id,
            name: item.name,
            age: item.age,
            photo: item.photoUri ? { uri: item.photoUri } : null,
            location: item.location,
            verified: item.verified,
          },
        })
      }
    >
      {item.photoUri ? (
        <Image
          source={{ uri: item.photoUri }}
          style={styles.cardPhoto}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View style={styles.cardPhotoPlaceholder}>
          <Icon name="person" size={48} color="#444" />
        </View>
      )}

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.88)']}
        style={styles.cardGradient}
      >
        <View style={styles.cardInfo}>
          <View style={styles.cardNameRow}>
            <Text style={styles.cardName} numberOfLines={1}>
              {item.name}, {item.age}
            </Text>
            {item.verified && (
              <Icon name="checkmark-circle" size={14} color="#00FF7F" />
            )}
          </View>
          {!!item.location && (
            <Text style={styles.cardLocation} numberOfLines={1}>
              {item.location}
            </Text>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  // ─── Gate UI (before unlock) ─────────────────────────────

  const GateContent = () => (
    <View style={styles.gateContainer}>
      {/* Decorative blurred placeholder cards */}
      <View style={styles.previewGrid} pointerEvents="none">
        {[0.25, 0.18, 0.12, 0.07].map((opacity, i) => (
          <View key={i} style={[styles.blurCard, { opacity }]}>
            <Icon name="person" size={36} color="#666" />
          </View>
        ))}
      </View>

      {/* Lock card overlay */}
      <View style={styles.lockCard}>
        <View style={styles.lockIconRing}>
          <Icon name="heart" size={36} color="#FF007B" />
        </View>

        <Text style={styles.lockTitle}>See who likes you</Text>
        <Text style={styles.lockBody}>
          Spend {seelikesCost} coins to reveal everyone who has already liked your profile.
        </Text>

        {!hasEnoughCoins ? (
          <>
            <View style={styles.coinRow}>
              <View style={styles.coinItem}>
                <Text style={styles.coinItemLabel}>Your balance</Text>
                <Text style={styles.coinItemValue}>{coinBalance.toLocaleString()}</Text>
              </View>
              <Icon name="arrow-forward" size={18} color="#444" />
              <View style={styles.coinItem}>
                <Text style={styles.coinItemLabel}>Required</Text>
                <Text style={[styles.coinItemValue, { color: '#FF007B' }]}>
                  {seelikesCost}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate('TopUp')}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryBtnText}>Buy Coins</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.unlockBtn, isUnlocking && styles.unlockBtnDisabled]}
            onPress={handleUnlock}
            activeOpacity={0.85}
            disabled={isUnlocking}
          >
            {isUnlocking ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Icon name="heart" size={16} color="#FFF" />
                <Text style={styles.unlockBtnText}>
                  Unlock for {seelikesCost} coins
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // ─── Main render ─────────────────────────────────────────

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

        <Text style={styles.headerTitle}>Likes You</Text>

        {/* Coin balance badge */}
        <View style={styles.coinBadge}>
          <Icon name="heart" size={13} color="#FF007B" />
          <Text style={styles.coinBadgeText}>{coinBalance.toLocaleString()}</Text>
        </View>
      </View>

      {/* Content */}
      {!isUnlocked ? (
        <GateContent />
      ) : isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FF007B" />
        </View>
      ) : profiles.length === 0 ? (
        <View style={styles.centered}>
          <Icon name="heart-outline" size={64} color="#333" />
          <Text style={styles.emptyTitle}>No likes yet</Text>
          <Text style={styles.emptyBody}>
            Keep swiping — someone will like your profile soon!
          </Text>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => fetchLikes(false)}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryBtnText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={profiles}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={renderCard}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[styles.grid, { paddingBottom: insets.bottom + 20 }]}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchLikes(true)}
              tintColor="#FF007B"
              colors={['#FF007B']}
            />
          }
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.countLabel}>
              {profiles.length} {profiles.length === 1 ? 'person' : 'people'} liked you
            </Text>
          }
        />
      )}
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────

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
    marginBottom: 16,
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
    fontFamily: FONTS.Bold,
    fontSize: 20,
    color: '#FFF',
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 0, 123, 0.12)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 123, 0.2)',
  },
  coinBadgeText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 13,
    color: '#FF007B',
  },

  // Gate state
  gateContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    width: '100%',
    marginBottom: -(CARD_SIZE * 0.55),
  },
  blurCard: {
    width: CARD_SIZE,
    height: CARD_SIZE * 1.3,
    borderRadius: 16,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 28,
    alignItems: 'center',
    gap: 14,
  },
  lockIconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 0, 123, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 0, 123, 0.2)',
  },
  lockTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 22,
    color: '#FFF',
    textAlign: 'center',
  },
  lockBody: {
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 21,
  },
  coinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 8,
  },
  coinItem: {
    alignItems: 'center',
    gap: 4,
  },
  coinItemLabel: {
    fontFamily: FONTS.Regular,
    fontSize: 12,
    color: '#666',
  },
  coinItemValue: {
    fontFamily: FONTS.Bold,
    fontSize: 22,
    color: '#FFF',
  },
  unlockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF007B',
    paddingVertical: 16,
    borderRadius: 30,
    width: '100%',
  },
  unlockBtnDisabled: {
    opacity: 0.5,
  },
  unlockBtnText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    color: '#FFF',
  },
  secondaryBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#FF007B',
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
    color: '#FF007B',
  },

  // Grid state
  grid: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  row: {
    gap: 8,
    marginBottom: 8,
  },
  countLabel: {
    fontFamily: FONTS.Regular,
    fontSize: 13,
    color: '#666',
    marginBottom: 14,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE * 1.3,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  cardPhoto: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardPhotoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 10,
  },
  cardInfo: {
    gap: 2,
  },
  cardNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardName: {
    fontFamily: FONTS.SemiBold,
    fontSize: 14,
    color: '#FFF',
    flex: 1,
  },
  cardLocation: {
    fontFamily: FONTS.Regular,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
  },

  // Empty / loading
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: 20,
    color: '#FFF',
  },
  emptyBody: {
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
});

export default LikesYouScreen;
