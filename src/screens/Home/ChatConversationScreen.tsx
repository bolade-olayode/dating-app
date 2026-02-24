// src/screens/Home/ChatConversationScreen.tsx

import React, { useState, useRef, useCallback, useEffect } from 'react';
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
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';
import { chatService } from '@services/api/chatService';
import { useUser } from '@context/UserContext';
import { devLog } from '@config/environment';

const { width } = Dimensions.get('window');

interface Message {
  id: number;
  text?: string;
  image?: any;
  isVideo?: boolean;
  sent: boolean;
  time: string;
  liked: boolean;
  date?: string;
}

// Icebreaker prompts
const ICEBREAKERS = [
  "What's the best trip you've ever been on?",
  "What are you watching right now?",
  "If you could have dinner with anyone, who?",
  "What's your love language?",
  "Pineapple on pizza, yes or no?",
  "What's the most spontaneous thing you've done?",
];

// Realistic conversation per chat ID
const CHAT_MESSAGES: Record<number, Message[]> = {
  1: [
    { id: 1, image: require('../../assets/images/opuehbckgdimg2.png'), isVideo: true, sent: false, time: '11:42', liked: false },
    { id: 2, text: "Omg you look so good in this! Where was this?", sent: true, time: '11:43', liked: false },
    { id: 3, text: "Aww thanks! It was at a friend's wedding in Calabar last month", sent: false, time: '11:44', liked: true },
    { id: 4, text: "I had a really stressful day and would love some peace and quiet you know, to unwind and release the days tension and all that but i cant. Theres my meal to prepare and some laundry to be done before i can afford that.", sent: true, time: '11:45', liked: true },
    { id: 5, date: 'Today', text: '', sent: false, time: '', liked: false },
    { id: 6, text: "Aww sorry about that. You know what helps? Good music and jollof rice. I could share my playlist if you want", sent: false, time: '12:01', liked: true },
    { id: 7, text: "Lol you had me at jollof rice. Please share!", sent: true, time: '12:03', liked: false },
    { id: 8, text: "Haha I knew that would work. Sending it now", sent: false, time: '12:04', liked: false },
  ],
  2: [
    { id: 1, text: "Hey! I noticed you watch anime too. What's your top 3?", sent: false, time: '09:30', liked: false },
    { id: 2, text: "Oh you're speaking my language now! Attack on Titan, Jujutsu Kaisen, and Death Note. You?", sent: true, time: '09:35', liked: true },
    { id: 3, text: "Great taste! Mine is Naruto, Demon Slayer and Spy x Family", sent: false, time: '09:37', liked: false },
    { id: 4, text: "Spy x Family is so wholesome. Anya is the best character in all of anime lol", sent: true, time: '09:40', liked: false },
    { id: 5, date: 'Today', text: '', sent: false, time: '', liked: false },
    { id: 6, text: "Haha that's so funny! What kind of anime do you watch? Like are you more into shonen or slice of life?", sent: false, time: '10:23', liked: false },
  ],
  3: [
    { id: 1, text: "Hi there! Love your profile. The photography is really cool", sent: false, time: 'Yesterday', liked: false },
    { id: 2, text: "Thank you! I've been getting into it recently. Do you take photos too?", sent: true, time: 'Yesterday', liked: false },
    { id: 3, text: "A little bit! Mostly on my phone though. Would love to learn proper photography", sent: false, time: 'Yesterday', liked: true },
    { id: 4, text: "Would love to grab coffee sometime if you're up for it", sent: false, time: '09:15', liked: false },
  ],
  4: [
    { id: 1, text: "Your music taste though! I saw you had Burna Boy on your profile", sent: true, time: 'Yesterday', liked: false },
    { id: 2, text: "Yesss! Last Last is literally my anthem. What other artists do you listen to?", sent: false, time: 'Yesterday', liked: false },
    { id: 3, text: "Wizkid, Tems, Rema, some Asake too. Basically anything afrobeats", sent: true, time: 'Yesterday', liked: true },
    { id: 4, text: "Your taste in music is actually elite ngl", sent: false, time: 'Yesterday', liked: false },
  ],
  // Chat 5 is a new match - empty conversation, icebreakers will show
  5: [],
};

// Simulated replies for when user sends a message
const SIMULATED_REPLIES = [
  "Haha that's so sweet of you to say",
  "Omg really? Tell me more!",
  "I love that! We have so much in common",
  "Lol you're funny. I like that",
  "That's actually a great point",
  "Aww you're making me blush",
  "No way! That's exactly how I feel too",
  "Interesting... I never thought about it like that",
];

interface ChatConversationProps {
  route: {
    params: {
      chatId: number;
      name: string;
      photo: any;
      age: number;
      location: string;
      isNewMatch?: boolean;
    };
  };
  navigation: any;
}

const ChatConversationScreen: React.FC<ChatConversationProps> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { profile: currentUserProfile } = useUser();
  const { chatId, name, photo, age, location, isNewMatch } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(CHAT_MESSAGES[chatId] || []);
  const [showIcebreakers, setShowIcebreakers] = useState(messages.length === 0);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch messages from API on mount + mark conversation as read
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      chatService.markConversationRead(chatId);

      const result = await chatService.getMessages(chatId);
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        const mapped: Message[] = result.data.map((m: any) => ({
          id: m._id || m.id || Date.now(),
          text: m.content || m.text || '',
          image: m.type === 'image' && typeof m.content === 'string' ? { uri: m.content } : undefined,
          sent: m.isMine === true || (
            currentUserProfile?.id != null &&
            String(m.senderId || (typeof m.sender === 'string' ? m.sender : m.sender?._id) || '') === String(currentUserProfile.id)
          ),
          time: m.createdAt && !isNaN(new Date(m.createdAt).getTime())
            ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '',
          liked: false,
        }));
        devLog('✅ Chat: Loaded', mapped.length, 'messages from API');
        setMessages(mapped);
        setShowIcebreakers(mapped.length === 0);
      } else {
        // Keep mock messages as fallback
        const mockMsgs = CHAT_MESSAGES[chatId] || [];
        setShowIcebreakers(mockMsgs.length === 0);
      }
      setIsLoadingMessages(false);
    };
    fetchMessages();

    // Poll for new messages every 10 seconds
    pollingRef.current = setInterval(async () => {
      const result = await chatService.getMessages(chatId);
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        const mapped: Message[] = result.data.map((m: any) => ({
          id: m._id || m.id || Date.now(),
          text: m.content || m.text || '',
          image: m.type === 'image' && typeof m.content === 'string' ? { uri: m.content } : undefined,
          sent: m.isMine === true || (
            currentUserProfile?.id != null &&
            String(m.senderId || (typeof m.sender === 'string' ? m.sender : m.sender?._id) || '') === String(currentUserProfile.id)
          ),
          time: m.createdAt && !isNaN(new Date(m.createdAt).getTime())
            ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '',
          liked: false,
        }));
        setMessages(mapped);
      }
    }, 10000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [chatId]);

  const scrollToEnd = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const sendMessageFn = useCallback((text: string) => {
    if (!text.trim()) return;
    const newMsg: Message = {
      id: Date.now(),
      text: text.trim(),
      sent: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      liked: false,
    };
    // Optimistic UI — add message locally immediately
    setMessages((prev) => [...prev, newMsg]);
    setMessage('');
    setShowIcebreakers(false);
    scrollToEnd();

    // Fire API in background
    chatService.sendMessage(chatId, text.trim(), 'text').then((result) => {
      if (!result.success) {
        devLog('⚠️ Chat: Failed to send message via API, kept locally');
      }
    });
  }, [scrollToEnd, chatId]);

  const handleSend = () => sendMessageFn(message);

  const handleIcebreaker = (prompt: string) => {
    sendMessageFn(prompt);
  };

  const toggleLike = (msgId: number) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, liked: !m.liked } : m))
    );
  };

  const renderMessage = ({ item }: { item: Message }) => {
    if (item.date) {
      return (
        <View style={styles.dateSeparator}>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      );
    }

    const isSent = item.sent;

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

  const renderIcebreakers = () => {
    if (!showIcebreakers) return null;
    return (
      <View style={styles.icebreakersSection}>
        <View style={styles.icebreakersHeader}>
          <Icon name="sparkles" size={18} color="#FF007B" />
          <Text style={styles.icebreakersTitle}>Break the ice</Text>
        </View>
        <Text style={styles.icebreakersSubtitle}>
          Not sure what to say? Try one of these
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.icebreakersRow}
        >
          {ICEBREAKERS.map((prompt, index) => (
            <TouchableOpacity
              key={index}
              style={styles.icebreakerChip}
              activeOpacity={0.7}
              onPress={() => handleIcebreaker(prompt)}
            >
              <Text style={styles.icebreakerText}>{prompt}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
      {isLoadingMessages ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#FF007B" />
        </View>
      ) : (
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.messagesList,
          messages.length === 0 && styles.emptyMessages,
        ]}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        ListHeaderComponent={renderIcebreakers}
        ListEmptyComponent={
          !showIcebreakers ? null : (
            <View style={styles.newMatchBanner}>
              <Image source={photo} style={styles.newMatchPhoto} />
              <Text style={styles.newMatchText}>You matched with {name}!</Text>
              <Text style={styles.newMatchHint}>Send a message to get started</Text>
            </View>
          )
        }
      />
      )}

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
  emptyMessages: {
    flexGrow: 1,
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
  // Icebreakers
  icebreakersSection: {
    marginBottom: 20,
  },
  icebreakersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  icebreakersTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
    color: '#FFF',
  },
  icebreakersSubtitle: {
    fontFamily: FONTS.Regular,
    fontSize: 13,
    color: '#888',
    marginBottom: 14,
  },
  icebreakersRow: {
    gap: 10,
  },
  icebreakerChip: {
    backgroundColor: 'rgba(255, 0, 123, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 123, 0.25)',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: width * 0.65,
  },
  icebreakerText: {
    fontFamily: FONTS.Medium,
    fontSize: 13,
    color: '#FF69B4',
  },
  // New match banner
  newMatchBanner: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  newMatchPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FF007B',
    marginBottom: 16,
  },
  newMatchText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    color: '#FFF',
    marginBottom: 6,
  },
  newMatchHint: {
    fontFamily: FONTS.Regular,
    fontSize: 13,
    color: '#888',
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
