// src/screens/Home/ChatsScreen.tsx

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  StatusBar,
  Animated,
  Modal,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';
import Flare from '@components/ui/Flare';
import { useUser } from '@context/UserContext';

const { width } = Dimensions.get('window');

// Placeholder active matches (online users)
const ACTIVE_MATCHES = [
  { id: 1, name: 'Sarah', photo: require('../../assets/images/opuehbckgdimg.jpg'), online: true },
  { id: 2, name: 'Uwem', photo: require('../../assets/images/opuehbckgdimg2.png'), online: true },
  { id: 3, name: 'Zainab', photo: require('../../assets/images/opuehbckgdimg3.png'), online: false },
  { id: 4, name: 'Chioma', photo: require('../../assets/images/opuehbckgdimg.jpg'), online: true },
  { id: 5, name: 'Blessing', photo: require('../../assets/images/opuehbckgdimg2.png'), online: true },
  { id: 6, name: 'Grace', photo: require('../../assets/images/opuehbckgdimg3.png'), online: false },
];

// Placeholder conversations with varied data
const CONVERSATIONS = [
  {
    id: 1,
    name: 'Uwem Kelly',
    photo: require('../../assets/images/opuehbckgdimg2.png'),
    lastMessage: "I had a really stressful day and would love some peace...",
    time: '11:56',
    unread: 3,
    age: 35,
    location: 'Ontario, Russia',
    isNewMatch: false,
  },
  {
    id: 2,
    name: 'Amara Obi',
    photo: require('../../assets/images/opuehbckgdimg3.png'),
    lastMessage: "Haha that's so funny! What kind of anime do you watch?",
    time: '10:23',
    unread: 7,
    age: 28,
    location: 'Lagos, Nigeria',
    isNewMatch: false,
  },
  {
    id: 3,
    name: 'Zainab Musa',
    photo: require('../../assets/images/opuehbckgdimg.jpg'),
    lastMessage: "Would love to grab coffee sometime if you're up for it",
    time: '09:15',
    unread: 0,
    age: 26,
    location: 'Abuja, Nigeria',
    isNewMatch: false,
  },
  {
    id: 4,
    name: 'Blessing Eze',
    photo: require('../../assets/images/opuehbckgdimg2.png'),
    lastMessage: "Your taste in music is actually elite ngl",
    time: 'Yesterday',
    unread: 11,
    age: 24,
    location: 'Port Harcourt, Nigeria',
    isNewMatch: false,
  },
  {
    id: 5,
    name: 'Chioma Nwankwo',
    photo: require('../../assets/images/opuehbckgdimg3.png'),
    lastMessage: "",
    time: 'Yesterday',
    unread: 0,
    age: 30,
    location: 'Enugu, Nigeria',
    isNewMatch: true,
  },
];

const FILTER_TABS = ['Active', 'New matches', 'Ended', 'Unread'];

const MENU_OPTIONS = [
  { label: 'Read all', icon: 'checkmark-done-outline' },
  { label: 'Delete chats', icon: 'trash-outline' },
  { label: 'Select chats', icon: 'checkbox-outline' },
  { label: 'End chats', icon: 'close-outline' },
];

const ChatsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { matches } = useUser();
  const [activeFilter, setActiveFilter] = useState('Active');
  const [menuVisible, setMenuVisible] = useState(false);

  // Merge real matches from context with mock conversations
  const matchConversations = matches.map(match => ({
    id: match.id,
    name: match.profile.name,
    photo: match.profile.photo,
    lastMessage: '',
    time: new Date(match.matchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    unread: 0,
    age: match.profile.age,
    location: match.profile.location,
    isNewMatch: true,
  }));

  // Real matches first, then mock data
  const allConversations = [...matchConversations, ...CONVERSATIONS];

  const renderActiveMatch = ({ item }: { item: typeof ACTIVE_MATCHES[0] }) => (
    <TouchableOpacity style={styles.activeMatchItem} activeOpacity={0.8}>
      <View style={styles.activeMatchPhotoContainer}>
        <Image source={item.photo} style={styles.activeMatchPhoto} />
        {item.online && <View style={styles.onlineDot} />}
      </View>
    </TouchableOpacity>
  );

  const renderConversation = ({ item }: { item: typeof CONVERSATIONS[0] }) => (
    <TouchableOpacity
      style={styles.conversationRow}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('ChatConversation', {
        chatId: item.id,
        name: item.name,
        photo: item.photo,
        age: item.age,
        location: item.location,
        isNewMatch: item.isNewMatch,
      })}
    >
      <Image source={item.photo} style={styles.conversationAvatar} />
      <View style={styles.conversationInfo}>
        <Text style={styles.conversationName} numberOfLines={1}>{item.name}</Text>
        <Text style={[styles.conversationPreview, item.isNewMatch && styles.newMatchPreview]} numberOfLines={1}>
          {item.isNewMatch ? 'New match! Say hi' : item.lastMessage}
        </Text>
      </View>
      <View style={styles.conversationMeta}>
        <Text style={styles.conversationTime}>{item.time}</Text>
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>+{item.unread}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <StatusBar barStyle="light-content" />
      <Flare />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIcon} activeOpacity={0.7}>
            <Icon name="camera-outline" size={22} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon} activeOpacity={0.7}>
            <Icon name="search-outline" size={22} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIcon}
            activeOpacity={0.7}
            onPress={() => setMenuVisible(true)}
          >
            <Icon name="ellipsis-vertical" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Matches Row */}
      <FlatList
        data={ACTIVE_MATCHES}
        renderItem={renderActiveMatch}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.activeMatchesRow}
        style={styles.activeMatchesList}
      />

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={styles.filterContainer}
      >
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.filterTab,
              activeFilter === tab && styles.filterTabActive,
            ]}
            activeOpacity={0.7}
            onPress={() => setActiveFilter(tab)}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === tab && styles.filterTabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Conversation List */}
      <FlatList
        data={allConversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conversationList}
        style={styles.conversationFlatList}
      />

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={[styles.menuDropdown, { top: insets.top + 50 }]}>
            {MENU_OPTIONS.map((option, index) => (
              <TouchableOpacity
                key={option.label}
                style={[
                  styles.menuItem,
                  index < MENU_OPTIONS.length - 1 && styles.menuItemBorder,
                ]}
                activeOpacity={0.7}
                onPress={() => setMenuVisible(false)}
              >
                <Text style={styles.menuItemText}>{option.label}</Text>
                <Icon name={option.icon} size={18} color="#FFF" />
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 28,
    color: '#FFF',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIcon: {
    padding: 4,
  },
  // Active Matches
  activeMatchesList: {
    maxHeight: 80,
  },
  activeMatchesRow: {
    paddingHorizontal: 20,
    gap: 12,
  },
  activeMatchItem: {
    alignItems: 'center',
  },
  activeMatchPhotoContainer: {
    position: 'relative',
  },
  activeMatchPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FF007B',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#00E676',
    borderWidth: 2.5,
    borderColor: '#000',
  },
  // Filter Tabs
  filterContainer: {
    maxHeight: 50,
    marginTop: 16,
  },
  filterRow: {
    paddingHorizontal: 20,
    gap: 10,
    alignItems: 'center',
  },
  filterTab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  filterTabActive: {
    backgroundColor: '#FFF',
    borderColor: '#FFF',
  },
  filterTabText: {
    fontFamily: FONTS.Medium,
    fontSize: 13,
    color: '#999',
  },
  filterTabTextActive: {
    color: '#000',
    fontFamily: FONTS.SemiBold,
  },
  // Conversation List
  conversationFlatList: {
    flex: 1,
    marginTop: 16,
  },
  conversationList: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  conversationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  conversationAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 14,
  },
  conversationInfo: {
    flex: 1,
    marginRight: 10,
  },
  conversationName: {
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
    color: '#FFF',
    marginBottom: 4,
  },
  conversationPreview: {
    fontFamily: FONTS.Regular,
    fontSize: 13,
    color: '#888',
  },
  newMatchPreview: {
    color: '#FF007B',
    fontFamily: FONTS.Medium,
  },
  conversationMeta: {
    alignItems: 'flex-end',
    gap: 6,
  },
  conversationTime: {
    fontFamily: FONTS.Regular,
    fontSize: 12,
    color: '#666',
  },
  unreadBadge: {
    backgroundColor: '#FF007B',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    minWidth: 28,
    alignItems: 'center',
  },
  unreadText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 11,
    color: '#FFF',
  },
  // Menu
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuDropdown: {
    position: 'absolute',
    right: 20,
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    paddingVertical: 6,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  menuItemText: {
    fontFamily: FONTS.Medium,
    fontSize: 14,
    color: '#FFF',
  },
});

export default ChatsScreen;
