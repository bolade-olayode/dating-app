// src/components/ui/SkeletonLoader.tsx
//
// Shimmer skeleton components for loading states.
// Usage:
//   <ConversationRowSkeleton />         — full chat-list row
//   <ProfileCardSkeleton />             — 2-column grid card
//   <SkeletonBox width={200} height={20} /> — any custom box

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Base shimmer box ─────────────────────────────────────────

interface SkeletonBoxProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}

export const SkeletonBox: React.FC<SkeletonBoxProps> = ({
  width,
  height,
  borderRadius = 8,
  style,
}) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: false,
      }),
    ).start();
  }, [shimmer]);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
    <View
      style={[
        { width, height, borderRadius, backgroundColor: '#1C1C1E', overflow: 'hidden' },
        style,
      ]}
    >
      <Animated.View
        style={[StyleSheet.absoluteFillObject, { transform: [{ translateX }] }]}
      >
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.06)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
    </View>
  );
};

// ─── Chat conversation row ────────────────────────────────────

export const ConversationRowSkeleton: React.FC = () => (
  <View style={rowStyles.container}>
    <SkeletonBox width={52} height={52} borderRadius={26} />
    <View style={rowStyles.textCol}>
      <SkeletonBox width={140} height={14} borderRadius={7} />
      <SkeletonBox width={220} height={12} borderRadius={6} style={{ marginTop: 8 }} />
    </View>
    <SkeletonBox width={30} height={10} borderRadius={5} />
  </View>
);

const rowStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
  },
  textCol: {
    flex: 1,
    gap: 0,
  },
});

// ─── Profile grid card (2-column) ────────────────────────────

interface ProfileCardSkeletonProps {
  cardSize: number;
}

export const ProfileCardSkeleton: React.FC<ProfileCardSkeletonProps> = ({ cardSize }) => (
  <View style={{ gap: 6 }}>
    <SkeletonBox width={cardSize} height={cardSize * 1.3} borderRadius={16} />
    <SkeletonBox width={cardSize * 0.6} height={12} borderRadius={6} />
    <SkeletonBox width={cardSize * 0.4} height={10} borderRadius={5} />
  </View>
);

// ─── Notification row ─────────────────────────────────────────

export const NotificationRowSkeleton: React.FC = () => (
  <View style={notifStyles.container}>
    <SkeletonBox width={44} height={44} borderRadius={22} />
    <View style={notifStyles.textCol}>
      <SkeletonBox width={200} height={13} borderRadius={6} />
      <SkeletonBox width={120} height={11} borderRadius={5} style={{ marginTop: 6 }} />
    </View>
  </View>
);

const notifStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
  },
  textCol: {
    flex: 1,
  },
});
