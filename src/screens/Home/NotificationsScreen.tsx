// src/screens/Home/NotificationsScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { NotificationRowSkeleton } from '@components/ui/SkeletonLoader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';
import Flare from '@components/ui/Flare';
import { notificationService } from '@services/api/notificationService';
import { devLog } from '@config/environment';

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  createdAt: string;
}

const NotificationsScreen = () => {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchNotifications = useCallback(async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    const result = await notificationService.getNotifications(50, 0);
    if (result.success && Array.isArray(result.data)) {
      const mapped: Notification[] = result.data.map((n: any) => ({
        id: n._id || n.id,
        title: n.title || 'Notification',
        body: n.body || n.message || '',
        type: n.type || 'general',
        read: n.read ?? false,
        createdAt: n.createdAt || '',
      }));
      devLog('✅ Notifications: Loaded', mapped.length);
      setNotifications(mapped);
    }
    setIsLoading(false);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchNotifications(false);
  };

  const handleMarkAllRead = async () => {
    const result = await notificationService.markAllRead();
    if (result.success) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const handleDelete = async (id: string) => {
    const result = await notificationService.deleteNotification(id);
    if (result.success) {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'match': return 'heart';
      case 'message': return 'chatbubble';
      case 'like': return 'heart-outline';
      default: return 'notifications-outline';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'match': return '#FF007B';
      case 'message': return '#00D4FF';
      case 'like': return '#FF69B4';
      default: return '#888';
    }
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationRow, !item.read && styles.unreadRow]}
      activeOpacity={0.7}
      onLongPress={() => handleDelete(item.id)}
    >
      <View style={[styles.iconCircle, { backgroundColor: `${getIconColor(item.type)}20` }]}>
        <Icon name={getIcon(item.type)} size={18} color={getIconColor(item.type)} />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.notificationBody} numberOfLines={2}>{item.body}</Text>
      </View>
      <View style={styles.notificationMeta}>
        <Text style={styles.notificationTime}>{formatTime(item.createdAt)}</Text>
        {!item.read && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Flare />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={{ width: 36 }} />
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.7}>
          <Text style={styles.markAllText}>Read all</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <NotificationRowSkeleton key={i} />
          ))}
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="notifications-off-outline" size={48} color="#333" />
          <Text style={styles.emptyTitle}>No notifications yet</Text>
          <Text style={styles.emptySubtitle}>
            When you get matches, messages, or likes, they'll show up here
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#FF007B"
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
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
    fontFamily: FONTS.Bold,
    fontSize: 22,
    color: '#FFF',
  },
  markAllText: {
    fontFamily: FONTS.Medium,
    fontSize: 13,
    color: '#FF007B',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  unreadRow: {
    backgroundColor: 'rgba(255, 0, 123, 0.04)',
    marginHorizontal: -20,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  notificationContent: {
    flex: 1,
    marginRight: 10,
  },
  notificationTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: 14,
    color: '#FFF',
    marginBottom: 4,
  },
  notificationBody: {
    fontFamily: FONTS.Regular,
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
  },
  notificationMeta: {
    alignItems: 'flex-end',
    gap: 6,
  },
  notificationTime: {
    fontFamily: FONTS.Regular,
    fontSize: 11,
    color: '#666',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF007B',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: 18,
    color: '#FFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default NotificationsScreen;
