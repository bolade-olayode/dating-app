// src/screens/Home/ExploreCategoryScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';
import Flare from '@components/ui/Flare';
import { matchingService } from '@services/api/matchingService';
import { devLog } from '@config/environment';

const { width } = Dimensions.get('window');
const PADDING = 20;
const GRID_GAP = 12;
const CARD_WIDTH = (width - PADDING * 2 - GRID_GAP) / 2;

// ─── Route params ────────────────────────────────────────────

type ExploreCategoryParams = {
  ExploreCategory: {
    categoryId: string;
    categoryTitle: string;
    memberCount: string;
    type: 'interest' | 'relationship';
  };
};

// ─── Mock profile data ──────────────────────────────────────

interface ExploreProfile {
  id: string | number;
  name: string;
  age: number;
  zodiac: string;
  location: string;
  photo: any;
  isOnline: boolean;
  // Extra fields for ProfileDetailScreen
  bio?: string;
  height?: number;
  weight?: number;
  gender?: string;
  lookingFor?: string;
  education?: string;
  interests?: string[];
  photos?: string[];
  interest?: string;
}

const MOCK_PROFILES: ExploreProfile[] = [
  { id: 1, name: 'Ndufreke Kelly', age: 26, zodiac: 'Aquarius', location: 'Russia', photo: require('../../assets/images/img1.jpg'), isOnline: true },
  { id: 2, name: 'Lionel Michaelson', age: 26, zodiac: 'Aquarius', location: 'Russia', photo: require('../../assets/images/img2.jpg'), isOnline: true },
  { id: 3, name: 'Lucian Deluc', age: 24, zodiac: 'Gemini', location: 'France', photo: require('../../assets/images/img3.jpg'), isOnline: false },
  { id: 4, name: 'Khalen Amnell', age: 28, zodiac: 'Leo', location: 'Canada', photo: require('../../assets/images/img4.jpg'), isOnline: true },
  { id: 5, name: 'Amara Osei', age: 23, zodiac: 'Pisces', location: 'Ghana', photo: require('../../assets/images/img5.jpg'), isOnline: false },
  { id: 6, name: 'Yuki Tanaka', age: 27, zodiac: 'Virgo', location: 'Japan', photo: require('../../assets/images/img6.jpg'), isOnline: true },
  { id: 7, name: 'Sofia Reyes', age: 25, zodiac: 'Scorpio', location: 'Mexico', photo: require('../../assets/images/img7.jpg'), isOnline: false },
  { id: 8, name: 'Dami Adeyemo', age: 29, zodiac: 'Capricorn', location: 'Nigeria', photo: require('../../assets/images/img8.jpg'), isOnline: true },
];

const ExploreCategoryScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<ExploreCategoryParams, 'ExploreCategory'>>();
  const { categoryTitle, memberCount } = route.params;

  const [profiles, setProfiles] = useState<ExploreProfile[]>(MOCK_PROFILES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoading(true);
      const result = await matchingService.discoverProfiles(50000, 20);
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        const mapped: ExploreProfile[] = result.data.map((p: any, idx: number) => ({
          id: p._id || p.id || idx,
          name: p.fullname || p.name || 'Unknown',
          age: p.age || 0,
          zodiac: p.zodiac || '',
          location: p.city || p.location?.city || '',
          photo: p.photos?.[0]
            ? { uri: p.photos[0] }
            : MOCK_PROFILES[idx % MOCK_PROFILES.length].photo,
          isOnline: false,
          // Extra fields for ProfileDetailScreen
          bio: p.bio || '',
          height: p.height,
          weight: p.weight,
          gender: p.gender || '',
          lookingFor: p.interestedIn || '',
          education: p.education || '',
          interest: p.goal || p.relationshipGoal || '',
          interests: (p.interests || []).map((i: any) => (typeof i === 'string' ? i : i.name || i.label || '')).filter(Boolean),
          photos: p.photos || [],
        }));
        devLog('✅ ExploreCategory: Loaded', mapped.length, 'profiles from API');
        setProfiles(mapped);
      }
      setIsLoading(false);
    };
    fetchProfiles();
  }, []);

  // ─── Profile Card ────────────────────────────────────────

  const renderProfileCard = (profile: ExploreProfile) => (
    <TouchableOpacity
      key={profile.id}
      style={styles.profileCard}
      activeOpacity={0.85}
      onPress={() =>
        navigation.navigate('ProfileDetail', {
          profile: {
            id: profile.id,
            name: profile.name,
            age: profile.age,
            photo: profile.photo,
            location: profile.location,
            zodiac: profile.zodiac,
            bio: profile.bio,
            height: profile.height,
            weight: profile.weight,
            gender: profile.gender,
            lookingFor: profile.lookingFor,
            education: profile.education,
            interest: profile.interest,
            interests: profile.interests,
            photos: profile.photos,
          },
        })
      }
    >
      <Image source={profile.photo} style={styles.profileImage} />

      {/* Heart icon */}
      <TouchableOpacity style={styles.heartButton} activeOpacity={0.7}>
        <Icon name="heart-outline" size={18} color="#FFF" />
      </TouchableOpacity>

      {/* Online indicator */}
      {profile.isOnline && <View style={styles.onlineIndicator} />}

      {/* Info overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.85)']}
        style={styles.profileOverlay}
      >
        <Text style={styles.profileName} numberOfLines={1}>
          {profile.name}
        </Text>
        <Text style={styles.profileMeta}>
          {profile.age} y.o _ {profile.zodiac} _ {profile.location}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  // ─── Top Profile Avatar ──────────────────────────────────

  const renderTopProfile = (profile: ExploreProfile) => (
    <TouchableOpacity
      key={profile.id}
      style={styles.topProfileItem}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('ProfileDetail', {
          profile: {
            id: profile.id,
            name: profile.name,
            age: profile.age,
            photo: profile.photo,
            location: profile.location,
            zodiac: profile.zodiac,
            bio: profile.bio,
            height: profile.height,
            weight: profile.weight,
            gender: profile.gender,
            lookingFor: profile.lookingFor,
            education: profile.education,
            interest: profile.interest,
            interests: profile.interests,
            photos: profile.photos,
          },
        })
      }
    >
      <Image source={profile.photo} style={styles.topProfileImage} />
      {profile.isOnline && <View style={styles.topOnlineIndicator} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Flare />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 10, paddingBottom: 40 },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <View style={styles.backButton}>
              <Icon name="chevron-back" size={22} color="#FFF" />
            </View>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{categoryTitle}</Text>
            <Text style={styles.headerSubtitle}>{memberCount} profiles</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <View style={styles.searchButton}>
              <Icon name="search-outline" size={20} color="#FFF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Top Profiles */}
        <Text style={styles.sectionLabel}>Top profiles</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topProfilesRow}
        >
          {profiles.slice(0, 5).map(renderTopProfile)}
        </ScrollView>

        {/* Profile Grid (2 columns) */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#FF007B" style={{ marginTop: 40 }} />
        ) : (
        <View style={styles.profileGrid}>
          {profiles.map(renderProfileCard)}
        </View>
        )}
      </ScrollView>
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingHorizontal: PADDING,
  },

  // ─── Header ────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    marginLeft: 14,
  },
  headerTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 22,
    color: '#FFF',
  },
  headerSubtitle: {
    fontFamily: FONTS.Regular,
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  searchButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ─── Top profiles (horizontal scroll) ──────────────────
  sectionLabel: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    color: '#FFF',
    marginBottom: 14,
  },
  topProfilesRow: {
    gap: 12,
    paddingBottom: 24,
  },
  topProfileItem: {
    position: 'relative',
  },
  topProfileImage: {
    width: 72,
    height: 72,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 0, 123, 0.4)',
  },
  topOnlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CD964',
    borderWidth: 2,
    borderColor: '#000',
  },

  // ─── Profile grid (2 columns) ─────────────────────────
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  profileCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.35,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CD964',
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.3)',
  },
  profileOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    paddingTop: 40,
  },
  profileName: {
    fontFamily: FONTS.SemiBold,
    fontSize: 14,
    color: '#FFF',
    marginBottom: 2,
  },
  profileMeta: {
    fontFamily: FONTS.Regular,
    fontSize: 11,
    color: '#BBB',
  },
});

export default ExploreCategoryScreen;
