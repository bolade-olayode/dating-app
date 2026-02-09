// src/screens/Home/ProfileDetailScreen.tsx

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Image,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';

const { width, height } = Dimensions.get('window');
const PHOTO_HEIGHT = height * 0.55;

interface ProfileDetailProps {
  route: {
    params: {
      profile: {
        id: number;
        name: string;
        age: number;
        location: string;
        distance: string;
        zodiac: string;
        interest: string;
        verified: boolean;
        photo: any;
        bio?: string;
        height?: string;
        education?: string;
        job?: string;
        interests?: string[];
      };
      isPaidView?: boolean;
    };
  };
  navigation: any;
}

const ProfileDetailScreen: React.FC<ProfileDetailProps> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { profile, isPaidView } = route.params;
  const scrollY = useRef(new Animated.Value(0)).current;

  // Default bio and interests if not provided
  const bio = profile.bio || "Living life one adventure at a time. Love meeting new people, trying new foods, and exploring new places. Looking for someone who can keep up!";
  const interests = profile.interests || ['Travel', 'Music', 'Cooking', 'Fitness', 'Movies', 'Photography'];

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, PHOTO_HEIGHT - 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Animated header background */}
      <Animated.View style={[styles.headerBg, { opacity: headerOpacity }]}>
        <View style={[styles.headerBgInner, { paddingTop: insets.top }]} />
      </Animated.View>

      {/* Fixed header buttons */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Icon name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerButton} activeOpacity={0.8}>
          <Icon name="ellipsis-horizontal" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Main Photo */}
        <View style={styles.photoContainer}>
          <Image
            source={profile.photo}
            style={styles.mainPhoto}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)', '#000']}
            style={styles.photoGradient}
          />

          {/* Name overlay on photo */}
          <View style={styles.photoOverlay}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{profile.name}, {profile.age}</Text>
              {profile.verified && (
                <Icon name="checkmark-circle" size={22} color="#00B4FF" />
              )}
            </View>
            <View style={styles.locationRow}>
              <Icon name="location-outline" size={16} color="#FFF" />
              <Text style={styles.locationText}>{profile.location}</Text>
              <Text style={styles.distanceText}> · {profile.distance}</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Quick Info Pills */}
          <View style={styles.quickInfo}>
            <View style={styles.infoPill}>
              <Icon name="star-outline" size={14} color="#FF007B" />
              <Text style={styles.infoPillText}>{profile.zodiac}</Text>
            </View>
            <View style={styles.infoPill}>
              <Icon name="heart-outline" size={14} color="#FF007B" />
              <Text style={styles.infoPillText}>{profile.interest}</Text>
            </View>
            {profile.height && (
              <View style={styles.infoPill}>
                <Icon name="resize-outline" size={14} color="#FF007B" />
                <Text style={styles.infoPillText}>{profile.height}</Text>
              </View>
            )}
            {profile.education && (
              <View style={styles.infoPill}>
                <Icon name="school-outline" size={14} color="#FF007B" />
                <Text style={styles.infoPillText}>{profile.education}</Text>
              </View>
            )}
            {profile.job && (
              <View style={styles.infoPill}>
                <Icon name="briefcase-outline" size={14} color="#FF007B" />
                <Text style={styles.infoPillText}>{profile.job}</Text>
              </View>
            )}
          </View>

          {/* Bio */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About me</Text>
            <Text style={styles.bioText}>{bio}</Text>
          </View>

          {/* Interests */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.interestsGrid}>
              {interests.map((item, index) => (
                <View key={index} style={styles.interestChip}>
                  <Text style={styles.interestChipText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Paid view badge */}
          {isPaidView && (
            <View style={styles.paidBadge}>
              <Icon name="diamond-outline" size={16} color="#FFD700" />
              <Text style={styles.paidBadgeText}>Premium profile view · 3 coins</Text>
            </View>
          )}
        </View>
      </Animated.ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.actionBar, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.rejectBtn]}
          onPress={() => {
            navigation.goBack();
            // The DiscoveryScreen will handle the actual reject
          }}
          activeOpacity={0.8}
        >
          <Icon name="close" size={28} color="#FF4458" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.likeBtn]}
          onPress={() => {
            navigation.goBack();
            // The DiscoveryScreen will handle the actual like
          }}
          activeOpacity={0.8}
        >
          <Icon name="heart" size={28} color="#FFF" />
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
  // Header
  headerBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9,
    height: 100,
  },
  headerBgInner: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Photo
  photoContainer: {
    width: width,
    height: PHOTO_HEIGHT,
  },
  mainPhoto: {
    width: '100%',
    height: '100%',
  },
  photoGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: PHOTO_HEIGHT * 0.5,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  name: {
    fontFamily: FONTS.Bold,
    fontSize: 28,
    color: '#FFF',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#DDD',
    marginLeft: 4,
  },
  distanceText: {
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#999',
  },
  // Content
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  // Quick Info
  quickInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 28,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoPillText: {
    fontFamily: FONTS.Medium,
    fontSize: 13,
    color: '#DDD',
  },
  // Sections
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: 18,
    color: '#FFF',
    marginBottom: 12,
  },
  bioText: {
    fontFamily: FONTS.Regular,
    fontSize: 15,
    color: '#BBB',
    lineHeight: 24,
  },
  // Interests
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestChip: {
    backgroundColor: 'rgba(255, 0, 123, 0.12)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 0, 123, 0.3)',
  },
  interestChipText: {
    fontFamily: FONTS.Medium,
    fontSize: 13,
    color: '#FF007B',
  },
  // Paid badge
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  paidBadgeText: {
    fontFamily: FONTS.Medium,
    fontSize: 12,
    color: '#FFD700',
  },
  // Action Bar
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingTop: 16,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  actionBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  rejectBtn: {
    borderColor: '#FF4458',
    backgroundColor: 'rgba(255, 68, 88, 0.1)',
  },
  likeBtn: {
    borderColor: '#FF007B',
    backgroundColor: '#FF007B',
  },
});

export default ProfileDetailScreen;
