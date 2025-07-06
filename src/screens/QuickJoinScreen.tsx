import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useTheme, Button, Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface QuickJoinScreenProps {
  navigation: any;
}

interface AvailableSession {
  id: string;
  hostName: string;
  platform: string;
  activity: string;
  boss?: string;
  class?: string;
  players: number;
  maxPlayers: number;
  timeAgo: string;
  password: string;
}

const QuickJoinScreen: React.FC<QuickJoinScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [availableSessions, setAvailableSessions] = useState<AvailableSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const platforms = [
    { id: 'all', name: 'All Platforms', icon: 'devices' },
    { id: 'ps', name: 'PlayStation', icon: 'games' },
    { id: 'xbox', name: 'Xbox', icon: 'games' },
    { id: 'pc', name: 'PC', icon: 'computer' },
  ];

  // Mock data for available sessions
  const mockSessions: AvailableSession[] = [
    {
      id: '1',
      hostName: 'Tarnished_Warrior',
      platform: 'PS',
      activity: 'Boss Run',
      boss: 'Malenia, Blade of Miquella',
      players: 1,
      maxPlayers: 2,
      timeAgo: '2 min ago',
      password: 'MALENIA1',
    },
    {
      id: '2',
      hostName: 'Radagon_Hunter',
      platform: 'PC',
      activity: 'Remembrance Quest',
      boss: 'Radagon of the Golden Order',
      class: 'Astrologer',
      players: 1,
      maxPlayers: 2,
      timeAgo: '5 min ago',
      password: 'RADAGON2',
    },
    {
      id: '3',
      hostName: 'Elden_Lord',
      platform: 'Xbox',
      activity: 'Exploration',
      players: 1,
      maxPlayers: 3,
      timeAgo: '1 min ago',
      password: 'EXPLORE3',
    },
    {
      id: '4',
      hostName: 'Blood_Lord',
      platform: 'PS',
      activity: 'Boss Run',
      boss: 'Mohg, Lord of Blood',
      players: 1,
      maxPlayers: 2,
      timeAgo: '3 min ago',
      password: 'MOHG4',
    },
    {
      id: '5',
      hostName: 'Moon_Queen',
      platform: 'PC',
      activity: 'Remembrance Quest',
      boss: 'Rennala, Queen of the Full Moon',
      class: 'Prophet',
      players: 1,
      maxPlayers: 2,
      timeAgo: '7 min ago',
      password: 'RENNALA5',
    },
  ];

  useEffect(() => {
    loadSessions();
  }, [selectedPlatform]);

  const loadSessions = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let filteredSessions = mockSessions;
      if (selectedPlatform && selectedPlatform !== 'all') {
        filteredSessions = mockSessions.filter(session => 
          session.platform.toLowerCase() === selectedPlatform
        );
      }
      setAvailableSessions(filteredSessions);
      setIsLoading(false);
    }, 1000);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadSessions();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleJoinSession = (session: AvailableSession) => {
    Alert.alert(
      'Join Session',
      `Host: ${session.hostName}\nActivity: ${session.activity}${session.boss ? `\nBoss: ${session.boss}` : ''}${session.class ? `\nClass: ${session.class}` : ''}\nPassword: ${session.password}\n\nUse this password to join the session.`,
      [
        {
          text: 'Copy Password',
          onPress: () => {
            console.log('Password copied:', session.password);
          },
        },
        {
          text: 'Join Session',
          onPress: () => {
            // In a real app, you'd navigate to the game or update session status
            Alert.alert('Success', 'You have joined the session!');
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const renderSessionItem = ({ item }: { item: AvailableSession }) => (
    <TouchableOpacity
      style={[styles.sessionCard, { backgroundColor: theme.colors.surface }]}
      onPress={() => handleJoinSession(item)}
    >
      <View style={styles.sessionHeader}>
        <View style={styles.hostInfo}>
          <Icon name="person" size={20} color={theme.colors.primary} />
          <Text style={[styles.hostName, { color: theme.colors.text }]}>
            {item.hostName}
          </Text>
        </View>
        <View style={styles.platformBadge}>
          <Icon name="games" size={16} color={theme.colors.text} />
          <Text style={[styles.platformText, { color: theme.colors.text }]}>
            {item.platform}
          </Text>
        </View>
      </View>

      <View style={styles.sessionDetails}>
        <View style={styles.activityInfo}>
          <Icon name="group" size={16} color={theme.colors.warning} />
          <Text style={[styles.activityText, { color: theme.colors.text }]}>
            {item.activity}
          </Text>
        </View>
        
        {item.boss && (
          <View style={styles.bossInfo}>
            <Icon name="sword-cross" size={16} color={theme.colors.error} />
            <Text style={[styles.bossText, { color: theme.colors.textSecondary }]}>
              {item.boss}
            </Text>
          </View>
        )}
        
        {item.class && (
          <View style={styles.classInfo}>
            <Icon name="auto-awesome" size={16} color={theme.colors.success} />
            <Text style={[styles.classText, { color: theme.colors.textSecondary }]}>
              {item.class}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.sessionFooter}>
        <View style={styles.playerCount}>
          <Icon name="group" size={16} color={theme.colors.primary} />
          <Text style={[styles.playerText, { color: theme.colors.text }]}>
            {item.players}/{item.maxPlayers} players
          </Text>
        </View>
        <Text style={[styles.timeText, { color: theme.colors.textSecondary }]}>
          {item.timeAgo}
        </Text>
      </View>

      <View style={styles.joinButton}>
        <Icon name="flash-on" size={16} color={theme.colors.success} />
        <Text style={[styles.joinText, { color: theme.colors.success }]}>
          Quick Join
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Quick Join
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Join any available session instantly
      </Text>

      {/* Platform Filter */}
      <Card containerStyle={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Title style={[styles.cardTitle, { color: theme.colors.text }]}>
          Filter by Platform
        </Card.Title>
        <View style={styles.platformContainer}>
          {platforms.map((platform) => (
            <TouchableOpacity
              key={platform.id}
              style={[
                styles.platformButton,
                selectedPlatform === platform.id && {
                  backgroundColor: theme.colors.primary,
                },
              ]}
              onPress={() => setSelectedPlatform(platform.id)}
            >
              <Icon
                name={platform.icon}
                size={20}
                color={selectedPlatform === platform.id ? '#FFFFFF' : theme.colors.text}
              />
              <Text
                style={[
                  styles.platformButtonText,
                  {
                    color: selectedPlatform === platform.id ? '#FFFFFF' : theme.colors.text,
                  },
                ]}
              >
                {platform.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Available Sessions */}
      <Card containerStyle={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Title style={[styles.cardTitle, { color: theme.colors.text }]}>
          Available Sessions ({availableSessions.length})
        </Card.Title>
        <FlatList
          data={availableSessions}
          renderItem={renderSessionItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          }
          style={styles.sessionsList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon name="search-off" size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                No sessions available
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
                Try changing your platform filter or check back later
              </Text>
            </View>
          }
        />
      </Card>

      {/* Refresh Button */}
      <Button
        title="Refresh Sessions"
        onPress={onRefresh}
        disabled={isLoading}
        buttonStyle={[
          styles.refreshButton,
          {
            backgroundColor: theme.colors.secondary,
          },
        ]}
        titleStyle={styles.refreshButtonText}
        loading={isLoading}
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
  card: {
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 0,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  platformContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  platformButton: {
    width: '48%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  platformButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
  },
  sessionsList: {
    maxHeight: 500,
  },
  sessionCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  platformText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  sessionDetails: {
    marginBottom: 12,
  },
  activityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bossInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bossText: {
    fontSize: 12,
    marginLeft: 8,
  },
  classInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  classText: {
    fontSize: 12,
    marginLeft: 8,
  },
  sessionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  playerCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerText: {
    fontSize: 12,
    marginLeft: 4,
  },
  timeText: {
    fontSize: 12,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  joinText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  refreshButton: {
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuickJoinScreen; 