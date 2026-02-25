// src/screens/Home/DiscoverySettingsScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';
import Flare from '@components/ui/Flare';
import { STORAGE_KEYS } from '@utils/constant';
import { devLog } from '@config/environment';

// ─── Default settings ────────────────────────────────────────

export interface DiscoverySettings {
  maxDistance:    number;   // km
  ageMin:         number;
  ageMax:         number;
  showMe:         'Men' | 'Women' | 'Everyone';
  globalMode:     boolean;
  recentlyActive: boolean;
  verifiedOnly:   boolean;
}

export const DEFAULT_DISCOVERY_SETTINGS: DiscoverySettings = {
  maxDistance:    50,
  ageMin:         18,
  ageMax:         45,
  showMe:         'Everyone',
  globalMode:     false,
  recentlyActive: true,
  verifiedOnly:   false,
};

// ─── Helpers ─────────────────────────────────────────────────

export const loadDiscoverySettings = async (): Promise<DiscoverySettings> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.DISCOVERY_SETTINGS);
    if (raw) return { ...DEFAULT_DISCOVERY_SETTINGS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_DISCOVERY_SETTINGS;
};

const saveDiscoverySettings = async (settings: DiscoverySettings) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.DISCOVERY_SETTINGS, JSON.stringify(settings));
    devLog('⚙️ Discovery settings saved:', settings);
  } catch {}
};

// ─── Component ───────────────────────────────────────────────

const DiscoverySettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [settings, setSettings] = useState<DiscoverySettings>(DEFAULT_DISCOVERY_SETTINGS);

  // Load persisted settings on mount
  useEffect(() => {
    loadDiscoverySettings().then(setSettings);
  }, []);

  // Save whenever settings change
  const update = useCallback(<K extends keyof DiscoverySettings>(
    key: K,
    value: DiscoverySettings[K],
  ) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      saveDiscoverySettings(next);
      return next;
    });
  }, []);

  // ─── Render helpers ────────────────────────────────────────

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

  // ─── Distance stepper ──────────────────────────────────────

  const renderDistanceStepper = () => (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIconContainer}>
          <Icon name="location-outline" size={18} color="#FF007B" />
        </View>
        <Text style={styles.settingTitle}>Maximum distance</Text>
      </View>
      <View style={styles.stepper}>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => update('maxDistance', Math.max(5, settings.maxDistance - 5))}
          activeOpacity={0.7}
        >
          <Icon name="remove" size={16} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.stepValue}>{settings.maxDistance} km</Text>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => update('maxDistance', Math.min(300, settings.maxDistance + 5))}
          activeOpacity={0.7}
        >
          <Icon name="add" size={16} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // ─── Age stepper ───────────────────────────────────────────

  const renderAgeStepper = (
    label: string,
    value: number,
    onDec: () => void,
    onInc: () => void,
  ) => (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIconContainer}>
          <Icon name="calendar-outline" size={18} color="#FF007B" />
        </View>
        <Text style={styles.settingTitle}>{label}</Text>
      </View>
      <View style={styles.stepper}>
        <TouchableOpacity style={styles.stepBtn} onPress={onDec} activeOpacity={0.7}>
          <Icon name="remove" size={16} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.stepValue}>{value}</Text>
        <TouchableOpacity style={styles.stepBtn} onPress={onInc} activeOpacity={0.7}>
          <Icon name="add" size={16} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // ─── JSX ──────────────────────────────────────────────────

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
          {renderDistanceStepper()}
          {renderToggleRow(
            'globe-outline',
            'Global mode',
            'See people from around the world',
            settings.globalMode,
            (v) => update('globalMode', v),
          )}
        </View>

        {/* Age Range */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Age Range</Text>
          {renderAgeStepper(
            'Minimum age',
            settings.ageMin,
            () => update('ageMin', Math.max(18, settings.ageMin - 1)),
            () => update('ageMin', Math.min(settings.ageMax - 1, settings.ageMin + 1)),
          )}
          {renderAgeStepper(
            'Maximum age',
            settings.ageMax,
            () => update('ageMax', Math.max(settings.ageMin + 1, settings.ageMax - 1)),
            () => update('ageMax', Math.min(80, settings.ageMax + 1)),
          )}
        </View>

        {/* Show Me */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Show Me</Text>
          {(['Men', 'Women', 'Everyone'] as const).map(option => (
            <TouchableOpacity
              key={option}
              style={styles.radioRow}
              activeOpacity={0.7}
              onPress={() => update('showMe', option)}
            >
              <Text style={styles.radioLabel}>{option}</Text>
              <View style={[styles.radioOuter, settings.showMe === option && styles.radioOuterActive]}>
                {settings.showMe === option && <View style={styles.radioInner} />}
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
            settings.recentlyActive,
            (v) => update('recentlyActive', v),
          )}
          {renderToggleRow(
            'checkmark-circle-outline',
            'Verified profiles only',
            'Only show verified users',
            settings.verifiedOnly,
            (v) => update('verifiedOnly', v),
          )}
        </View>

        {/* Save hint */}
        <Text style={styles.saveHint}>Settings are saved automatically.</Text>
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
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
    color: '#FF007B',
    marginBottom: 14,
  },
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
  // Stepper
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepValue: {
    fontFamily: FONTS.SemiBold,
    fontSize: 14,
    color: '#FFF',
    minWidth: 52,
    textAlign: 'center',
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
  saveHint: {
    fontFamily: FONTS.Regular,
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default DiscoverySettingsScreen;
