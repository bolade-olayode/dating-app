// src/components/ui/CoinBalance.tsx

/**
 * COIN BALANCE COMPONENT
 *
 * Reusable component to display user's token balance.
 * Two variants:
 * - compact: Small floating indicator for Discovery/Home screen
 * - banner: Full-width card for Wallet screen (matches Figma design)
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';

interface CoinBalanceProps {
  balance: number;
  variant?: 'compact' | 'banner';
  lowBalanceThreshold?: number;
  onPress?: () => void;
  onBuyPress?: () => void;
}

const CoinBalance: React.FC<CoinBalanceProps> = ({
  balance,
  variant = 'compact',
  lowBalanceThreshold = 10,
  onPress,
  onBuyPress,
}) => {
  const isLowBalance = balance <= lowBalanceThreshold;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Subtle pulse/gleam animation when balance is low
  useEffect(() => {
    if (isLowBalance) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      glowAnim.setValue(0);
    }
  }, [isLowBalance]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.6],
  });

  const formatBalance = (num: number): string => {
    if (num >= 1000) {
      return num.toLocaleString();
    }
    return num.toString();
  };

  if (variant === 'compact') {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <Animated.View
          style={[
            styles.compactContainer,
            isLowBalance && {
              shadowColor: '#FF007B',
              shadowOpacity: glowOpacity,
              shadowRadius: 12,
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(30, 20, 60, 0.9)', 'rgba(60, 20, 60, 0.9)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.compactGradient}
          >
            <Icon name="heart" size={14} color="#FF007B" />
            <Text style={styles.compactBalance}>{formatBalance(balance)}</Text>
          </LinearGradient>

          {/* Low balance gleam overlay */}
          {isLowBalance && (
            <Animated.View
              style={[
                styles.compactGleam,
                { opacity: glowOpacity },
              ]}
            />
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  }

  // Banner variant
  return (
    <View style={styles.bannerWrapper}>
      <Animated.View
        style={[
          styles.bannerShadow,
          isLowBalance && {
            shadowColor: '#FF007B',
            shadowOpacity: glowOpacity,
            shadowRadius: 20,
          },
        ]}
      >
        <LinearGradient
          colors={['#1A1035', '#3D1545', '#2A1040']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.bannerContainer}
        >
          {/* Heart Icon */}
          <View style={styles.bannerIconContainer}>
            <Icon name="heart" size={32} color="#FF007B" />
          </View>

          {/* Balance Info */}
          <View style={styles.bannerInfo}>
            <Text style={styles.bannerLabel}>Your balance</Text>
            <Text style={styles.bannerBalance}>{formatBalance(balance)}</Text>
          </View>

          {/* Buy Tokens Button */}
          <TouchableOpacity onPress={onBuyPress} activeOpacity={0.8}>
            <LinearGradient
              colors={['#00B4D8', '#0077B6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buyButton}
            >
              <Text style={styles.buyButtonText}>Buy tokens</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Low balance gleam overlay */}
          {isLowBalance && (
            <Animated.View
              style={[
                styles.bannerGleam,
                { opacity: glowOpacity },
              ]}
            />
          )}
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  // ========== COMPACT VARIANT ==========
  compactContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  compactGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  compactBalance: {
    fontFamily: FONTS.SemiBold,
    fontSize: 13,
    color: '#FFF',
  },
  compactGleam: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF007B',
  },

  // ========== BANNER VARIANT ==========
  bannerWrapper: {
    paddingHorizontal: 20,
  },
  bannerShadow: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  bannerIconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  bannerInfo: {
    flex: 1,
  },
  bannerLabel: {
    fontFamily: FONTS.Regular,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  bannerBalance: {
    fontFamily: FONTS.Bold,
    fontSize: 26,
    color: '#FFF',
  },
  buyButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buyButtonText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 13,
    color: '#FFF',
  },
  bannerGleam: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FF007B',
  },
});

export default CoinBalance;
