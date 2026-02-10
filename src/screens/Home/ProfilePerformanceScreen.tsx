// src/screens/Home/ProfilePerformanceScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';
import Flare from '@components/ui/Flare';
import { useUser } from '@context/UserContext';

const ProfilePerformanceScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { coinBalance } = useUser();

  const [smartPhotos, setSmartPhotos] = useState(false);

  // Mock stats
  const stats = {
    profileViews: 142,
    likes: 38,
    superLikes: 5,
    matchRate: '27%',
  };

  const BOOST_OPTIONS = [
    {
      id: 'priority',
      title: 'Priority Likes',
      subtitle: 'Your likes are seen first by matches',
      icon: 'star-outline',
      cost: 500,
    },
    {
      id: 'boost',
      title: 'Profile Boost',
      subtitle: 'Be a top profile in your area for 30 min',
      icon: 'rocket-outline',
      cost: 1000,
    },
    {
      id: 'spotlight',
      title: 'Spotlight',
      subtitle: 'Featured in the Explore tab for 1 hour',
      icon: 'flashlight-outline',
      cost: 2500,
    },
  ];

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
          <Text style={styles.headerTitle}>Profile Performance</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {[
            { label: 'Profile Views', value: stats.profileViews, icon: 'eye-outline' },
            { label: 'Likes', value: stats.likes, icon: 'heart-outline' },
            { label: 'Super Likes', value: stats.superLikes, icon: 'star-outline' },
            { label: 'Match Rate', value: stats.matchRate, icon: 'pulse-outline' },
          ].map(stat => (
            <View key={stat.label} style={styles.statCard}>
              <Icon name={stat.icon} size={20} color="#FF007B" />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Smart Photos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Optimization</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconContainer}>
                <Icon name="images-outline" size={18} color="#FF007B" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingTitle}>Smart Photos</Text>
                <Text style={styles.settingSubtitle}>
                  Automatically show your best-performing photo first
                </Text>
              </View>
            </View>
            <Switch
              value={smartPhotos}
              onValueChange={setSmartPhotos}
              trackColor={{ false: '#333', true: 'rgba(255, 0, 123, 0.4)' }}
              thumbColor={smartPhotos ? '#FF007B' : '#888'}
            />
          </View>
        </View>

        {/* Boosts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Boosts</Text>
          <Text style={styles.sectionHint}>
            Use your tokens to boost visibility. Balance: {coinBalance.toLocaleString()} tokens
          </Text>
          {BOOST_OPTIONS.map(boost => (
            <TouchableOpacity
              key={boost.id}
              style={styles.boostCard}
              activeOpacity={0.8}
              onPress={() => {
                if (coinBalance >= boost.cost) {
                  navigation.navigate('Wallet');
                } else {
                  navigation.navigate('TopUp');
                }
              }}
            >
              <View style={styles.boostLeft}>
                <View style={styles.boostIconContainer}>
                  <Icon name={boost.icon} size={22} color="#FF007B" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.boostTitle}>{boost.title}</Text>
                  <Text style={styles.boostSubtitle}>{boost.subtitle}</Text>
                </View>
              </View>
              <LinearGradient
                colors={['#FF007B', '#FF4458']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.boostCostBadge}
              >
                <Icon name="flash" size={12} color="#FFF" />
                <Text style={styles.boostCostText}>{boost.cost.toLocaleString()}</Text>
              </LinearGradient>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
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
  // Stats
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    width: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  statValue: {
    fontFamily: FONTS.Bold,
    fontSize: 24,
    color: '#FFF',
  },
  statLabel: {
    fontFamily: FONTS.Regular,
    fontSize: 12,
    color: '#888',
  },
  // Sections
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
    color: '#FF007B',
    marginBottom: 14,
  },
  sectionHint: {
    fontFamily: FONTS.Regular,
    fontSize: 13,
    color: '#666',
    marginBottom: 14,
  },
  // Setting rows
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTitle: {
    fontFamily: FONTS.Medium,
    fontSize: 15,
    color: '#FFF',
  },
  settingSubtitle: {
    fontFamily: FONTS.Regular,
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  // Boost cards
  boostCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  boostLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  boostIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 0, 123, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boostTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
    color: '#FFF',
  },
  boostSubtitle: {
    fontFamily: FONTS.Regular,
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  boostCostBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
  },
  boostCostText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 12,
    color: '#FFF',
  },
});

export default ProfilePerformanceScreen;
