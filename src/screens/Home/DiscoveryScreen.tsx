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

import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import { useUser } from '@context/UserContext';
import { matchingService } from '@services/api/matchingService';
import { loadDiscoverySettings } from '@screens/Home/DiscoverySettingsScreen';
import { devLog } from '@config/environment';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

// Responsive dimensions — scale from Figma 393px base
const SIDE_SPACING = Math.round(width * 0.058);  // ~23px on 393px
const CARD_CONTAINER_WIDTH = width - SIDE_SPACING * 2;
const CARD_WIDTH = CARD_CONTAINER_WIDTH - 20;     // 10px padding each side
const CARD_HEIGHT = Math.min(Math.round(height * 0.68), CARD_WIDTH * 1.6); // ~4:5 aspect, capped
const CARD_CONTAINER_HEIGHT = CARD_HEIGHT + 20;
const TOP_SPACING = Math.round(height * 0.065);   // Minimal gap above header row
const BOTTOM_SPACING = Math.round(height * 0.055); // ~49px on 900px height

// Mock profile data — used as fallback when API returns no profiles.
// isMock: true prevents real swipe API calls with fake IDs.
const MOCK_PROFILES = [
  // Male profiles (img1-img5)
  {
    id: 'mock_1',
    name: 'Chukwueze',
    age: 28,
    location: 'Awka, Anambra',
    distance: '5 miles away',
    zodiac: 'Leo',
    interest: 'Long-term relationship',
    verified: true,
    isMock: true,
    photo: require('@assets/images/img1.jpg'),
    bio: 'Software engineer by day, Afrobeats DJ by night. Big on travel and deep conversations over suya.',
    height: 178,
    weight: 75,
    gender: 'male',
    lookingFor: 'female',
    education: 'Bachelor\'s degree',
    interests: ['Music', 'Travel', 'Coding', 'Fitness', 'Cooking'],
  },
  {
    id: 'mock_2',
    name: 'David',
    age: 32,
    location: 'Maitama, Abuja',
    distance: '8 miles away',
    zodiac: 'Scorpio',
    interest: 'Casual dating',
    verified: false,
    isMock: true,
    photo: require('@assets/images/img2.jpg'),
    bio: 'Architect. I design spaces and sometimes people\'s moods too. Love good food and hate bad energy.',
    height: 182,
    weight: 82,
    gender: 'male',
    lookingFor: 'female',
    education: 'Master\'s degree',
    interests: ['Architecture', 'Art', 'Food', 'Photography', 'Movies'],
  },
  {
    id: 'mock_3',
    name: 'James',
    age: 26,
    location: 'Ikorodu, Lagos',
    distance: '3 miles away',
    zodiac: 'Gemini',
    interest: 'New friends',
    verified: true,
    isMock: true,
    photo: require('@assets/images/img3.jpg'),
    bio: 'Anime fanatic, gym rat, and part-time philosopher. Looking for someone who gets my vibe.',
    height: 175,
    weight: 70,
    gender: 'male',
    lookingFor: 'both',
    education: 'Some college',
    interests: ['Anime', 'Gym', 'Gaming', 'Reading', 'Hiking'],
  },
  {
    id: 'mock_4',
    name: 'Alex',
    age: 30,
    location: 'Lagos Island, Lagos',
    distance: '12 miles away',
    zodiac: 'Aries',
    interest: 'Something casual',
    verified: true,
    isMock: true,
    photo: require('@assets/images/img4.jpg'),
    bio: 'Finance bro who secretly writes poetry. Yes I know, surprising.',
    height: 180,
    weight: 78,
    gender: 'male',
    lookingFor: 'female',
    education: 'Bachelor\'s degree',
    interests: ['Finance', 'Poetry', 'Tennis', 'Jazz', 'Travel'],
  },
  {
    id: 'mock_5',
    name: 'Ryan',
    age: 27,
    location: 'Surulere, Lagos',
    distance: '6 miles away',
    zodiac: 'Taurus',
    interest: 'Long-term relationship',
    verified: false,
    isMock: true,
    photo: require('@assets/images/img5.jpg'),
    bio: 'Chef, foodie, and lover of everything spicy. My love language is cooking you jollof rice.',
    height: 172,
    weight: 68,
    gender: 'male',
    lookingFor: 'female',
    education: 'Trade school',
    interests: ['Cooking', 'Food', 'Football', 'Music', 'Nature'],
  },
  // Female profiles (img6-img10)
  {
    id: 'mock_6',
    name: 'Tokumbo',
    age: 25,
    location: 'Ibadan, Oyo',
    distance: '4 miles away',
    zodiac: 'Libra',
    interest: 'Serious relationship',
    verified: true,
    isMock: true,
    photo: require('@assets/images/img6.jpg'),
    bio: 'Medical student with a soft spot for rom-coms and plantain. Looking for someone serious about life.',
    height: 163,
    weight: 58,
    gender: 'female',
    lookingFor: 'male',
    education: 'Some college',
    interests: ['Medicine', 'Movies', 'Cooking', 'Reading', 'Yoga'],
  },
  {
    id: 'mock_7',
    name: 'Tems',
    age: 29,
    location: 'Ikeja, Lagos',
    distance: '7 miles away',
    zodiac: 'Cancer',
    interest: 'Casual fun',
    verified: true,
    isMock: true,
    photo: require('@assets/images/img7.jpg'),
    bio: 'Fashion designer. I believe style is a form of self-expression. Lover of art galleries and late nights.',
    height: 168,
    weight: 62,
    gender: 'female',
    lookingFor: 'male',
    education: 'Bachelor\'s degree',
    interests: ['Fashion', 'Art', 'Music', 'Dance', 'Travel'],
  },
  {
    id: 'mock_8',
    name: 'Adesewa',
    age: 24,
    location: 'Ilesha, Osun',
    distance: '2 miles away',
    zodiac: 'Pisces',
    interest: 'New friends',
    verified: false,
    isMock: true,
    photo: require('@assets/images/img8.jpg'),
    bio: 'Photographer who sees the world in golden hour. Coffee addict and bookworm.',
    height: 160,
    weight: 55,
    gender: 'female',
    lookingFor: 'male',
    education: 'Bachelor\'s degree',
    interests: ['Photography', 'Books', 'Coffee', 'Nature', 'Film'],
  },
  {
    id: 'mock_9',
    name: 'Fatima',
    age: 31,
    location: 'Yola, Adamawa',
    distance: '10 miles away',
    zodiac: 'Virgo',
    interest: 'Long-term relationship',
    verified: true,
    isMock: true,
    photo: require('@assets/images/img9.jpg'),
    bio: 'Lawyer by profession, adventurer by heart. I speak three languages and make the best basmati rice.',
    height: 165,
    weight: 60,
    gender: 'female',
    lookingFor: 'male',
    education: 'Master\'s degree',
    interests: ['Law', 'Languages', 'Travel', 'Cooking', 'Fitness'],
  },
  {
    id: 'mock_10',
    name: 'Cindarella',
    age: 26,
    location: 'Niamey, Niger',
    distance: '5 miles away',
    zodiac: 'Sagittarius',
    interest: 'Something casual',
    verified: true,
    isMock: true,
    photo: require('@assets/images/img10.jpg'),
    bio: 'Nurse with a wild sense of humour. I keep people alive for a living, you\'re welcome.',
    height: 162,
    weight: 57,
    gender: 'female',
    lookingFor: 'both',
    education: 'Bachelor\'s degree',
    interests: ['Healthcare', 'Comedy', 'Dancing', 'Hiking', 'Music'],
  },
];

import { useNavigation } from '@react-navigation/native';

const DiscoveryScreen = () => {
  const navigation = useNavigation<any>();
  const { coinBalance, spendCoins, swipeCount, incrementSwipeCount, freeSwipesRemaining, addMatch, updateProfile } = useUser();

  // Profiles state — defaults to shuffled mock, replaced by API data on mount
  const [profiles, setProfiles] = useState(() => {
    return [...MOCK_PROFILES].sort(() => Math.random() - 0.5);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'forYou' | 'nearby'>('forYou');
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const currentProfile = profiles[currentIndex];

  // Use ref to store current index for PanResponder (avoids stale closure)
  const currentIndexRef = useRef(currentIndex);
  const swipeCountRef = useRef(swipeCount);
  const coinBalanceRef = useRef(coinBalance);
  const profilesRef = useRef(profiles);

  // Mock user photo (use first profile image as placeholder for current user)
  const userPhoto = require('@assets/images/img3.jpg');

  // Fire real swipe API and handle match result
  // Skips API call for mock/fallback profiles (they have fake IDs like "mock_1")
  const fireSwipeApi = async (profile: typeof currentProfile, action: 'like' | 'pass') => {
    if ((profile as any).isMock) {
      devLog('🎭 Mock profile — skipping swipe API');
      return;
    }
    const profileId = String(profile.id);
    const result = await matchingService.swipe(profileId, action);

    if (action === 'like' && result.success && result.data?.isMatch) {
      // Real match from backend
      addMatch({
        id: result.data.matchId || String(Date.now()),
        profile: {
          id: profile.id,
          name: profile.name,
          age: profile.age,
          photo: profile.photo,
          location: profile.location,
        },
        matchedAt: new Date().toISOString(),
      });

      setTimeout(() => {
        navigation.navigate('Match', {
          matchedProfile: {
            name: profile.name,
            photo: profile.photo,
            age: profile.age,
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

  useEffect(() => {
    profilesRef.current = profiles;
  }, [profiles]);

  // Fetch profiles from API — extracted so the empty-state Refresh button can call it too
  const fetchProfiles = useCallback(async () => {
    setIsLoadingProfiles(true);

    // Update location first (awaited) — discover needs location set on backend before it works
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const [place] = await Location.reverseGeocodeAsync(loc.coords);
        const city = place?.city || place?.district || place?.subregion || 'Unknown';
        // Save city to context so profile screens show real location even if API fails
        updateProfile({ location: city });
        await matchingService.updateLocation(loc.coords.latitude, loc.coords.longitude, city);
        devLog('📍 Location updated:', city, loc.coords.latitude, loc.coords.longitude);
      } else {
        devLog('📍 Location permission denied');
      }
    } catch {
      devLog('📍 Location error — skipping location update');
    }

    // Load saved settings and pass maxDistance (km → metres for the API)
    const discoverySettings = await loadDiscoverySettings();
    const maxDistanceMetres = discoverySettings.globalMode
      ? undefined  // no cap when global mode is on
      : discoverySettings.maxDistance * 1000;
    const result = await matchingService.discoverProfiles(maxDistanceMetres, 20);
    if (result.success && Array.isArray(result.data) && result.data.length > 0) {
      const apiProfiles = result.data.map((p: any, idx: number) => ({
        id: p._id || p.id,
        name: p.fullname || p.name || 'Unknown',
        age: p.age || 0,
        location: p.city || (typeof p.location === 'string' ? p.location : p.location?.city) || 'Nearby',
        distance: p.distance ? `${Math.round(p.distance / 1000)} km away` : '',
        zodiac: p.zodiac || '',
        interest: p.goal || p.relationshipGoal || '',
        verified: p.verified || false,
        isMock: false,
        photo: p.photos?.[0]
          ? { uri: p.photos[0] }
          : MOCK_PROFILES[idx % MOCK_PROFILES.length].photo,
        // Extra fields for ProfileDetailScreen
        bio: p.bio || '',
        height: p.height,
        weight: p.weight,
        gender: p.gender || '',
        lookingFor: p.interestedIn || '',
        education: p.education || '',
        interests: (p.interests || []).map((i: any) => (typeof i === 'string' ? i : i.name || i.label || '')).filter(Boolean),
        photos: p.photos || [],
      }));
      devLog('✅ Discovery: Loaded', apiProfiles.length, 'profiles from API');
      setProfiles(apiProfiles);
      setCurrentIndex(0);
    } else {
      devLog('⚠️ Discovery: API returned no profiles, using mock data');
    }

    setIsLoadingProfiles(false);
  }, [updateProfile]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

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

  // Revenue plan: 10 free/day (men), 15 free/day (women)
  // TODO: Read gender from UserContext to set limit dynamically
  const FREE_SWIPE_LIMIT = 10;
  const SWIPE_COST = 5; // Per extra swipe (or 120 coins for 24hr Swipe Pass)

  const checkSwipeLimit = () => {
    incrementSwipeCount();
    const newCount = swipeCountRef.current + 1;

    // Free swipes still available
    if (newCount <= FREE_SWIPE_LIMIT) {
      return false;
    }

    // Paid swipes - try to deduct coins
    if (spendCoins(SWIPE_COST, 'swipe')) {
      return false;
    }

    // No coins left - show top-up alert
    setShowLimitAlert(true);
    return true;
  };

  // Navigate to profile detail view (uses refs to avoid stale closure in PanResponder)
  const handleViewProfile = () => {
    const profile = profiles[currentIndexRef.current];
    const isPaid = swipeCountRef.current >= FREE_SWIPE_LIMIT;
    navigation.navigate('ProfileDetail', {
      profile,
      isPaidView: isPaid,
    });
  };

  const handleReject = () => {
    if (checkSwipeLimit()) return;

    devLog('👈 Rejected:', currentProfile.name);
    fireSwipeApi(currentProfile, 'pass');
    setIsTransitioning(true);

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
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start(() => setIsTransitioning(false));
    });
  };

  const handleLike = () => {
    if (checkSwipeLimit()) return;

    devLog('👉 Liked:', currentProfile.name);
    fireSwipeApi(currentProfile, 'like');
    setIsTransitioning(true);

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
    devLog('🔄 Next profile:', nextIndex, '-', profiles[nextIndex]?.name);
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
    incrementSwipeCount();

    if (swipeCountRef.current + 1 > FREE_SWIPE_LIMIT) {
      spendCoins(SWIPE_COST, 'swipe');
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
      const nextIdx = currentIndexRef.current < profilesRef.current.length - 1 ? currentIndexRef.current + 1 : 0;
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
          devLog('👉 SWIPE RIGHT - Liked:', profilesRef.current[currentIndexRef.current].name);
          consumeSwipeRef();
          fireSwipeApi(profilesRef.current[currentIndexRef.current], 'like');
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
          devLog('👈 SWIPE LEFT - Rejected:', profilesRef.current[currentIndexRef.current].name);
          consumeSwipeRef();
          fireSwipeApi(profilesRef.current[currentIndexRef.current], 'pass');
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
        <StatusBar barStyle="light-content" />
        <Flare />

        {/* Keep header visible so user can still access wallet */}
        <View style={styles.headerRow}>
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
          <CoinBalance
            balance={coinBalance}
            variant="compact"
            onPress={() => navigation.navigate('Wallet')}
          />
        </View>

        {/* Empty State */}
        <View style={styles.emptyState}>
          <View style={styles.emptyIconRing}>
            <Icon name="heart-outline" size={52} color="#FF007B" />
          </View>
          <Text style={styles.emptyTitle}>You've seen everyone nearby</Text>
          <Text style={styles.emptyBody}>
            Try expanding your distance in settings, or check back later for new people.
          </Text>
          <TouchableOpacity
            style={[styles.emptyRefreshBtn, isLoadingProfiles && { opacity: 0.6 }]}
            onPress={fetchProfiles}
            activeOpacity={0.85}
            disabled={isLoadingProfiles}
          >
            <Icon name="refresh-outline" size={16} color="#FFF" />
            <Text style={styles.emptyRefreshText}>
              {isLoadingProfiles ? 'Loading...' : 'Refresh'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.emptySettingsBtn}
            onPress={() => navigation.navigate('DiscoverySettings')}
            activeOpacity={0.8}
          >
            <Text style={styles.emptySettingsText}>Change discovery settings</Text>
          </TouchableOpacity>
        </View>
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
          {freeSwipesRemaining > 0 ? (
            <Text style={styles.swipeStatusText}>
              {freeSwipesRemaining} free swipes left
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
            <Text style={styles.interestText}>{typeof currentProfile.interest === 'string' ? currentProfile.interest : ''}</Text>
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
              You've used all your free swipes for today. Each extra swipe costs {SWIPE_COST} coins, or grab a Swipe Pass for 120 coins to unlock unlimited swipes for 24 hours!
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
  // Empty state
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 12,
    marginTop: -40,
  },
  emptyIconRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: 'rgba(255, 0, 123, 0.25)',
    backgroundColor: 'rgba(255, 0, 123, 0.07)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 22,
    color: '#FFF',
    textAlign: 'center',
  },
  emptyBody: {
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 12,
  },
  emptyRefreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FF007B',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  emptyRefreshText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
    color: '#FFF',
  },
  emptySettingsBtn: {
    marginTop: 4,
  },
  emptySettingsText: {
    fontFamily: FONTS.Regular,
    fontSize: 13,
    color: '#888',
    textDecorationLine: 'underline',
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
