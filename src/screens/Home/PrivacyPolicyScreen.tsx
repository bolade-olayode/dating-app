// src/screens/Home/PrivacyPolicyScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';
import Flare from '@components/ui/Flare';

const LAST_UPDATED = 'February 2026';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: `We collect information you provide directly, including your name, phone number, date of birth, gender, photos, and interests when you create an account or update your profile.\n\nWe also collect information automatically, such as device identifiers, log data, location data (when you grant permission), and usage information about how you interact with the app.`,
  },
  {
    title: '2. How We Use Your Information',
    body: `We use your information to:\n\n• Provide, maintain, and improve the Opueh service\n• Match you with other users based on your preferences and location\n• Send you notifications about matches and messages\n• Process transactions and manage your coin wallet\n• Verify your identity and prevent fraud\n• Comply with legal obligations`,
  },
  {
    title: '3. Sharing of Information',
    body: `We do not sell your personal data. We share information only in the following circumstances:\n\n• With other users: Your profile name, age, photos, and interests are visible to other users based on your privacy settings.\n• With service providers: We work with third-party vendors (e.g. Cloudinary for photo storage) who process data on our behalf.\n• For legal reasons: We may disclose information if required by law or to protect the rights and safety of our users.`,
  },
  {
    title: '4. Data Retention',
    body: `We retain your information for as long as your account is active or as needed to provide you with our services. You may delete your account at any time from Account Actions, which will permanently delete your profile and associated data within 30 days.`,
  },
  {
    title: '5. Your Rights',
    body: `Depending on your location, you may have the right to:\n\n• Access the personal data we hold about you\n• Request correction of inaccurate data\n• Request deletion of your data\n• Object to or restrict processing of your data\n• Data portability\n\nTo exercise these rights, contact us at privacy@opueh.app.`,
  },
  {
    title: '6. Security',
    body: `We implement industry-standard security measures to protect your personal information, including encryption in transit (HTTPS) and at rest. However, no method of transmission over the internet is 100% secure.`,
  },
  {
    title: '7. Children\'s Privacy',
    body: `Opueh is not intended for users under the age of 18. We do not knowingly collect personal information from minors. If we become aware that a minor has provided us with personal information, we will delete it promptly.`,
  },
  {
    title: '8. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. We will notify you of significant changes via in-app notification or email. Continued use of the app after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: '9. Contact Us',
    body: `If you have questions about this Privacy Policy, please contact us at:\n\nprivacy@opueh.app\nOpueh Inc., Lagos, Nigeria`,
  },
];

const PrivacyPolicyScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Flare />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 10, paddingBottom: 60 },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <View style={styles.backButton}>
              <Icon name="chevron-back" size={22} color="#FFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Meta */}
        <View style={styles.metaCard}>
          <Icon name="shield-checkmark-outline" size={32} color="#FF007B" />
          <Text style={styles.metaTitle}>Your privacy matters</Text>
          <Text style={styles.metaSubtitle}>Last updated: {LAST_UPDATED}</Text>
        </View>

        {/* Sections */}
        {SECTIONS.map((section, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}
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
  metaCard: {
    backgroundColor: 'rgba(255, 0, 123, 0.08)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 123, 0.2)',
    marginBottom: 28,
    gap: 8,
  },
  metaTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    color: '#FFF',
  },
  metaSubtitle: {
    fontFamily: FONTS.Regular,
    fontSize: 13,
    color: '#888',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
    color: '#FF007B',
    marginBottom: 10,
  },
  sectionBody: {
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#CCC',
    lineHeight: 22,
  },
});

export default PrivacyPolicyScreen;
