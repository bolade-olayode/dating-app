// src/screens/Home/AccountActionsScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import * as WebBrowser from 'expo-web-browser';
import { FONTS } from '@config/fonts';
import Flare from '@components/ui/Flare';
import { useUser } from '@context/UserContext';
import { authService } from '@services/api/authService';

// Legal URLs — live website, auto-reflects any content changes
const LEGAL_URLS = {
  privacy: 'https://www.meetpie.dating/privacy',
  terms: 'https://www.meetpie.dating/terms',
  communityGuidelines: 'https://www.meetpie.dating/community-guidelines',
} as const;

const openLegalPage = (url: string) => {
  WebBrowser.openBrowserAsync(url, {
    toolbarColor: '#000000',
    controlsColor: '#FF007B',
    showTitle: true,
  });
};

const AccountActionsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { logout } = useUser();

  const renderActionRow = (
    icon: string,
    title: string,
    subtitle: string,
    onPress: () => void,
    danger?: boolean,
  ) => (
    <TouchableOpacity style={styles.actionRow} activeOpacity={0.7} onPress={onPress}>
      <View style={[styles.actionIconContainer, danger && styles.dangerIcon]}>
        <Icon name={icon} size={20} color={danger ? '#FF3B30' : '#FF007B'} />
      </View>
      <View style={styles.actionInfo}>
        <Text style={[styles.actionTitle, danger && { color: '#FF3B30' }]}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>
      <Icon name="chevron-forward" size={16} color="#555" />
    </TouchableOpacity>
  );

  const handlePauseAccount = () => {
    Alert.alert(
      'Pause Account',
      'Your profile will be hidden from discovery. You can reactivate anytime.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pause',
          onPress: () => Alert.alert('Account Paused', 'Your account has been paused.'),
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await authService.logout();
          } catch {
            // Continue with local logout even if API fails
          }
          await logout();
          navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action is permanent and cannot be undone. All your data, matches, and conversations will be deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Forever',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await authService.deleteAccount();
              if (result.success) {
                await logout();
                navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
              } else {
                Alert.alert('Error', result.message);
              }
            } catch {
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          },
        },
      ],
    );
  };

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
          <Text style={styles.headerTitle}>Account Actions</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {renderActionRow(
            'pause-outline',
            'Pause account',
            'Temporarily hide your profile',
            handlePauseAccount,
          )}
          {renderActionRow(
            'download-outline',
            'Request my data',
            'Download a copy of your personal data',
            () => Alert.alert('Data Request', 'Your data download will be ready within 24 hours.'),
          )}
          {renderActionRow(
            'mail-outline',
            'Change email',
            'Update your email address',
            () => Alert.alert('Change Email', 'Email change feature coming soon.'),
          )}
          {renderActionRow(
            'call-outline',
            'Change phone number',
            'Update your phone number',
            () => Alert.alert('Change Phone', 'Phone change feature coming soon.'),
          )}
        </View>

        {/* App */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          {renderActionRow(
            'notifications-outline',
            'Notifications',
            'Manage push notification preferences',
            () => Alert.alert('Notifications', 'Notification settings coming soon.'),
          )}
          {renderActionRow(
            'help-circle-outline',
            'Help & Support',
            'FAQs and contact support',
            () => Alert.alert('Help', 'Help center coming soon.'),
          )}
          {renderActionRow(
            'document-text-outline',
            'Terms of Service',
            'Read our terms and conditions',
            () => openLegalPage(LEGAL_URLS.terms),
          )}
          {renderActionRow(
            'shield-outline',
            'Privacy Policy',
            'How we handle your data',
            () => openLegalPage(LEGAL_URLS.privacy),
          )}
          {renderActionRow(
            'people-outline',
            'Community Guidelines',
            'Our standards for respectful interaction',
            () => openLegalPage(LEGAL_URLS.communityGuidelines),
          )}
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#FF3B30' }]}>Danger Zone</Text>
          {renderActionRow(
            'log-out-outline',
            'Logout',
            'Sign out of your account',
            handleLogout,
            true,
          )}
          {renderActionRow(
            'trash-outline',
            'Delete account',
            'Permanently delete your account and data',
            handleDeleteAccount,
            true,
          )}
        </View>

        {/* App Version */}
        <Text style={styles.versionText}>Opueh v0.2.0</Text>
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
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  dangerIcon: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontFamily: FONTS.Medium,
    fontSize: 15,
    color: '#FFF',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontFamily: FONTS.Regular,
    fontSize: 12,
    color: '#666',
  },
  versionText: {
    fontFamily: FONTS.Regular,
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default AccountActionsScreen;
