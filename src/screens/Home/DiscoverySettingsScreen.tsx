// src/screens/Home/DiscoverySettingsScreen.tsx

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
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';
import Flare from '@components/ui/Flare';

const DiscoverySettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  // Discovery preferences state
  const [maxDistance, setMaxDistance] = useState(50);
  const [ageMin, setAgeMin] = useState(18);
  const [ageMax, setAgeMax] = useState(45);
  const [showMe, setShowMe] = useState('Everyone');
  const [globalMode, setGlobalMode] = useState(false);
  const [recentlyActive, setRecentlyActive] = useState(true);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const renderSettingRow = (
    icon: string,
    title: string,
    value: string,
    onPress?: () => void,
  ) => (
    <TouchableOpacity
      style={styles.settingRow}
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIconContainer}>
          <Icon name={icon} size={18} color="#FF007B" />
        </View>
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      <View style={styles.settingRight}>
        <Text style={styles.settingValue}>{value}</Text>
        {onPress && <Icon name="chevron-forward" size={16} color="#555" />}
      </View>
    </TouchableOpacity>
  );

  const renderToggleRow = (
    icon: string,
    title: string,
    subtitle: string,
    value: boolean,
    onToggle: (val: boolean) => void,
  ) => (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIconContainer}>
          <Icon name={icon} size={18} color="#FF007B" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#333', true: 'rgba(255, 0, 123, 0.4)' }}
        thumbColor={value ? '#FF007B' : '#888'}
      />
    </View>
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
          <Text style={styles.headerTitle}>Discovery</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Distance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          {renderSettingRow('location-outline', 'Maximum distance', `${maxDistance} km`)}
          {renderToggleRow(
            'globe-outline',
            'Global mode',
            'See people from around the world',
            globalMode,
            setGlobalMode,
          )}
        </View>

        {/* Age Range */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Age Range</Text>
          {renderSettingRow('calendar-outline', 'Minimum age', `${ageMin}`)}
          {renderSettingRow('calendar-outline', 'Maximum age', `${ageMax}`)}
        </View>

        {/* Show Me */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Show Me</Text>
          {['Men', 'Women', 'Everyone'].map(option => (
            <TouchableOpacity
              key={option}
              style={styles.radioRow}
              activeOpacity={0.7}
              onPress={() => setShowMe(option)}
            >
              <Text style={styles.radioLabel}>{option}</Text>
              <View style={[styles.radioOuter, showMe === option && styles.radioOuterActive]}>
                {showMe === option && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Deal-breakers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deal-breakers</Text>
          {renderToggleRow(
            'time-outline',
            'Recently active',
            'Only show people active in the last 7 days',
            recentlyActive,
            setRecentlyActive,
          )}
          {renderToggleRow(
            'checkmark-circle-outline',
            'Verified profiles only',
            'Only show verified users',
            verifiedOnly,
            setVerifiedOnly,
          )}
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
  // Setting Rows
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
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#888',
  },
  // Radio
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  radioLabel: {
    fontFamily: FONTS.Medium,
    fontSize: 15,
    color: '#FFF',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: '#FF007B',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF007B',
  },
});

export default DiscoverySettingsScreen;
