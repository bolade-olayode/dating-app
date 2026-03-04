// src/navigation/TabNavigator.tsx

/**
 * BOTTOM TAB NAVIGATOR
 *
 * Main navigation for the app with 5 tabs:
 * 1. Home (Discovery)
 * 2. Explore
 * 3. Chats
 * 4. Wallet
 * 5. Me (Profile)
 */

import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { FONTS } from '@config/fonts';
import { useUser } from '@context/UserContext';
import { chatService } from '@services/api/chatService';

// Import tab screens
import DiscoveryScreen from '@screens/Home/DiscoveryScreen';
import ExploreScreen from '@screens/Home/ExploreScreen';
import ChatsScreen from '@screens/Home/ChatsScreen';
import NotificationsScreen from '@screens/Home/NotificationsScreen';
import MeScreen from '@screens/Home/MeScreen';

export type TabParamList = {
  Discovery: undefined;
  Explore: undefined;
  Chats: undefined;
  Notifications: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

// Module-level flags — reset each time the app (re)loads
let _sessionProfilePromptShown = false;
let _sessionDiscoveryPromptShown = false;

const TabNavigator = () => {
  const navigation = useNavigation<any>();
  const { unreadChatCount, setUnreadChatCount, profile } = useUser();

  const [showProfileCard, setShowProfileCard]     = useState(false);
  const [showDiscoveryCard, setShowDiscoveryCard] = useState(false);

  // Per-session: prompt to complete profile if < 100%
  useEffect(() => {
    if (_sessionProfilePromptShown || !profile) return;

    const checks = [
      (profile.photos?.length ?? 0) >= 2,
      !!profile.bio?.trim(),
      (profile.interests?.length ?? 0) >= 5,
      (profile.prompts?.length ?? 0) >= 2,
      !!profile.relationshipGoal,
      !!profile.height && !!profile.weight,
      !!profile.education,
    ];
    const pct = checks.filter(Boolean).length / checks.length * 100;

    if (pct < 100) {
      _sessionProfilePromptShown = true;
      const timer = setTimeout(() => setShowProfileCard(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [profile]);

  // Per-session: prompt to optimize discovery settings
  useEffect(() => {
    if (_sessionDiscoveryPromptShown || !profile) return;
    _sessionDiscoveryPromptShown = true;

    // Only show discovery card after profile card is dismissed (delay longer)
    const timer = setTimeout(() => setShowDiscoveryCard(true), 4000);
    return () => clearTimeout(timer);
  }, [profile]);

  // Poll unread count every 30 seconds
  useEffect(() => {
    const fetchUnread = async () => {
      const result = await chatService.getUnreadCount();
      if (result.success && result.data != null) {
        const count = typeof result.data === 'number' ? result.data : result.data?.count ?? 0;
        setUnreadChatCount(count);
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [setUnreadChatCount]);

  return (
    <>
      {/* ── Profile completion card ────────────────────────── */}
      <Modal visible={showProfileCard} transparent animationType="slide" onRequestClose={() => setShowProfileCard(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowProfileCard(false)}>
          <TouchableOpacity style={styles.modalCard} activeOpacity={1} onPress={() => {}}>
            <View style={styles.modalIconRing}>
              <Icon name="person-circle-outline" size={32} color="#FF007B" />
            </View>
            <Text style={styles.modalTitle}>Complete Your Profile</Text>
            <Text style={styles.modalBody}>
              A complete profile gets up to 3× more matches. Take a moment to finish setting up yours.
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => { setShowProfileCard(false); navigation.navigate('EditProfile'); }}
            >
              <LinearGradient
                colors={['#FF007B', '#FF4458']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.modalPrimaryBtn}
              >
                <Text style={styles.modalPrimaryText}>Complete Profile</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowProfileCard(false)} style={styles.modalSecondaryBtn}>
              <Text style={styles.modalSecondaryText}>Later</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ── Discovery settings card ───────────────────────── */}
      <Modal visible={showDiscoveryCard} transparent animationType="slide" onRequestClose={() => setShowDiscoveryCard(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowDiscoveryCard(false)}>
          <TouchableOpacity style={styles.modalCard} activeOpacity={1} onPress={() => {}}>
            <View style={styles.modalIconRing}>
              <Icon name="options-outline" size={32} color="#FF007B" />
            </View>
            <Text style={styles.modalTitle}>Optimise Your Discovery</Text>
            <Text style={styles.modalBody}>
              Set your distance, age range and preferences to see the most relevant people near you.
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => { setShowDiscoveryCard(false); navigation.navigate('DiscoverySettings'); }}
            >
              <LinearGradient
                colors={['#FF007B', '#FF4458']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.modalPrimaryBtn}
              >
                <Text style={styles.modalPrimaryText}>Set Preferences</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowDiscoveryCard(false)} style={styles.modalSecondaryBtn}>
              <Text style={styles.modalSecondaryText}>Later</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#FF007B', // Pink active color
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,        // Floating above bottom
          left: 20,          // Spacing from left
          right: 20,         // Spacing from right
          backgroundColor: '#000000', // Black inner fill
          borderTopColor: 'transparent',
          height: 80,        // Slightly reduced for floating effect
          borderRadius: 40,  // Full pill shape
          paddingLeft: 25,
          paddingRight: 25,
          paddingTop: 10,
          paddingBottom: 15,
          // Shadow for depth
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.25,
          shadowRadius: 15,
          // Android elevation
          elevation: 10,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint="dark"
            style={[
              StyleSheet.absoluteFill,
              {
                borderRadius: 40,
                backgroundColor: 'rgba(0,0,0,0.7)', // Semi-transparent for glass effect
              },
            ]}
          />
        ),
        tabBarLabelStyle: {
          fontFamily: FONTS.Medium,
          fontSize: 10,
          marginTop: -3,
          fontWeight: '500',
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
      })}
    >
      <Tab.Screen
        name="Discovery"
        component={DiscoveryScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={focused ? "flame" : "flame-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={focused ? "compass" : "compass-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chats"
        component={ChatsScreen}
        options={{
          tabBarLabel: 'Chats',
          tabBarIcon: ({ focused, color, size }) => (
            <View>
              <Icon
                name={focused ? "chatbubbles" : "chatbubbles-outline"}
                size={26}
                color={color}
              />
              {/* Badge for unread messages */}
              {unreadChatCount > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>
                    {unreadChatCount > 99 ? '99+' : unreadChatCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: 'Alerts',
          tabBarIcon: ({ focused, color }) => (
            <Icon
              name={focused ? "notifications" : "notifications-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={MeScreen}
        options={{
          tabBarLabel: 'Me',
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={focused ? "person" : "person-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    position: 'absolute',
    right: -10,
    top: -5,
    backgroundColor: '#FF007B',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderWidth: 1.5,
    borderColor: '#000',
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
    fontFamily: FONTS.Medium,
  },
  // ── Prompt modals ─────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: 'rgba(14,14,14,0.97)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 48,
    alignItems: 'center',
  },
  modalIconRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,0,123,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,0,123,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 22,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalBody: {
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  modalPrimaryBtn: {
    width: '100%',
    paddingVertical: 17,
    borderRadius: 30,
    alignItems: 'center',
    minWidth: 280,
  },
  modalPrimaryText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    color: '#FFF',
  },
  modalSecondaryBtn: {
    marginTop: 16,
    paddingVertical: 8,
  },
  modalSecondaryText: {
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#555',
  },
});

export default TabNavigator;
