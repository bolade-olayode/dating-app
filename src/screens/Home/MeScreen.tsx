// src/screens/Home/MeScreen.tsx

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';
import Flare from '@components/ui/Flare';
import { useUser } from '@context/UserContext';


// Mock profile data (until real data flows from onboarding → context)
const MOCK_PROFILE = {
  name: 'BaaleofUI',
  age: 35,
  location: 'Ontario, Japan',
  photo: require('../../assets/images/opuehbckgdimg2.png'),
  bio: '',
  interests: ['Sushi', 'Basketball', 'Galleries'],
  photos: [
    require('../../assets/images/opuehbckgdimg2.png'),
    require('../../assets/images/opuehbckgdimg.jpg'),
  ],
  gender: 'Female',
  lookingFor: 'Straight',
  relationshipGoal: 'Long term partner',
  basics: {
    status: 'Single',
    weight: '',
    zodiac: '',
    nationality: 'Nigerian',
    height: '',
    education: '',
    employment: '',
  },
  email: 'baaleofui@gmail.com',
  phone: '00000000009',
  prompts: [] as Array<{ question: string; answer: string }>,
  verified: false,
};

// Profile completion calculation
const calculateCompletion = (profile: typeof MOCK_PROFILE) => {
  const checks = [
    { label: 'Add profile photos (min 3)', weight: 20, done: profile.photos.length >= 3 },
    { label: 'Write your bio', weight: 20, done: !!profile.bio && profile.bio.length > 10 },
    { label: 'Select interests (min 5)', weight: 15, done: profile.interests.length >= 5 },
    { label: 'Answer prompts (min 2)', weight: 15, done: (profile.prompts?.length || 0) >= 2 },
    { label: 'Add height & weight', weight: 10, done: !!profile.basics.height && !!profile.basics.weight },
    { label: 'Complete basics (zodiac, education)', weight: 10, done: !!profile.basics.zodiac && !!profile.basics.education },
    { label: 'Set relationship goal', weight: 10, done: !!profile.relationshipGoal },
  ];

  const completed = checks.filter(c => c.done);
  const percentage = completed.reduce((sum, c) => sum + c.weight, 0);
  const incomplete = checks.filter(c => !c.done);

  return { percentage, checks, incomplete };
};

// Settings menu items
const SETTINGS_SECTIONS = [
  {
    id: 'discovery',
    title: 'Discovery',
    subtitle: 'Deal-breakers, filters, preferences',
    icon: 'compass-outline',
    color: '#FF007B',
  },
  {
    id: 'privacy',
    title: 'Privacy & Safety',
    subtitle: 'Block contacts, hide contacts, blur photos',
    icon: 'lock-closed-outline',
    color: '#FF007B',
  },
  {
    id: 'billing',
    title: 'Membership & Billing',
    subtitle: 'Top-up, membership tier, receipts',
    icon: 'card-outline',
    color: '#FF007B',
  },
  {
    id: 'performance',
    title: 'Profile Performance',
    subtitle: 'Priority likes, smart photo optimizers',
    icon: 'trending-up-outline',
    color: '#FF007B',
  },
  {
    id: 'account',
    title: 'Account Actions',
    subtitle: 'Pause, request data, logout',
    icon: 'settings-outline',
    color: '#FF007B',
  },
];

const MeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { profile: contextProfile } = useUser();

  // Merge context profile over mock defaults
  const profile = useMemo(() => {
    if (!contextProfile) return MOCK_PROFILE;
    return {
      ...MOCK_PROFILE,
      name: contextProfile.name || MOCK_PROFILE.name,
      age: contextProfile.age || (contextProfile.dateOfBirth ? (() => {
        const dob = new Date(contextProfile.dateOfBirth!);
        const today = new Date();
        let a = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) a--;
        return a;
      })() : MOCK_PROFILE.age),
      location: contextProfile.location || MOCK_PROFILE.location,
      bio: contextProfile.bio || '',
      interests: contextProfile.interests?.length ? contextProfile.interests : MOCK_PROFILE.interests,
      photos: contextProfile.photos?.length ? contextProfile.photos : MOCK_PROFILE.photos,
      photo: contextProfile.photos?.[0] ? { uri: contextProfile.photos[0] } : MOCK_PROFILE.photo,
      gender: contextProfile.gender || MOCK_PROFILE.gender,
      lookingFor: contextProfile.lookingFor || MOCK_PROFILE.lookingFor,
      relationshipGoal: contextProfile.relationshipGoal || MOCK_PROFILE.relationshipGoal,
      basics: {
        ...MOCK_PROFILE.basics,
        weight: contextProfile.weight || '',
        height: contextProfile.height || '',
        education: contextProfile.education || '',
      },
      email: contextProfile.email || MOCK_PROFILE.email,
      phone: contextProfile.phoneNumber || MOCK_PROFILE.phone,
      prompts: contextProfile.prompts || [],
      verified: contextProfile.verified ?? false,
    };
  }, [contextProfile]);

  const completion = useMemo(() => calculateCompletion(profile), [profile]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Flare />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 10, paddingBottom: 140 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Me</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Icon name="search-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <TouchableOpacity
          style={styles.profileCard}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('ProfileView')}
        >
          <LinearGradient
            colors={['rgba(255, 0, 123, 0.3)', 'rgba(0, 0, 0, 0.8)']}
            style={styles.profileGradient}
          >
            <View style={styles.profileRow}>
              <Image source={profile.photo} style={styles.profilePhoto} />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{profile.name}</Text>
                <Text style={styles.profileMeta}>{profile.age} y.o, {profile.location}</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Completion Banner */}
        {completion.percentage < 100 && (
          <TouchableOpacity
            style={styles.completionBanner}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AccountSetup', { completion })}
          >
            <LinearGradient
              colors={['rgba(255, 0, 123, 0.2)', 'rgba(30, 30, 30, 0.9)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.completionGradient}
            >
              <View style={styles.completionLeft}>
                {/* Progress Ring */}
                <View style={styles.progressRing}>
                  <View style={styles.progressRingInner}>
                    <Text style={styles.progressPercent}>{completion.percentage}%</Text>
                  </View>
                </View>
              </View>
              <View style={styles.completionRight}>
                <Text style={styles.completionTitle}>Final Touches!</Text>
                <Text style={styles.completionSubtitle}>
                  Just finish these quick tasks to fully customize your MeetPie experience and make your app even more amazing!
                </Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Settings Sections */}
        <View style={styles.settingsContainer}>
          {SETTINGS_SECTIONS.map((section) => (
            <TouchableOpacity
              key={section.id}
              style={styles.settingsRow}
              activeOpacity={0.7}
              onPress={() => {
                if (section.id === 'discovery') {
                  navigation.navigate('DiscoverySettings');
                } else if (section.id === 'privacy') {
                  navigation.navigate('PrivacySafety');
                } else if (section.id === 'billing') {
                  navigation.navigate('Wallet');
                } else if (section.id === 'performance') {
                  navigation.navigate('ProfilePerformance');
                } else if (section.id === 'account') {
                  navigation.navigate('AccountActions');
                }
              }}
            >
              <View style={styles.settingsIconContainer}>
                <Icon name={section.icon} size={20} color={section.color} />
              </View>
              <View style={styles.settingsInfo}>
                <Text style={styles.settingsTitle}>{section.title}</Text>
                <Text style={styles.settingsSubtitle}>{section.subtitle}</Text>
              </View>
              <Icon name="chevron-forward" size={18} color="#FF007B" />
            </TouchableOpacity>
          ))}
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
    paddingHorizontal: 20,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 28,
    color: '#FFF',
  },
  // Profile Card
  profileCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  profileGradient: {
    padding: 20,
    borderRadius: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FF007B',
    marginRight: 14,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: FONTS.Bold,
    fontSize: 20,
    color: '#FFF',
    marginBottom: 4,
  },
  profileMeta: {
    fontFamily: FONTS.Regular,
    fontSize: 13,
    color: '#CCC',
  },
  // Completion Banner
  completionBanner: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 28,
  },
  completionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 123, 0.15)',
  },
  completionLeft: {
    marginRight: 14,
  },
  progressRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#FF007B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRingInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercent: {
    fontFamily: FONTS.Bold,
    fontSize: 12,
    color: '#FF007B',
  },
  completionRight: {
    flex: 1,
    marginRight: 8,
  },
  completionTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
    color: '#FF007B',
    marginBottom: 4,
  },
  completionSubtitle: {
    fontFamily: FONTS.Regular,
    fontSize: 12,
    color: '#AAA',
    lineHeight: 17,
  },
  // Settings
  settingsContainer: {
    gap: 0,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  settingsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingsInfo: {
    flex: 1,
  },
  settingsTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
    color: '#FFF',
    marginBottom: 3,
  },
  settingsSubtitle: {
    fontFamily: FONTS.Regular,
    fontSize: 12,
    color: '#888',
  },
});

export default MeScreen;
