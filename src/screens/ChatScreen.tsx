import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { useTheme, Button, Card, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ChatScreenProps {
  navigation: any;
}

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

interface ChatRoom {
  id: string;
  name: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [message, setMessage] = useState('');
  const [isVoiceChatActive, setIsVoiceChatActive] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const chatRooms: ChatRoom[] = [
    {
      id: '1',
      name: 'Malenia Fight Club',
      participants: ['Tarnished_Warrior', 'Radagon_Hunter', 'Blood_Lord'],
      lastMessage: 'Anyone up for Malenia?',
      lastMessageTime: '2 min ago',
      unreadCount: 3,
    },
    {
      id: '2',
      name: 'Remembrance Quest Group',
      participants: ['Elden_Lord', 'Moon_Queen', 'Astrologer_Mage'],
      lastMessage: 'Great fight everyone!',
      lastMessageTime: '5 min ago',
      unreadCount: 0,
    },
    {
      id: '3',
      name: 'Exploration Team',
      participants: ['Explorer_One', 'Map_Master', 'Loot_Hunter'],
      lastMessage: 'Found a new secret area',
      lastMessageTime: '10 min ago',
      unreadCount: 1,
    },
  ];

  const messages: Message[] = [
    {
      id: '1',
      sender: 'Tarnished_Warrior',
      text: 'Anyone up for Malenia?',
      timestamp: '2:30 PM',
      isOwn: false,
    },
    {
      id: '2',
      sender: 'You',
      text: 'I\'m down! What password?',
      timestamp: '2:31 PM',
      isOwn: true,
    },
    {
      id: '3',
      sender: 'Radagon_Hunter',
      text: 'MALENIA1 - I\'ll be there in 5',
      timestamp: '2:32 PM',
      isOwn: false,
    },
    {
      id: '4',
      sender: 'Blood_Lord',
      text: 'Count me in too!',
      timestamp: '2:33 PM',
      isOwn: false,
    },
    {
      id: '5',
      sender: 'You',
      text: 'Perfect! See you all there',
      timestamp: '2:34 PM',
      isOwn: true,
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, you'd send the message to the server
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleVoiceChat = () => {
    if (isVoiceChatActive) {
      setIsVoiceChatActive(false);
      Alert.alert('Voice Chat', 'Voice chat ended');
    } else {
      setIsVoiceChatActive(true);
      Alert.alert('Voice Chat', 'Voice chat started');
    }
  };

  const renderChatRoom = ({ item }: { item: ChatRoom }) => (
    <TouchableOpacity
      style={[styles.chatRoomCard, { backgroundColor: theme.colors.surface }]}
      onPress={() => setSelectedRoom(item)}
    >
      <View style={styles.chatRoomHeader}>
        <Avatar
          title={item.name.charAt(0)}
          rounded
          size="medium"
          containerStyle={styles.avatar}
        />
        <View style={styles.chatRoomInfo}>
          <Text style={[styles.chatRoomName, { color: theme.colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.chatRoomParticipants, { color: theme.colors.textSecondary }]}>
            {item.participants.length} participants
          </Text>
        </View>
        <View style={styles.chatRoomMeta}>
          <Text style={[styles.lastMessageTime, { color: theme.colors.textSecondary }]}>
            {item.lastMessageTime}
          </Text>
          {item.unreadCount > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
      <Text style={[styles.lastMessage, { color: theme.colors.textSecondary }]}>
        {item.lastMessage}
      </Text>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isOwn ? styles.ownMessage : styles.otherMessage
    ]}>
      {!item.isOwn && (
        <Text style={[styles.messageSender, { color: theme.colors.primary }]}>
          {item.sender}
        </Text>
      )}
      <View style={[
        styles.messageBubble,
        {
          backgroundColor: item.isOwn ? theme.colors.primary : theme.colors.surface,
        }
      ]}>
        <Text style={[
          styles.messageText,
          { color: item.isOwn ? '#FFFFFF' : theme.colors.text }
        ]}>
          {item.text}
        </Text>
      </View>
      <Text style={[styles.messageTime, { color: theme.colors.textSecondary }]}>
        {item.timestamp}
      </Text>
    </View>
  );

  if (selectedRoom) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Chat Header */}
        <View style={[styles.chatHeader, { backgroundColor: theme.colors.surface }]}>
          <TouchableOpacity onPress={() => setSelectedRoom(null)}>
            <Icon name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.chatHeaderInfo}>
            <Text style={[styles.chatHeaderTitle, { color: theme.colors.text }]}>
              {selectedRoom.name}
            </Text>
            <Text style={[styles.chatHeaderSubtitle, { color: theme.colors.textSecondary }]}>
              {selectedRoom.participants.length} participants
            </Text>
          </View>
          <TouchableOpacity onPress={handleVoiceChat}>
            <Icon
              name={isVoiceChatActive ? 'call-end' : 'call'}
              size={24}
              color={isVoiceChatActive ? theme.colors.error : theme.colors.success}
            />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          inverted
        />

        {/* Message Input */}
        <View style={[styles.messageInputContainer, { backgroundColor: theme.colors.surface }]}>
          <TextInput
            style={[styles.messageInput, { color: theme.colors.text }]}
            placeholder="Type a message..."
            placeholderTextColor={theme.colors.textSecondary}
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleSendMessage}
          >
            <Icon name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Chat Rooms
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Connect with your co-op partners
      </Text>

      <FlatList
        data={chatRooms}
        renderItem={renderChatRoom}
        keyExtractor={(item) => item.id}
        style={styles.chatRoomsList}
        showsVerticalScrollIndicator={false}
      />

      {/* Create New Chat */}
      <Button
        title="Create New Chat Room"
        onPress={() => Alert.alert('Coming Soon', 'Create chat room feature will be available soon!')}
        buttonStyle={[
          styles.createButton,
          {
            backgroundColor: theme.colors.secondary,
          },
        ]}
        titleStyle={styles.createButtonText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  chatRoomsList: {
    flex: 1,
  },
  chatRoomCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  chatRoomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    marginRight: 12,
  },
  chatRoomInfo: {
    flex: 1,
  },
  chatRoomName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatRoomParticipants: {
    fontSize: 12,
  },
  chatRoomMeta: {
    alignItems: 'flex-end',
  },
  lastMessageTime: {
    fontSize: 12,
  },
  unreadBadge: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  chatHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatHeaderSubtitle: {
    fontSize: 14,
  },
  messagesList: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageSender: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#333',
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButton: {
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatScreen; 