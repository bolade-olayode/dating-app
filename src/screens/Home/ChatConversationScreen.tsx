// src/screens/Home/ChatConversationScreen.tsx

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';

const { width } = Dimensions.get('window');

interface Message {
  id: number;
  text?: string;
  image?: any;
  isVideo?: boolean;
  sent: boolean; // true = current user sent, false = received
  time: string;
  liked: boolean;
  date?: string; // date separator
}

// Placeholder messages matching Figma
const MOCK_MESSAGES: Message[] = [
  {
    id: 1,
    image: require('../../assets/images/opuehbckgdimg.jpg'),
    isVideo: true,
    sent: false,
    time: '11:42',
    liked: false,
  },
  {
    id: 2,
    text: "I had a really stressful day and would love some peace and quiet you know, to unwind and release the days tension and all that but i cant. Theres my meal to prepare and some laundry to be done before i can afford that.",
    sent: true,
    time: '11:45',
    liked: true,
  },
  {
    id: 3,
    date: 'January 24, 2926',
    text: '',
    sent: false,
    time: '',
    liked: false,
  },
  {
    id: 4,
    text: "I had a really stressful day and would love some peace and quiet you know, to unwind and release the days tension and all that but i cant. Theres my meal to prepare and some laundry to be done before i can afford that.",
    sent: false,
    time: '12:01',
    liked: true,
  },
];

interface ChatConversationProps {
  route: {
    params: {
      chatId: number;
      name: string;
      photo: any;
      age: number;
      location: string;
    };
  };
  navigation: any;
}

const ChatConversationScreen: React.FC<ChatConversationProps> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { name, photo, age, location } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (!message.trim()) return;
    const newMsg: Message = {
      id: Date.now(),
      text: message.trim(),
      sent: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      liked: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    setMessage('');
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const toggleLike = (msgId: number) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, liked: !m.liked } : m))
    );
  };

  const renderMessage = ({ item }: { item: Message }) => {
    // Date separator
    if (item.date) {
      return (
        <View style={styles.dateSeparator}>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      );
    }

    const isSent = item.sent;

    // Image/Video message
    if (item.image) {
      return (
        <View style={[styles.messageBubbleRow, isSent ? styles.sentRow : styles.receivedRow]}>
          <View style={[styles.mediaBubble, isSent ? styles.sentMedia : styles.receivedMedia]}>
            <Image source={item.image} style={styles.messageImage} resizeMode="cover" />
            {item.isVideo && (
              <View style={styles.playButton}>
                <Icon name="play" size={24} color="#FFF" />
              </View>
            )}
          </View>
        </View>
      );
    }

    // Text message
    return (
      <View style={[styles.messageBubbleRow, isSent ? styles.sentRow : styles.receivedRow]}>
        <View style={[styles.textBubble, isSent ? styles.sentBubble : styles.receivedBubble]}>
          <Text style={[styles.messageText, isSent ? styles.sentText : styles.receivedText]}>
            {item.text}
          </Text>
          <TouchableOpacity
            style={[styles.heartIndicator, isSent ? styles.heartSent : styles.heartReceived]}
            onPress={() => toggleLike(item.id)}
            activeOpacity={0.7}
          >
            <Icon
              name={item.liked ? 'heart' : 'heart-outline'}
              size={14}
              color={item.liked ? '#FF007B' : '#666'}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header with gradient */}
      <LinearGradient
        colors={['#FF007B', '#CC0066', '#1A1A1A', '#000']}
        style={[styles.headerGradient, { paddingTop: insets.top }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Icon name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{name}</Text>
            <Text style={styles.headerSubtitle}>{age} y.o, {location}</Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerActionBtn} activeOpacity={0.7}>
              <Icon name="search" size={20} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerActionBtn} activeOpacity={0.7}>
              <Icon name="ellipsis-vertical" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Input Bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
          <TouchableOpacity style={styles.attachButton} activeOpacity={0.7}>
            <Icon name="add" size={24} color="#888" />
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Send a message"
              placeholderTextColor="#666"
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={1000}
            />
          </View>

          <TouchableOpacity
            style={[styles.sendButton, message.trim() ? styles.sendButtonActive : null]}
            activeOpacity={0.7}
            onPress={handleSend}
          >
            <Icon
              name="send"
              size={18}
              color={message.trim() ? '#FFF' : '#666'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  // Header
  headerGradient: {
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontFamily: FONTS.Bold,
    fontSize: 20,
    color: '#FFF',
  },
  headerSubtitle: {
    fontFamily: FONTS.Regular,
    fontSize: 13,
    color: '#00E676',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Messages
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 8,
  },
  messageBubbleRow: {
    marginBottom: 12,
    maxWidth: width * 0.78,
  },
  sentRow: {
    alignSelf: 'flex-end',
  },
  receivedRow: {
    alignSelf: 'flex-start',
  },
  // Text bubbles
  textBubble: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    position: 'relative',
  },
  sentBubble: {
    backgroundColor: '#1A1A2E',
    borderBottomRightRadius: 6,
  },
  receivedBubble: {
    backgroundColor: '#1A1A1A',
    borderBottomLeftRadius: 6,
  },
  messageText: {
    fontFamily: FONTS.Regular,
    fontSize: 14,
    lineHeight: 22,
  },
  sentText: {
    color: '#FFF',
  },
  receivedText: {
    color: '#DDD',
  },
  heartIndicator: {
    position: 'absolute',
    bottom: -8,
    padding: 2,
  },
  heartSent: {
    right: 12,
  },
  heartReceived: {
    left: 12,
  },
  // Media bubbles
  mediaBubble: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  sentMedia: {
    borderBottomRightRadius: 6,
  },
  receivedMedia: {
    borderBottomLeftRadius: 6,
  },
  messageImage: {
    width: width * 0.55,
    height: width * 0.55,
    borderRadius: 20,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -22,
    marginLeft: -22,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  // Date separator
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 20,
  },
  dateText: {
    fontFamily: FONTS.Regular,
    fontSize: 12,
    color: '#666',
  },
  // Input bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: '#000',
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 2,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 120,
    marginRight: 8,
  },
  textInput: {
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#FFF',
    padding: 0,
    maxHeight: 80,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  sendButtonActive: {
    backgroundColor: '#FF007B',
  },
});

export default ChatConversationScreen;
