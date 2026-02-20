// src/screens/Home/MatchScreen.tsx

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';

const { width, height } = Dimensions.get('window');

// Rounded portrait photo component - better for showing faces than circles
const PortraitPhoto = ({
  source,
  style,
  photoWidth = 150,
}: {
  source: any;
  style?: any;
  photoWidth?: number;
}) => {
  const photoHeight = photoWidth * 1.3; // Portrait aspect ratio
  const borderRadius = photoWidth * 0.22; // Soft rounded corners

  return (
    <View style={[styles.portraitContainer, { width: photoWidth, height: photoHeight }, style]}>
      <View
        style={[
          styles.photoFrame,
          {
            width: photoWidth,
            height: photoHeight,
            borderRadius: borderRadius,
          },
        ]}
      >
        <Image
          source={source}
          style={{
            width: photoWidth - 8,
            height: photoHeight - 8,
            borderRadius: borderRadius - 2,
          }}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

interface MatchScreenProps {
  route: {
    params: {
      matchedProfile: {
        name: string;
        photo: any;
        age: number;
      };
      userPhoto: any;
    };
  };
  navigation: any;
}

const MatchScreen: React.FC<MatchScreenProps> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { matchedProfile, userPhoto } = route.params;

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const leftPhotoAnim = useRef(new Animated.Value(-width)).current;
  const rightPhotoAnim = useRef(new Animated.Value(width)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonSlideAnim = useRef(new Animated.Value(50)).current;
  const heart1Anim = useRef(new Animated.Value(0)).current;
  const heart2Anim = useRef(new Animated.Value(0)).current;
  const heart3Anim = useRef(new Animated.Value(0)).current;
  const heart4Anim = useRef(new Animated.Value(0)).current;
  const heart5Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Orchestrated entrance animation
    Animated.sequence([
      // Fade in background
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Slide in photos from sides
      Animated.parallel([
        Animated.spring(leftPhotoAnim, {
          toValue: 0,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(rightPhotoAnim, {
          toValue: 0,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      // Pop in center heart
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
      // Fade in text and buttons
      Animated.parallel([
        Animated.timing(textFadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(buttonSlideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Floating hearts animation (looping)
    const animateHeart = (anim: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateHeart(heart1Anim, 0);
    animateHeart(heart2Anim, 600);
    animateHeart(heart3Anim, 1200);
    animateHeart(heart4Anim, 1800);
    animateHeart(heart5Anim, 2400);
  }, []);

  const floatingHeartStyle = (anim: Animated.Value, startX: number, drift: number = 30) => ({
    opacity: anim.interpolate({
      inputRange: [0, 0.1, 0.6, 1],
      outputRange: [0, 1, 0.8, 0],
    }),
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -height * 0.45],
        }),
      },
      {
        translateX: anim.interpolate({
          inputRange: [0, 0.25, 0.5, 0.75, 1],
          outputRange: [startX, startX + drift, startX - drift * 0.5, startX + drift * 0.3, startX - drift * 0.2],
        }),
      },
      {
        scale: anim.interpolate({
          inputRange: [0, 0.3, 0.7, 1],
          outputRange: [0.3, 1.1, 0.8, 0.4],
        }),
      },
      {
        rotate: anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: ['0deg', `${drift > 0 ? 15 : -15}deg`, '0deg'],
        }),
      },
    ],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Pink gradient at top */}
      <LinearGradient
        colors={['#FFB6C1', '#FFC0CB', '#FFE4E9', '#FFF5F7', '#FFFFFF']}
        style={styles.topGradient}
      />

      {/* Floating Hearts - start from mid-screen and float up */}
      <View style={styles.floatingHeartsContainer}>
        <Animated.View style={[styles.floatingHeart, floatingHeartStyle(heart1Anim, width * 0.1, 25)]}>
          <Icon name="heart" size={24} color="#FF007B" />
        </Animated.View>
        <Animated.View style={[styles.floatingHeart, floatingHeartStyle(heart2Anim, width * 0.35, -20)]}>
          <Icon name="heart" size={18} color="#FF69B4" />
        </Animated.View>
        <Animated.View style={[styles.floatingHeart, floatingHeartStyle(heart3Anim, width * 0.65, 30)]}>
          <Icon name="heart" size={22} color="#FF007B" />
        </Animated.View>
        <Animated.View style={[styles.floatingHeart, floatingHeartStyle(heart4Anim, width * 0.5, -25)]}>
          <Icon name="heart" size={16} color="#FFB6C1" />
        </Animated.View>
        <Animated.View style={[styles.floatingHeart, floatingHeartStyle(heart5Anim, width * 0.8, 20)]}>
          <Icon name="heart" size={14} color="#FF69B4" />
        </Animated.View>
      </View>

      {/* Photos Section - lowered so hearts float above */}
      <Animated.View style={[styles.photosContainer, { opacity: fadeAnim }]}>
        {/* Left photo (user) */}
        <Animated.View
          style={[
            styles.leftPhoto,
            { transform: [{ translateX: leftPhotoAnim }] },
          ]}
        >
          <PortraitPhoto source={userPhoto} photoWidth={140} />
        </Animated.View>

        {/* Right photo (match) */}
        <Animated.View
          style={[
            styles.rightPhoto,
            { transform: [{ translateX: rightPhotoAnim }] },
          ]}
        >
          <PortraitPhoto source={matchedProfile.photo} photoWidth={140} />
        </Animated.View>

        {/* Center heart icon */}
        <Animated.View
          style={[
            styles.centerHeart,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.centerHeartCircle}>
            <Icon name="heart" size={20} color="#FF007B" />
          </View>
        </Animated.View>
      </Animated.View>

      {/* Match Badge */}
      <Animated.View style={[styles.matchBadge, { opacity: textFadeAnim }]}>
        <Text style={styles.matchBadgeLabel}>Match</Text>
        <Text style={styles.matchBadgePercent}>100%</Text>
      </Animated.View>

      {/* Text Content */}
      <Animated.View style={[styles.textContent, { opacity: textFadeAnim }]}>
        <Text style={styles.matchTitle}>Its a Match!!!</Text>
        <Text style={styles.matchDescription}>
          {matchedProfile.name} ticked all your boxes and more! Begin a conversation with them and they just might be your twin ray you've been waiting for.
        </Text>
      </Animated.View>

      {/* Action Buttons */}
      <Animated.View
        style={[
          styles.actionsContainer,
          {
            opacity: textFadeAnim,
            transform: [{ translateY: buttonSlideAnim }],
            paddingBottom: insets.bottom + 30,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.goBack();
            navigation.navigate('ChatConversation', {
              chatId: route.params.matchedProfile?.id || Date.now(),
              name: matchedProfile.name,
              photo: matchedProfile.photo,
              age: matchedProfile.age,
              location: '',
              isNewMatch: true,
            });
          }}
        >
          <LinearGradient
            colors={['#FF007B', '#FF4458']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Begin a conversation</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryButtonText}>Maybe later</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
  },
  // Floating hearts - originate from mid-screen (photo area) and float up
  floatingHeartsContainer: {
    position: 'absolute',
    top: height * 0.35,
    left: 0,
    right: 0,
    height: height * 0.5,
    zIndex: 5,
    pointerEvents: 'none',
  },
  floatingHeart: {
    position: 'absolute',
    top: 0,
  },
  // Photos
  photosContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.22,
    paddingHorizontal: 20,
  },
  leftPhoto: {
    zIndex: 1,
    marginRight: -16,
  },
  rightPhoto: {
    zIndex: 2,
    marginLeft: -16,
  },
  // Portrait photo
  portraitContainer: {
    alignItems: 'center',
  },
  photoFrame: {
    borderWidth: 3,
    borderColor: '#FF007B',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    shadowColor: '#FF007B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  centerHeart: {
    position: 'absolute',
    zIndex: 10,
    bottom: -10,
  },
  centerHeartCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF007B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#FFE4E9',
  },
  // Match badge
  matchBadge: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 20,
    gap: 8,
    alignItems: 'center',
  },
  matchBadgeLabel: {
    fontFamily: FONTS.Medium,
    fontSize: 13,
    color: '#FFF',
  },
  matchBadgePercent: {
    fontFamily: FONTS.SemiBold,
    fontSize: 13,
    color: '#FF007B',
  },
  // Text
  textContent: {
    paddingHorizontal: 32,
    marginTop: 24,
    alignItems: 'center',
  },
  matchTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 32,
    color: '#1A1A1A',
    marginBottom: 16,
    textAlign: 'center',
  },
  matchDescription: {
    fontFamily: FONTS.Regular,
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
  },
  // Actions
  actionsContainer: {
    marginTop: 'auto',
    paddingHorizontal: 24,
  },
  primaryButton: {
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    color: '#FFF',
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontFamily: FONTS.Medium,
    fontSize: 15,
    color: '#1A1A1A',
  },
});

export default MatchScreen;
