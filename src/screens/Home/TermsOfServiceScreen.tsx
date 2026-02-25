// src/screens/Home/TermsOfServiceScreen.tsx

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
    title: '1. Acceptance of Terms',
    body: `By creating an account or using the Opueh app, you agree to be bound by these Terms of Service. If you do not agree, please do not use the app.`,
  },
  {
    title: '2. Eligibility',
    body: `You must be at least 18 years of age to use Opueh. By using the app, you represent and warrant that you meet this requirement. We reserve the right to terminate accounts we believe belong to minors.`,
  },
  {
    title: '3. Your Account',
    body: `You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to:\n\n• Provide accurate and complete information\n• Keep your profile photos current and representative of yourself\n• Not share your account with others\n• Notify us immediately of any unauthorised use`,
  },
  {
    title: '4. Acceptable Use',
    body: `You agree not to:\n\n• Post fake, misleading, or offensive content\n• Harass, bully, or threaten other users\n• Solicit money from other users\n• Use the app for commercial purposes without our consent\n• Attempt to access other users' accounts\n• Use automated tools or bots on the platform\n• Post content depicting minors in any sexual context\n\nViolations may result in immediate account termination.`,
  },
  {
    title: '5. Coins and Purchases',
    body: `Opueh uses a virtual coin system for premium features. Coins are purchased through the Apple App Store or Google Play Store and are non-refundable except where required by law. Coins have no cash value and cannot be transferred between accounts.\n\nAll in-app purchases are subject to the terms of your respective app store.`,
  },
  {
    title: '6. Content You Post',
    body: `By posting content (photos, bio, messages) on Opueh, you grant us a non-exclusive, royalty-free, worldwide licence to use, reproduce, and display that content within the app. You retain ownership of your content.\n\nYou are solely responsible for ensuring your content does not infringe any third-party rights.`,
  },
  {
    title: '7. Disclaimers',
    body: `Opueh is provided "as is" without warranties of any kind. We do not guarantee that:\n\n• The service will be uninterrupted or error-free\n• Profiles are authentic or that matches will result in relationships\n• Content posted by other users is accurate or appropriate\n\nWe are not responsible for the conduct of any user, online or offline.`,
  },
  {
    title: '8. Limitation of Liability',
    body: `To the maximum extent permitted by law, Opueh shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the app, even if we have been advised of the possibility of such damages.`,
  },
  {
    title: '9. Termination',
    body: `We reserve the right to suspend or terminate your account at any time for violations of these Terms. You may delete your account at any time from Account Actions in the app settings.`,
  },
  {
    title: '10. Governing Law',
    body: `These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved in the courts of Lagos State, Nigeria.`,
  },
  {
    title: '11. Changes to Terms',
    body: `We may update these Terms from time to time. We will notify you of material changes. Continued use of the app after changes become effective constitutes your acceptance of the revised Terms.`,
  },
  {
    title: '12. Contact',
    body: `For questions about these Terms, contact us at:\n\nlegal@opueh.app\nOpueh Inc., Lagos, Nigeria`,
  },
];

const TermsOfServiceScreen: React.FC = () => {
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
          <Text style={styles.headerTitle}>Terms of Service</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Meta */}
        <View style={styles.metaCard}>
          <Icon name="document-text-outline" size={32} color="#FF007B" />
          <Text style={styles.metaTitle}>Please read carefully</Text>
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

export default TermsOfServiceScreen;
