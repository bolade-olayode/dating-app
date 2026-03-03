// src/screens/Home/PrivacyConsentScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FONTS } from '@config/fonts';
import Flare from '@components/ui/Flare';

const PRIVACY_CONSENT_KEY = '@meetpie_privacy_consent';

const DATA_POINTS = [
  { icon: 'location-outline',          text: 'Your general location (city-level) to show nearby matches' },
  { icon: 'person-outline',            text: 'Profile info you provide — photos, bio, interests, age' },
  { icon: 'heart-outline',             text: 'Swipe activity to power our matching algorithm' },
  { icon: 'chatbubble-outline',        text: 'Messages you send within the app' },
  { icon: 'notifications-outline',     text: 'Push notification tokens for match alerts' },
];

const PrivacyConsentScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [accepting, setAccepting] = useState(false);

  const saveAndProceed = async (accepted: boolean) => {
    setAccepting(true);
    try {
      await AsyncStorage.setItem(PRIVACY_CONSENT_KEY, accepted ? 'accepted' : 'declined');
    } catch {}
    navigation.replace('NearbyMatches');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />
      <Flare />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
      >
        {/* Icon */}
        <View style={styles.iconRing}>
          <Icon name="shield-checkmark-outline" size={44} color="#FF007B" />
        </View>

        <Text style={styles.title}>Your Privacy Matters</Text>
        <Text style={styles.subtitle}>
          Before you start, here's a clear summary of what data MeetPie collects
          and how we use it to help you find meaningful connections.
        </Text>

        {/* Data points */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>What we collect</Text>
          {DATA_POINTS.map((item, i) => (
            <View key={i} style={styles.dataRow}>
              <View style={styles.dataIconWrap}>
                <Icon name={item.icon} size={18} color="#FF007B" />
              </View>
              <Text style={styles.dataText}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* How we use it */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>How we use it</Text>
          <Text style={styles.cardBody}>
            Your data is used exclusively to power matching, improve your experience,
            and keep the platform safe. We do not sell your personal information to
            third parties. You can request deletion of your data at any time from
            Account Actions.
          </Text>
        </View>

        {/* Links */}
        <View style={styles.linksRow}>
          <TouchableOpacity
            onPress={() => WebBrowser.openBrowserAsync('https://www.meetpie.dating/privacy', {
              toolbarColor: '#000000', controlsColor: '#FF007B',
            })}
          >
            <Text style={styles.link}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={styles.linkDivider}>·</Text>
          <TouchableOpacity
            onPress={() => WebBrowser.openBrowserAsync('https://www.meetpie.dating/terms', {
              toolbarColor: '#000000', controlsColor: '#FF007B',
            })}
          >
            <Text style={styles.link}>Terms of Service</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => saveAndProceed(true)}
          disabled={accepting}
        >
          <LinearGradient
            colors={['#FF007B', '#FF4458']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.acceptBtn}
          >
            <Text style={styles.acceptText}>I Agree — Take me in</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.declineBtn}
          onPress={() => saveAndProceed(false)}
          disabled={accepting}
        >
          <Text style={styles.declineText}>Decline — Limited experience</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scroll: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  iconRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,0,123,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,0,123,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: FONTS.Bold,
    fontSize: 26,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: 20,
    marginBottom: 16,
    gap: 14,
  },
  cardTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: 14,
    color: '#FF007B',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  cardBody: {
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#888',
    lineHeight: 22,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  dataIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,0,123,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataText: {
    flex: 1,
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#CCC',
    lineHeight: 22,
    paddingTop: 5,
  },
  linksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
    marginBottom: 8,
  },
  link: {
    fontFamily: FONTS.SemiBold,
    fontSize: 13,
    color: '#FF007B',
    textDecorationLine: 'underline',
  },
  linkDivider: {
    color: '#444',
    fontSize: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.06)',
    gap: 10,
  },
  acceptBtn: {
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  acceptText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    color: '#FFF',
  },
  declineBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  declineText: {
    fontFamily: FONTS.Regular,
    fontSize: 13,
    color: '#555',
  },
});

export default PrivacyConsentScreen;
