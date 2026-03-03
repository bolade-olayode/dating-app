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

import React, { useEffect, useRef } from 'react';
import { Platform, StyleSheet, View, Text, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
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
      const timer = setTimeout(() => {
        Alert.alert(
          'Complete Your Profile',
          'A complete profile gets up to 3× more matches. Finish setting up your profile now.',
          [
            { text: 'Later', style: 'cancel' },
            { text: 'Complete Profile', onPress: () => navigation.navigate('EditProfile') },
          ],
        );
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [profile, navigation]);

  // Per-session: prompt to optimize discovery settings
  useEffect(() => {
    if (_sessionDiscoveryPromptShown || !profile) return;
    _sessionDiscoveryPromptShown = true;

    const timer = setTimeout(() => {
      Alert.alert(
        'Optimize Your Discovery',
        'Set your distance, age range, and preferences to see more relevant matches.',
        [
          { text: 'Later', style: 'cancel' },
          { text: 'Set Preferences', onPress: () => navigation.navigate('DiscoverySettings') },
        ],
      );
    }, 4000);
    return () => clearTimeout(timer);
  }, [profile, navigation]);

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
});

export default TabNavigator;
