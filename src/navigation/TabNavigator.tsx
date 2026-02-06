// src/navigation/TabNavigator.tsx

/**
 * BOTTOM TAB NAVIGATOR
 *
 * Main navigation for the app with 5 tabs:
 * 1. Home (Discovery)
 * 2. Explore
 * 3. Chats
 * 4. Notifications
 * 5. Me (Profile)
 */

import React from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';

// Import tab screens
import DiscoveryScreen from '@screens/Home/DiscoveryScreen';
import ExploreScreen from '@screens/Home/ExploreScreen';
import ChatsScreen from '@screens/Home/ChatsScreen';
import NotificationsScreen from '@screens/Home/NotificationsScreen';
import ProfileScreen from '@screens/Home/ProfileScreen';

export type TabParamList = {
  Discovery: undefined;
  Explore: undefined;
  Chats: undefined;
  Notifications: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
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
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>11+</Text>
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ focused, color, size }) => (
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
        component={ProfileScreen}
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
