// src/screens/Home/ProfileDetailScreen.tsx

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';
import { useUser } from '@context/UserContext';
import { matchingService } from '@services/api/matchingService';
import { moderationService } from '@services/api/moderationService';
import { devLog } from '@config/environment';

const { width, height } = Dimensions.get('window');
const PHOTO_HEIGHT = height * 0.5;

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
  const { addMatch } = useUser();
  const [isLiking, setIsLiking] = useState(false);

  // Like / "Say Hi" handler — fires real swipe API
  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    const profileId = String(profile.id);
    devLog('❤️ ProfileDetail: Liking', profile.name);
    const result = await matchingService.swipe(profileId, 'like');

    if (result.success && result.data?.isMatch) {
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
      Alert.alert('It\'s a Match!', `You and ${profile.name} liked each other!`);
    } else if (result.success) {
      Alert.alert('Liked!', `You liked ${profile.name}`);
    } else {
      Alert.alert('Oops', result.message);
    }
    setIsLiking(false);
  };

  // Report user handler
  const handleReport = () => {
    Alert.alert('Report User', `Why are you reporting ${profile.name}?`, [
      { text: 'Inappropriate photos', onPress: () => submitReport('inappropriate_photos') },
      { text: 'Fake profile', onPress: () => submitReport('fake_profile') },
      { text: 'Harassment', onPress: () => submitReport('harassment') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const submitReport = async (reason: string) => {
    const result = await moderationService.reportUser(String(profile.id), reason);
    Alert.alert(result.success ? 'Report Submitted' : 'Error', result.message);
  };

  // Block user handler
  const handleBlock = () => {
    Alert.alert('Block User', `Are you sure you want to block ${profile.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Block', style: 'destructive', onPress: async () => {
          const result = await moderationService.blockUser(String(profile.id));
          if (result.success) {
            Alert.alert('Blocked', `${profile.name} has been blocked.`);
            navigation.goBack();
          } else {
            Alert.alert('Error', result.message);
          }
        },
      },
    ]);
  };

  // Default bio
  const bio = profile.bio || "Confident, easy-going with great sense of humor, hardworker, watches anime, romantic, enjoys meeting people and having meaningful conversations. My love language is food.";

  // Mock basics (placeholders - will come from backend)
  const basics = [
    { icon: '🏳️‍🌈', label: 'Bisexual' },
    { icon: '❤️', label: 'Single' },
    { icon: '📏', label: '155cm' },
    { icon: '⚖️', label: '75kg' },
    { icon: '♒', label: profile.zodiac },
    { icon: '🌍', label: 'Nigerian' },
  ];

  // Mock interests (placeholders)
  const interests = [
    { icon: '🏳️‍🌈', label: 'Bisexual' },
    { icon: '❤️', label: 'Single' },
    { icon: '📏', label: '155cm' },
    { icon: '⚖️', label: '75kg' },
    { icon: '♒', label: 'Aquarius' },
    { icon: '🌍', label: 'Nigerian' },
  ];

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

      {/* Back button */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Icon name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Main Photo */}
        <View style={styles.photoContainer}>
          <Image
            source={profile.photo}
            style={styles.mainPhoto}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)', '#000']}
            style={styles.photoGradient}
          />

          {/* Location & Name overlay */}
          <View style={styles.photoOverlay}>
            <View style={styles.locationRow}>
              <Icon name="location" size={14} color="#FFF" />
              <Text style={styles.locationText}>{profile.location}</Text>
            </View>
            <Text style={styles.name}>{profile.name}</Text>
          </View>
        </View>

        {/* Action Buttons Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.connectButton} activeOpacity={0.8} onPress={handleLike}>
            <Text style={styles.connectText}>Say Hi 👋</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCircle} activeOpacity={0.8} onPress={handleReport}>
            <Icon name="flag-outline" size={20} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionCircle, styles.heartCircle]} activeOpacity={0.8} onPress={handleLike}>
            <Icon name="heart" size={20} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCircle, styles.passCircle]}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <Icon name="close" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Block user option */}
        <TouchableOpacity style={styles.blockButton} activeOpacity={0.7} onPress={handleBlock}>
          <Icon name="ban-outline" size={16} color="#FF4444" />
          <Text style={styles.blockButtonText}>Block this user</Text>
        </TouchableOpacity>

        {/* Bio Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bio</Text>
          <Text style={styles.bioText}>{bio}</Text>
        </View>

        {/* My Basics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Basics</Text>
          <View style={styles.chipGrid}>
            {basics.map((item, index) => (
              <View key={index} style={styles.chip}>
                <Text style={styles.chipEmoji}>{item.icon}</Text>
                <Text style={styles.chipText}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.chipGrid}>
            {interests.map((item, index) => (
              <View key={index} style={styles.chip}>
                <Text style={styles.chipEmoji}>{item.icon}</Text>
                <Text style={styles.chipText}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Paid view badge */}
        {isPaidView && (
          <View style={styles.paidBadge}>
            <Icon name="diamond-outline" size={16} color="#FFD700" />
            <Text style={styles.paidBadgeText}>Premium profile view</Text>
          </View>
        )}
      </Animated.ScrollView>
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
    left: 16,
    zIndex: 10,
  },
  backButton: {
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
    height: PHOTO_HEIGHT * 0.45,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  locationText: {
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#DDD',
  },
  name: {
    fontFamily: FONTS.Bold,
    fontSize: 32,
    color: '#FFF',
  },
  // Action Row
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  connectButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  connectText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 14,
    color: '#FFF',
  },
  actionCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartCircle: {
    backgroundColor: '#FF007B',
    borderColor: '#FF007B',
  },
  passCircle: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  // Sections
  section: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  sectionTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    color: '#FFF',
    marginBottom: 14,
  },
  bioText: {
    fontFamily: FONTS.Regular,
    fontSize: 15,
    color: '#BBB',
    lineHeight: 24,
  },
  // Chips
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  chipEmoji: {
    fontSize: 14,
  },
  chipText: {
    fontFamily: FONTS.Medium,
    fontSize: 13,
    color: '#DDD',
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
    marginBottom: 20,
  },
  paidBadgeText: {
    fontFamily: FONTS.Medium,
    fontSize: 12,
    color: '#FFD700',
  },
  blockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
  },
  blockButtonText: {
    fontFamily: FONTS.Medium,
    fontSize: 13,
    color: '#FF4444',
  },
});

export default ProfileDetailScreen;
