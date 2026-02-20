// src/screens/Home/PrivacySafetyScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';
import Flare from '@components/ui/Flare';
import { moderationService } from '@services/api/moderationService';
import { devLog } from '@config/environment';

const PrivacySafetyScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [hideProfile, setHideProfile] = useState(false);
  const [blurPhotos, setBlurPhotos] = useState(false);
  const [readReceipts, setReadReceipts] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [blockContacts, setBlockContacts] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
  const [loadingBlocked, setLoadingBlocked] = useState(false);

  // Fetch blocked users from API
  const fetchBlockedUsers = async () => {
    setLoadingBlocked(true);
    const result = await moderationService.getBlockedUsers();
    if (result.success && Array.isArray(result.data)) {
      devLog('✅ Privacy: Loaded', result.data.length, 'blocked users');
      setBlockedUsers(result.data);
    }
    setLoadingBlocked(false);
  };

  const handleUnblock = async (userId: string, userName: string) => {
    Alert.alert('Unblock User', `Unblock ${userName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Unblock', onPress: async () => {
          const result = await moderationService.unblockUser(userId);
          if (result.success) {
            setBlockedUsers(prev => prev.filter(u => (u._id || u.id) !== userId));
            Alert.alert('Unblocked', `${userName} has been unblocked.`);
          } else {
            Alert.alert('Error', result.message);
          }
        },
      },
    ]);
  };

  const showBlockedUsers = () => {
    fetchBlockedUsers();
  };

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

  const renderActionRow = (
    icon: string,
    title: string,
    subtitle: string,
    onPress: () => void,
    danger?: boolean,
  ) => (
    <TouchableOpacity style={styles.settingRow} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIconContainer, danger && styles.dangerIcon]}>
          <Icon name={icon} size={18} color={danger ? '#FF3B30' : '#FF007B'} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.settingTitle, danger && { color: '#FF3B30' }]}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Icon name="chevron-forward" size={16} color="#555" />
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
          <Text style={styles.headerTitle}>Privacy & Safety</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Visibility */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visibility</Text>
          {renderToggleRow(
            'eye-off-outline',
            'Hide my profile',
            'Your profile won\'t appear in discovery',
            hideProfile,
            setHideProfile,
          )}
          {renderToggleRow(
            'image-outline',
            'Blur my photos',
            'Photos are blurred until you match',
            blurPhotos,
            setBlurPhotos,
          )}
          {renderToggleRow(
            'radio-outline',
            'Show online status',
            'Let others see when you\'re online',
            showOnlineStatus,
            setShowOnlineStatus,
          )}
          {renderToggleRow(
            'navigate-outline',
            'Show distance',
            'Display your distance from others',
            showDistance,
            setShowDistance,
          )}
        </View>

        {/* Messaging */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Messaging</Text>
          {renderToggleRow(
            'checkmark-done-outline',
            'Read receipts',
            'Let matches know when you\'ve read messages',
            readReceipts,
            setReadReceipts,
          )}
        </View>

        {/* Contacts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacts</Text>
          {renderToggleRow(
            'people-outline',
            'Block my contacts',
            'People in your phonebook won\'t see you',
            blockContacts,
            setBlockContacts,
          )}
          {renderActionRow(
            'ban-outline',
            'Blocked users',
            blockedUsers.length > 0 ? `${blockedUsers.length} blocked` : 'Manage your blocked list',
            showBlockedUsers,
          )}
          {/* Blocked users list (shown after fetch) */}
          {loadingBlocked && (
            <ActivityIndicator size="small" color="#FF007B" style={{ marginVertical: 10 }} />
          )}
          {blockedUsers.length > 0 && !loadingBlocked && blockedUsers.map((user: any) => (
            <View key={user._id || user.id} style={styles.blockedUserRow}>
              <Text style={styles.blockedUserName}>
                {user.fullname || user.name || 'Unknown'}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleUnblock(user._id || user.id, user.fullname || user.name || 'User')}
              >
                <Text style={styles.unblockText}>Unblock</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Safety */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety</Text>
          {renderActionRow(
            'flag-outline',
            'Report a problem',
            'Report a bug or safety concern',
            () => Alert.alert('Report', 'Report feature coming soon.'),
          )}
          {renderActionRow(
            'shield-checkmark-outline',
            'Community guidelines',
            'Review our safety policies',
            () => Alert.alert('Guidelines', 'Community guidelines coming soon.'),
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
  dangerIcon: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
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
  blockedUserRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  blockedUserName: {
    fontFamily: FONTS.Medium,
    fontSize: 14,
    color: '#FFF',
  },
  unblockText: {
    fontFamily: FONTS.Medium,
    fontSize: 13,
    color: '#FF007B',
  },
});

export default PrivacySafetyScreen;
