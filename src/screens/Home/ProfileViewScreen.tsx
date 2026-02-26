// src/screens/Home/ProfileViewScreen.tsx

import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';
import Flare from '@components/ui/Flare';
import { useUser } from '@context/UserContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_ITEM_WIDTH = SCREEN_WIDTH - 40; // 20px padding each side


// Mock profile (same as MeScreen, shared until context has real data)
const MOCK_PROFILE = {
  name: 'BaaleofUI',
  age: 35,
  location: 'Ontario, Japan',
  photo: require('../../assets/images/opuehbckgdimg2.png'),
  bio: 'Confident, easy-going with great sense of humor, hardworker, watches anime, romantic, enjoys meeting people and having meaningful conversations. My love language is food.',
  interests: ['Sushi', 'Basketball', 'Galleries', 'Coffee', 'Theatres', 'Concerts'],
  photos: [
    require('../../assets/images/opuehbckgdimg2.png'),
    require('../../assets/images/opuehbckgdimg.jpg'),
    require('../../assets/images/opuehbckgdimg3.png'),
  ],
  gender: 'Female',
  lookingFor: 'Straight',
  relationshipGoal: 'Long term partner',
  basics: {
    status: 'Single',
    weight: '75kg',
    zodiac: 'Aquarius',
    nationality: 'Nigerian',
    height: '155cm',
    education: 'BsC degree',
    employment: 'Employed',
  },
  email: 'baaleofui@gmail.com',
  phone: '00000000009',
  prompts: [
    { question: "My ideal weekend involves...", answer: "Good food, anime, and vibes" },
    { question: "I'm passionate about...", answer: "Design and meaningful connections" },
  ],
  verified: false,
};

const TABS = ['Personal info', 'About me', 'Media'] as const;
type TabType = typeof TABS[number];

const ProfileViewScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { profile: contextProfile } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>('Personal info');

  // Merge context profile over mock defaults
  const profile = useMemo(() => {
    if (!contextProfile) return MOCK_PROFILE;
    return {
      ...MOCK_PROFILE,
      name: contextProfile.name || '',
      age: contextProfile.age || (contextProfile.dateOfBirth ? (() => {
        const dob = new Date(contextProfile.dateOfBirth!);
        const today = new Date();
        let a = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) a--;
        return a;
      })() : undefined),
      location: contextProfile.location || '',
      bio: contextProfile.bio || '',
      interests: contextProfile.interests?.length ? contextProfile.interests : [],
      photos: contextProfile.photos?.length ? contextProfile.photos : [],
      photo: contextProfile.photos?.[0] ? { uri: contextProfile.photos[0] } : MOCK_PROFILE.photo,
      gender: contextProfile.gender || '',
      lookingFor: contextProfile.lookingFor || '',
      relationshipGoal: contextProfile.relationshipGoal || '',
      basics: {
        status: '',
        weight: contextProfile.weight || '',
        zodiac: '',
        nationality: '',
        height: contextProfile.height || '',
        education: contextProfile.education || '',
        employment: '',
      },
      email: contextProfile.email || '',
      phone: contextProfile.phoneNumber || '',
      prompts: contextProfile.prompts || [],
      verified: contextProfile.verified ?? false,
    };
  }, [contextProfile]);

  // ─── Personal Info Tab ─────────────────────────────────

  const renderPersonalInfo = () => (
    <View style={styles.tabContent}>
      {/* Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name</Text>
          <Text style={styles.infoValue}>{profile.name}</Text>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{profile.email}</Text>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone number</Text>
          <Text style={styles.infoValue}>{profile.phone}</Text>
        </View>
      </View>

      {/* Gender / Interested In Card */}
      <View style={styles.dualCard}>
        <View style={styles.dualCardHalf}>
          <Text style={styles.infoLabel}>Gender</Text>
          <Text style={styles.infoValue}>{profile.gender}</Text>
        </View>
        <View style={styles.dualCardHalf}>
          <Text style={styles.infoLabel}>Interested in</Text>
          <Text style={styles.infoValue}>{profile.lookingFor}</Text>
        </View>
      </View>
    </View>
  );

  // ─── About Me Tab ──────────────────────────────────────

  const renderAboutMe = () => (
    <View style={styles.tabContent}>
      {/* Bio Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Bio</Text>
        <Text style={styles.bioText}>{profile.bio || 'No bio yet'}</Text>
      </View>

      {/* Weight / Height */}
      <View style={styles.dualCard}>
        <View style={styles.dualCardHalf}>
          <Text style={styles.infoLabel}>Weight</Text>
          <Text style={styles.infoValue}>{profile.basics.weight || '—'}</Text>
        </View>
        <View style={styles.dualCardHalf}>
          <Text style={styles.infoLabel}>Height</Text>
          <Text style={styles.infoValue}>{profile.basics.height || '—'}</Text>
        </View>
      </View>

      {/* My Basics */}
      <Text style={styles.sectionTitle}>My Basics</Text>
      <View style={styles.chipsContainer}>
        {profile.relationshipGoal && (
          <View style={styles.chip}>
            <Icon name="diamond-outline" size={14} color="#FFF" />
            <Text style={styles.chipText}>{profile.relationshipGoal}</Text>
          </View>
        )}
        {profile.basics.status && (
          <View style={styles.chip}>
            <Icon name="heart" size={14} color="#FF007B" />
            <Text style={styles.chipText}>{profile.basics.status}</Text>
          </View>
        )}
        {profile.basics.weight && (
          <View style={styles.chip}>
            <Icon name="fitness-outline" size={14} color="#FFF" />
            <Text style={styles.chipText}>{profile.basics.weight}</Text>
          </View>
        )}
        {profile.basics.zodiac && (
          <View style={styles.chip}>
            <Icon name="sparkles-outline" size={14} color="#FFF" />
            <Text style={styles.chipText}>{profile.basics.zodiac}</Text>
          </View>
        )}
        {profile.basics.nationality && (
          <View style={styles.chip}>
            <Icon name="flag-outline" size={14} color="#FFF" />
            <Text style={styles.chipText}>{profile.basics.nationality}</Text>
          </View>
        )}
        {profile.basics.height && (
          <View style={styles.chip}>
            <Icon name="resize-outline" size={14} color="#FFF" />
            <Text style={styles.chipText}>{profile.basics.height}</Text>
          </View>
        )}
        {profile.basics.education && (
          <View style={styles.chip}>
            <Icon name="school-outline" size={14} color="#FFF" />
            <Text style={styles.chipText}>{profile.basics.education}</Text>
          </View>
        )}
        {profile.basics.employment && (
          <View style={styles.chip}>
            <Icon name="briefcase-outline" size={14} color="#FFF" />
            <Text style={styles.chipText}>{profile.basics.employment}</Text>
          </View>
        )}
      </View>

      {/* Interests */}
      {(profile.interests || []).length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.chipsContainer}>
            {(profile.interests || []).map((interest, idx) => (
              <View key={idx} style={styles.chip}>
                <Text style={styles.chipText}>{typeof interest === 'string' ? interest : ''}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Prompts */}
      {profile.prompts && profile.prompts.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Prompts</Text>
          {profile.prompts.map((prompt, idx) => (
            <View key={idx} style={styles.promptCard}>
              <Text style={styles.promptQuestion}>{prompt.question}</Text>
              <Text style={styles.promptAnswer}>{prompt.answer}</Text>
            </View>
          ))}
        </>
      )}
    </View>
  );

  // ─── Media Tab — horizontal photo carousel ─────────────

  const [carouselIndex, setCarouselIndex] = useState(0);

  const renderMedia = () => {
    const photos = (profile.photos || []).filter(Boolean);

    if (photos.length === 0) {
      return (
        <View style={styles.tabContent}>
          <View style={styles.emptyPhotos}>
            <Icon name="images-outline" size={40} color="#444" />
            <Text style={styles.emptyPhotosText}>No photos yet</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.tabContent}>
        <FlatList
          data={photos}
          keyExtractor={(_, i) => String(i)}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={CAROUSEL_ITEM_WIDTH + 12}
          decelerationRate="fast"
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(
              e.nativeEvent.contentOffset.x / (CAROUSEL_ITEM_WIDTH + 12),
            );
            setCarouselIndex(idx);
          }}
          renderItem={({ item }) => {
            const src = typeof item === 'string' ? { uri: item } : item;
            return (
              <LinearGradient
                colors={['#FF007B', '#00B4D8']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.carouselGradientBorder}
              >
                <View style={styles.carouselSlot}>
                  <Image
                    source={src}
                    style={styles.carouselImage}
                    contentFit="cover"
                    transition={200}
                  />
                </View>
              </LinearGradient>
            );
          }}
          contentContainerStyle={{ gap: 12 }}
          style={{ marginHorizontal: -20 }}
          contentInset={{ left: 20, right: 20 }}
          contentOffset={{ x: -20, y: 0 }}
        />

        {/* Dot indicators */}
        {photos.length > 1 && (
          <View style={styles.dotRow}>
            {photos.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === carouselIndex && styles.dotActive]}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Flare />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 10 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <View style={styles.backButton}>
              <Icon name="chevron-back" size={22} color="#FFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            activeOpacity={0.7}
          >
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Photo + Info */}
        <View style={styles.profileSection}>
          <View style={styles.photoContainer}>
            <Image
              source={typeof profile.photo === 'string' ? { uri: profile.photo } : profile.photo}
              style={styles.profilePhoto}
              contentFit="cover"
              transition={200}
            />
            <View style={styles.editPhotoIcon}>
              <Icon name="pencil" size={12} color="#FFF" />
            </View>
          </View>
          <Text style={styles.profileName}>{profile.name || 'Complete your profile'}</Text>
          {profile.location ? (
            <View style={styles.locationRow}>
              <Icon name="location-outline" size={14} color="#999" />
              <Text style={styles.locationText}>{profile.location}</Text>
            </View>
          ) : null}
        </View>

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'Personal info' && renderPersonalInfo()}
        {activeTab === 'About me' && renderAboutMe()}
        {activeTab === 'Media' && renderMedia()}

        {/* Bottom Edit Button */}
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <LinearGradient
              colors={['#FF007B', '#FF4458']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.editGradientButton}
            >
              <Text style={styles.editGradientText}>Edit</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingBottom: 140,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontFamily: FONTS.SemiBold,
    fontSize: 18,
    color: '#FFF',
  },
  editButton: {
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
    color: '#FF007B',
  },
  // Profile Section
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 14,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(255, 0, 123, 0.3)',
  },
  editPhotoIcon: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FF007B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  profileName: {
    fontFamily: FONTS.Bold,
    fontSize: 22,
    color: '#FFF',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontFamily: FONTS.Regular,
    fontSize: 13,
    color: '#999',
  },
  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFF',
  },
  tabText: {
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#666',
  },
  tabTextActive: {
    fontFamily: FONTS.SemiBold,
    color: '#FFF',
  },
  // Tab Content
  tabContent: {
    paddingHorizontal: 20,
  },
  // Info Cards
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  infoRow: {
    paddingVertical: 6,
  },
  infoLabel: {
    fontFamily: FONTS.Regular,
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
    color: '#FFF',
  },
  infoDivider: {
    height: 0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: 8,
  },
  dualCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 20,
  },
  dualCardHalf: {
    flex: 1,
  },
  // Bio
  bioText: {
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#DDD',
    lineHeight: 22,
    marginTop: 4,
  },
  // Chips
  sectionTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    color: '#FFF',
    marginTop: 8,
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  chipText: {
    fontFamily: FONTS.Medium,
    fontSize: 13,
    color: '#FFF',
  },
  // Prompts
  promptCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  promptQuestion: {
    fontFamily: FONTS.Medium,
    fontSize: 13,
    color: '#FF007B',
    marginBottom: 6,
  },
  promptAnswer: {
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#DDD',
    lineHeight: 20,
  },
  // Photo carousel
  carouselGradientBorder: {
    width: CAROUSEL_ITEM_WIDTH,
    aspectRatio: 0.85,
    padding: 1.5,
    borderRadius: 20,
  },
  carouselSlot: {
    flex: 1,
    borderRadius: 18.5,
    overflow: 'hidden',
    backgroundColor: '#0D0D0D',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  dotRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dotActive: {
    backgroundColor: '#FF007B',
    width: 18,
    borderRadius: 3,
  },
  emptyPhotos: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  emptyPhotosText: {
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#555',
  },
  // Bottom Button
  bottomButtonContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  editGradientButton: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  editGradientText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    color: '#FFF',
  },
});

export default ProfileViewScreen;
