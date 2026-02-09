// src/screens/Home/DiscoveryScreen.tsx

/**
 * DISCOVERY SCREEN (Home Tab)
 *
 * Main swipe interface for discovering potential matches.
 * Shows profile cards that can be swiped left (reject) or right (like).
 *
 * FEATURES:
 * - Card-based profile interface
 * - Action buttons (X, Message, Heart)
 * - Profile information overlay
 * - Interest tags
 * - Swipe gestures (TODO: Add later)
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';
import Flare from '@components/ui/Flare';
import CoinBalance from '@components/ui/CoinBalance';

const { width, height } = Dimensions.get('window');

// Exact Figma dimensions
const CARD_CONTAINER_WIDTH = 393; // Increased width
const CARD_CONTAINER_HEIGHT = 620; // Increased slightly
const CARD_WIDTH = 373; // Increased width
const CARD_HEIGHT = 600; // Increased slightly
const TOP_SPACING = 126;
const BOTTOM_SPACING = 49;
const SIDE_SPACING = 23;

// Mock profile data for testing (10 profiles)
const MOCK_PROFILES = [
  // Male profiles (img1-img5)
  {
    id: 1,
    name: 'Chukwueze',
    age: 28,
    location: 'Awka, Anambra',
    distance: '5 miles away',
    zodiac: 'Leo',
    interest: 'Long-term relationship',
    verified: true,
    photo: require('@assets/images/img1.jpg'),
  },
  {
    id: 2,
    name: 'David',
    age: 32,
    location: 'Maitama, Abuja',
    distance: '8 miles away',
    zodiac: 'Scorpio',
    interest: 'Casual dating',
    verified: false,
    photo: require('@assets/images/img2.jpg'),
  },
  {
    id: 3,
    name: 'James',
    age: 26,
    location: 'Ikorodu, Lagos',
    distance: '3 miles away',
    zodiac: 'Gemini',
    interest: 'New friends',
    verified: true,
    photo: require('@assets/images/img3.jpg'),
  },
  {
    id: 4,
    name: 'Alex',
    age: 30,
    location: 'Lagos Islnad, Lagos',
    distance: '12 miles away',
    zodiac: 'Aries',
    interest: 'Something casual',
    verified: true,
    photo: require('@assets/images/img4.jpg'),
  },
  {
    id: 5,
    name: 'Ryan',
    age: 27,
    location: 'Surulere, Lagos',
    distance: '6 miles away',
    zodiac: 'Taurus',
    interest: 'Long-term relationship',
    verified: false,
    photo: require('@assets/images/img5.jpg'),
  },
  // Female profiles (img6-img10)
  {
    id: 6,
    name: 'Tokumbo',
    age: 25,
    location: 'Ibadan, Oyo',
    distance: '4 miles away',
    zodiac: 'Libra',
    interest: 'Serious relationship',
    verified: true,
    photo: require('@assets/images/img6.jpg'),
  },
  {
    id: 7,
    name: 'Tems',
    age: 29,
    location: 'Ikeja, Lagos',
    distance: '7 miles away',
    zodiac: 'Cancer',
    interest: 'Casual fun',
    verified: true,
    photo: require('@assets/images/img7.jpg'),
  },
  {
    id: 8,
    name: 'Adesewa',
    age: 24,
    location: 'Ilesha, Osun',
    distance: '2 miles away',
    zodiac: 'Pisces',
    interest: 'New friends',
    verified: false,
    photo: require('@assets/images/img8.jpg'),
  },
  {
    id: 9,
    name: 'Fatima',
    age: 31,
    location: 'Yola, Adamawa',
    distance: '10 miles away',
    zodiac: 'Virgo',
    interest: 'Long-term relationship',
    verified: true,
    photo: require('@assets/images/img9.jpg'),
  },
  {
    id: 10,
    name: 'Cindarella',
    age: 26,
    location: 'Niamey, Niger',
    distance: '5 miles away',
    zodiac: 'Sagittarius',
    interest: 'Something casual',
    verified: true,
    photo: require('@assets/images/img10.jpg'),
  },
];

import { useNavigation } from '@react-navigation/native';

const DiscoveryScreen = () => {
  const navigation = useNavigation<any>();
  // Shuffle profiles on mount to show random order
  const [profiles] = useState(() => {
    const shuffled = [...MOCK_PROFILES].sort(() => Math.random() - 0.5);
    console.log('🔀 Shuffled profiles:', shuffled.map(p => p.name).join(', '));
    return shuffled;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'forYou' | 'nearby'>('forYou');
  const [swipeCount, setSwipeCount] = useState(0);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [coinBalance, setCoinBalance] = useState(20000); // Mock balance
  const [likeCount, setLikeCount] = useState(0);
  const currentProfile = profiles[currentIndex];

  // Use ref to store current index for PanResponder (avoids stale closure)
  const currentIndexRef = useRef(currentIndex);
  const swipeCountRef = useRef(swipeCount);
  const likeCountRef = useRef(likeCount);
  const coinBalanceRef = useRef(coinBalance);

  // Mock user photo (use first profile image as placeholder for current user)
  const userPhoto = require('@assets/images/img3.jpg');

  // Trigger match every 3rd like
  const checkForMatch = (likedProfile: typeof currentProfile) => {
    const newLikeCount = likeCountRef.current + 1;
    setLikeCount(newLikeCount);
    likeCountRef.current = newLikeCount;

    if (newLikeCount % 3 === 0) {
      // It's a match! Navigate after animation completes
      setTimeout(() => {
        navigation.navigate('Match', {
          matchedProfile: {
            name: likedProfile.name,
            photo: likedProfile.photo,
            age: likedProfile.age,
          },
          userPhoto,
        });
      }, 400);
    }
  };

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    swipeCountRef.current = swipeCount;
  }, [swipeCount]);

  useEffect(() => {
    coinBalanceRef.current = coinBalance;
  }, [coinBalance]);

  // Debug: Log initial mount
  useEffect(() => {
    console.log('🎯 ========================================');
    console.log('🎯 DISCOVERY SCREEN MOUNTED');
    console.log('📊 Total profiles available:', profiles.length);
    console.log('📋 All profile names:', profiles.map(p => `${p.id}: ${p.name}`).join(', '));
    console.log('🎯 ========================================');
  }, []);

  // Debug: Log profile changes
  useEffect(() => {
    console.log('🔄 Profile changed to index', currentIndex, '-', currentProfile?.name);
  }, [currentIndex, currentProfile]);

  // Animation values
  const position = useRef(new Animated.ValueXY()).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;

  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, width / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-width / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const FREE_SWIPE_LIMIT = 10;
  const SWIPE_COST = 3;

  const isFreeSwipesRemaining = () => swipeCount < FREE_SWIPE_LIMIT;

  const checkSwipeLimit = () => {
    const newCount = swipeCount + 1;
    setSwipeCount(newCount);

    // Free swipes still available
    if (newCount <= FREE_SWIPE_LIMIT) {
      return false;
    }

    // Paid swipes - check coin balance
    if (coinBalance >= SWIPE_COST) {
      setCoinBalance(prev => prev - SWIPE_COST);
      console.log(`💰 Deducted ${SWIPE_COST} coins. Balance: ${coinBalance - SWIPE_COST}`);
      return false;
    }

    // No coins left - show top-up alert
    setShowLimitAlert(true);
    return true;
  };

  // Navigate to profile detail view
  const handleViewProfile = () => {
    const isPaid = !isFreeSwipesRemaining();
    navigation.navigate('ProfileDetail', {
      profile: currentProfile,
      isPaidView: isPaid,
    });
  };

  const handleReject = () => {
    if (checkSwipeLimit()) return;

    console.log('Rejected:', currentProfile.name);
    setIsTransitioning(true);

    // Animate card to left and fade out
    Animated.parallel([
      Animated.timing(position, {
        toValue: { x: -width * 1.5, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => {
      position.setValue({ x: 0, y: 0 });
      nextProfile();
      // Fade in new card
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start(() => setIsTransitioning(false));
    });
  };

  const handleLike = () => {
    if (checkSwipeLimit()) return;

    console.log('Liked:', currentProfile.name);
    checkForMatch(currentProfile);
    setIsTransitioning(true);

    // Animate card to right and fade out
    Animated.parallel([
      Animated.timing(position, {
        toValue: { x: width * 1.5, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => {
      position.setValue({ x: 0, y: 0 });
      nextProfile();
      // Fade in new card
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start(() => setIsTransitioning(false));
    });
  };

  const handleMessage = () => {
    console.log('Message:', currentProfile.name);
  };

  const nextProfile = () => {
    const nextIndex = currentIndex < profiles.length - 1 ? currentIndex + 1 : 0;
    console.log('🔄 =====================================');
    console.log('🔄 NEXT PROFILE CALLED');
    console.log('🔢 Current index:', currentIndex);
    console.log('🔢 Next index:', nextIndex);
    console.log('👤 Current profile:', profiles[currentIndex].name);
    console.log('👤 Next profile:', profiles[nextIndex].name);
    console.log('📊 Total profiles:', profiles.length);
    console.log('🔄 =====================================');
    setCurrentIndex(nextIndex);
  };

  // Helper: check if swipe is allowed (free or has coins)
  const canSwipeRef = () => {
    const count = swipeCountRef.current + 1;
    if (count <= FREE_SWIPE_LIMIT) return true;
    if (coinBalanceRef.current >= SWIPE_COST) return true;
    return false;
  };

  // Helper: consume a swipe (increment count, deduct coins if needed)
  const consumeSwipeRef = () => {
    const newCount = swipeCountRef.current + 1;
    setSwipeCount(newCount);

    if (newCount > FREE_SWIPE_LIMIT) {
      const newBalance = coinBalanceRef.current - SWIPE_COST;
      setCoinBalance(newBalance);
      console.log(`💰 Deducted ${SWIPE_COST} coins. Balance: ${newBalance}`);
    }
  };

  // Animate card away and move to next
  const animateSwipeOut = (direction: 'left' | 'right', callback?: () => void) => {
    setIsTransitioning(true);
    const toX = direction === 'right' ? width * 1.5 : -width * 1.5;

    Animated.parallel([
      Animated.timing(position, {
        toValue: { x: toX, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => {
      position.setValue({ x: 0, y: 0 });
      const nextIdx = currentIndexRef.current < profiles.length - 1 ? currentIndexRef.current + 1 : 0;
      setCurrentIndex(nextIdx);
      callback?.();
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start(() => setIsTransitioning(false));
    });
  };

  // Pan responder for swipe gestures + tap detection
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        const swipeThreshold = 120;
        const isTap = Math.abs(gesture.dx) < 10 && Math.abs(gesture.dy) < 10;

        if (isTap) {
          // Tap detected - open profile detail
          handleViewProfile();
          return;
        }

        if (gesture.dx > swipeThreshold) {
          if (!canSwipeRef()) {
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              friction: 4,
              useNativeDriver: false,
            }).start(() => setShowLimitAlert(true));
            return;
          }

          // Swipe right - Like
          console.log('👉 SWIPE RIGHT - Liked:', profiles[currentIndexRef.current].name);
          consumeSwipeRef();
          checkForMatch(profiles[currentIndexRef.current]);
          animateSwipeOut('right');
        } else if (gesture.dx < -swipeThreshold) {
          if (!canSwipeRef()) {
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              friction: 4,
              useNativeDriver: false,
            }).start(() => setShowLimitAlert(true));
            return;
          }

          // Swipe left - Reject
          console.log('👈 SWIPE LEFT - Rejected:', profiles[currentIndexRef.current].name);
          consumeSwipeRef();
          animateSwipeOut('left');
        } else {
          // Return to original position
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  if (!currentProfile) {
    return (
      <View style={styles.container}>
        <Text style={styles.noMoreText}>No more profiles</Text>
      </View>
    );
  }

  const cardStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate: rotate },
    ],
    opacity: cardOpacity,
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Flare Background Effect (top-right radial gradient) */}
      <Flare />

      {/* Header Row: Toggle + Coin Balance */}
      <View style={styles.headerRow}>
        {/* For You / Nearby Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, activeTab === 'forYou' && styles.activeToggle]}
            onPress={() => setActiveTab('forYou')}
          >
            <Text style={[styles.toggleText, activeTab === 'forYou' && styles.activeToggleText]}>
              For You
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, activeTab === 'nearby' && styles.activeToggle]}
            onPress={() => setActiveTab('nearby')}
          >
            <Text style={[styles.toggleText, activeTab === 'nearby' && styles.activeToggleText]}>
              Nearby
            </Text>
          </TouchableOpacity>
        </View>

        {/* Compact Coin Balance */}
        <CoinBalance
          balance={coinBalance}
          variant="compact"
          onPress={() => navigation.navigate('Wallet')}
        />
      </View>

      {/* Swipe Status Indicator */}
      {swipeCount > 0 && (
        <View style={styles.swipeStatus}>
          {isFreeSwipesRemaining() ? (
            <Text style={styles.swipeStatusText}>
              {FREE_SWIPE_LIMIT - swipeCount} free swipes left
            </Text>
          ) : (
            <View style={styles.swipeStatusPaid}>
              <Icon name="heart" size={12} color="#FF007B" />
              <Text style={styles.swipeStatusText}>
                {SWIPE_COST} coins per swipe
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Profile Card */}
      <Animated.View
        style={[styles.cardContainer, cardStyle]}
        {...panResponder.panHandlers}
      >
        {/* Outer shadow wrapper (bottom-right shadow) */}
        <View style={styles.shadowWrapper}>
          <ImageBackground
            source={currentProfile.photo}
            style={styles.card}
            imageStyle={styles.cardImage}
            onLoad={() => console.log(`✅ Image loaded for ${currentProfile.name} (ID: ${currentProfile.id})`)}
            onError={(error) => console.error(`❌ Image failed to load for ${currentProfile.name}:`, error.nativeEvent)}
          >
          {/* Interest Tag */}
          <View style={styles.interestTag}>
            <Text style={styles.interestText}>{currentProfile.interest}</Text>
          </View>

          {/* Profile Info Overlay - Now at bottom with action buttons */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.9)']}
            style={styles.infoOverlay}
          >
            <View style={styles.bottomContainer}>
              {/* Left side - Profile info */}
              <View style={styles.infoContainer}>
                {/* Location */}
                <View style={styles.locationRow}>
                  <Icon name="location-outline" size={14} color="#FFF" />
                  <Text style={styles.locationText}>{currentProfile.location}</Text>
                </View>

                {/* Name and Age */}
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{currentProfile.name}, {currentProfile.age}</Text>
                  {currentProfile.verified && (
                    <Icon name="checkmark-circle" size={18} color="#00B4FF" />
                  )}
                </View>

                {/* Details */}
                <Text style={styles.details}>
                  {currentProfile.zodiac}  •  {currentProfile.distance}
                </Text>
              </View>

              {/* Right side - Action Buttons (Vertical) */}
              <View style={styles.actionButtons}>
                {/* Close/Reject */}
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={handleReject}
                >
                  <Icon name="close" size={22} color="#FFF" />
                </TouchableOpacity>

                {/* Message */}
                <TouchableOpacity
                  style={[styles.actionButton, styles.messageButton]}
                  onPress={handleMessage}
                >
                  <Icon name="chatbubble-outline" size={18} color="#FFF" />
                </TouchableOpacity>

                {/* Like */}
                <TouchableOpacity
                  style={[styles.actionButton, styles.likeButton]}
                  onPress={handleLike}
                >
                  <Icon name="heart" size={22} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
        </View>
      </Animated.View>

      {/* Swipe Limit Alert Modal */}
      {showLimitAlert && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Icon name="warning-outline" size={48} color="#FF007B" />
            </View>

            <Text style={styles.modalTitle}>Out of Coins</Text>
            <Text style={styles.modalMessage}>
              You've used all your free swipes for today. Each additional swipe costs {SWIPE_COST} coins and includes a full profile view.
            </Text>
            <Text style={styles.modalSubMessage}>
              Top up your wallet to keep swiping!
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.topUpButton]}
                onPress={() => {
                  setShowLimitAlert(false);
                  navigation.navigate('TopUp');
                }}
              >
                <Text style={styles.topUpButtonText}>Top Up Wallet</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.laterButton]}
                onPress={() => setShowLimitAlert(false)}
              >
                <Text style={styles.laterButtonText}>Maybe Later</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: TOP_SPACING,
    paddingHorizontal: SIDE_SPACING,
    paddingBottom: BOTTOM_SPACING,
  },
  cardContainer: {
    width: CARD_CONTAINER_WIDTH,
    height: CARD_CONTAINER_HEIGHT,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    // Second shadow: bottom-right white glow (increased)
    shadowColor: '#FFFFFF',
    shadowOffset: {
      width: 20,
      height: 20,
    },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 12,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    // First shadow: top-left white glow (increased)
    shadowColor: '#FFFFFF',
    shadowOffset: {
      width: -20,
      height: -20,
    },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    // Android elevation (approximation)
    elevation: 12,
  },
  cardImage: {
    borderRadius: 16,
  },
  swipeStatus: {
    alignSelf: 'center',
    marginBottom: 8,
    marginTop: -12,
  },
  swipeStatusPaid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  swipeStatusText: {
    fontFamily: FONTS.Medium,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 30,
    padding: 4,
  },
  toggleButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 25,
  },
  activeToggle: {
    backgroundColor: '#FF007B',
  },
  toggleText: {
    fontFamily: FONTS.Medium,
    fontSize: 14,
    color: '#888',
  },
  activeToggleText: {
    color: '#FFF',
  },
  interestTag: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  interestText: {
    fontFamily: FONTS.Medium,
    fontSize: 13,
    color: '#FFF',
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 24,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flex: 1,
    gap: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontFamily: FONTS.Body,
    fontSize: 13,
    color: '#FFF',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontFamily: FONTS.H2,
    fontSize: 28,
    color: '#FFF',
  },
  details: {
    fontFamily: FONTS.Body,
    fontSize: 13,
    color: '#DDD',
  },
  actionButtons: {
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#FFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  rejectButton: {
    // Plain white border with glassmorphism
  },
  messageButton: {
    // Plain white border with glassmorphism
  },
  likeButton: {
    // Plain white border with glassmorphism
  },
  noMoreText: {
    fontFamily: FONTS.H3,
    fontSize: 20,
    color: '#FFF',
  },
  // Modal styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 24,
    padding: 32,
    marginHorizontal: 24,
    maxWidth: 400,
    width: '90%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#FF007B',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: FONTS.H2,
    fontSize: 24,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalMessage: {
    fontFamily: FONTS.Body,
    fontSize: 16,
    color: '#DDD',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  modalSubMessage: {
    fontFamily: FONTS.Medium,
    fontSize: 15,
    color: '#FF007B',
    textAlign: 'center',
    marginBottom: 28,
  },
  modalButtons: {
    gap: 12,
  },
  modalButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
  },
  topUpButton: {
    backgroundColor: '#FF007B',
    shadowColor: '#FF007B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  topUpButtonText: {
    fontFamily: FONTS.Medium,
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
  laterButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  laterButtonText: {
    fontFamily: FONTS.Medium,
    fontSize: 16,
    color: '#FFF',
  },
});

export default DiscoveryScreen;
