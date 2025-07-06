import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useTheme, Button, Card, Avatar, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ProfileScreenProps {
  navigation: any;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}

interface Stat {
  label: string;
  value: string;
  icon: string;
  color: string;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [voiceChatEnabled, setVoiceChatEnabled] = useState(true);
  const [autoJoinEnabled, setAutoJoinEnabled] = useState(false);

  const userStats: Stat[] = [
    {
      label: 'Bosses Defeated',
      value: '47',
      icon: 'sword-cross',
      color: theme.colors.warning,
    },
    {
      label: 'Co-op Sessions',
      value: '156',
      icon: 'group',
      color: theme.colors.primary,
    },
    {
      label: 'Remembrance Quests',
      value: '23',
      icon: 'auto-awesome',
      color: theme.colors.success,
    },
    {
      label: 'Hours Played',
      value: '342',
      icon: 'schedule',
      color: theme.colors.secondary,
    },
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      name: 'Malenia Slayer',
      description: 'Defeat Malenia, Blade of Miquella',
      icon: 'sword-cross',
      unlocked: true,
      unlockedDate: '2024-01-15',
    },
    {
      id: '2',
      name: 'Radagon Hunter',
      description: 'Defeat Radagon of the Golden Order',
      icon: 'auto-awesome',
      unlocked: true,
      unlockedDate: '2024-01-10',
    },
    {
      id: '3',
      name: 'Co-op Master',
      description: 'Complete 100 co-op sessions',
      icon: 'group',
      unlocked: true,
      unlockedDate: '2024-01-20',
    },
    {
      id: '4',
      name: 'Explorer',
      description: 'Discover all secret areas',
      icon: 'explore',
      unlocked: false,
    },
    {
      id: '5',
      name: 'Remembrance Collector',
      description: 'Collect all remembrance items',
      icon: 'auto-awesome',
      unlocked: false,
    },
    {
      id: '6',
      name: 'Speed Runner',
      description: 'Complete the game in under 10 hours',
      icon: 'flash-on',
      unlocked: false,
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // In a real app, you'd handle logout logic
            Alert.alert('Logged Out', 'You have been successfully logged out.');
          },
        },
      ]
    );
  };

  const renderAchievement = ({ item }: { item: Achievement }) => (
    <View style={[
      styles.achievementCard,
      {
        backgroundColor: theme.colors.surface,
        opacity: item.unlocked ? 1 : 0.6,
      }
    ]}>
      <View style={styles.achievementHeader}>
        <Icon
          name={item.icon}
          size={24}
          color={item.unlocked ? item.color || theme.colors.primary : theme.colors.textSecondary}
        />
        <View style={styles.achievementInfo}>
          <Text style={[styles.achievementName, { color: theme.colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.achievementDescription, { color: theme.colors.textSecondary }]}>
            {item.description}
          </Text>
          {item.unlocked && item.unlockedDate && (
            <Text style={[styles.achievementDate, { color: theme.colors.success }]}>
              Unlocked: {item.unlockedDate}
            </Text>
          )}
        </View>
        {item.unlocked ? (
          <Icon name="check-circle" size={24} color={theme.colors.success} />
        ) : (
          <Icon name="lock" size={24} color={theme.colors.textSecondary} />
        )}
      </View>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Profile Header */}
      <View style={[styles.profileHeader, { backgroundColor: theme.colors.surface }]}>
        <Avatar
          title="T"
          rounded
          size="xlarge"
          containerStyle={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={[styles.username, { color: theme.colors.text }]}>
            Tarnished_Warrior
          </Text>
          <Text style={[styles.userLevel, { color: theme.colors.textSecondary }]}>
            Level 150 • Elden Lord
          </Text>
          <Text style={[styles.userPlatform, { color: theme.colors.textSecondary }]}>
            PlayStation • Online
          </Text>
        </View>
      </View>

      {/* Stats */}
      <Card containerStyle={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Title style={[styles.cardTitle, { color: theme.colors.text }]}>
          Statistics
        </Card.Title>
        <View style={styles.statsGrid}>
          {userStats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Icon name={stat.icon} size={24} color={stat.color} />
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Achievements */}
      <Card containerStyle={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Title style={[styles.cardTitle, { color: theme.colors.text }]}>
          Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})
        </Card.Title>
        <View style={styles.achievementsList}>
          {achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementCard}>
              <View style={styles.achievementHeader}>
                <Icon
                  name={achievement.icon}
                  size={24}
                  color={achievement.unlocked ? theme.colors.primary : theme.colors.textSecondary}
                />
                <View style={styles.achievementInfo}>
                  <Text style={[styles.achievementName, { color: theme.colors.text }]}>
                    {achievement.name}
                  </Text>
                  <Text style={[styles.achievementDescription, { color: theme.colors.textSecondary }]}>
                    {achievement.description}
                  </Text>
                  {achievement.unlocked && achievement.unlockedDate && (
                    <Text style={[styles.achievementDate, { color: theme.colors.success }]}>
                      Unlocked: {achievement.unlockedDate}
                    </Text>
                  )}
                </View>
                {achievement.unlocked ? (
                  <Icon name="check-circle" size={24} color={theme.colors.success} />
                ) : (
                  <Icon name="lock" size={24} color={theme.colors.textSecondary} />
                )}
              </View>
            </View>
          ))}
        </View>
      </Card>

      {/* Settings */}
      <Card containerStyle={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Title style={[styles.cardTitle, { color: theme.colors.text }]}>
          Settings
        </Card.Title>
        <View style={styles.settingsList}>
          <ListItem containerStyle={styles.settingItem}>
            <Icon name="notifications" size={24} color={theme.colors.primary} />
            <ListItem.Content>
              <ListItem.Title style={[styles.settingTitle, { color: theme.colors.text }]}>
                Push Notifications
              </ListItem.Title>
              <ListItem.Subtitle style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                Receive notifications for new matches
              </ListItem.Subtitle>
            </ListItem.Content>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#444', true: theme.colors.primary }}
              thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
            />
          </ListItem>

          <ListItem containerStyle={styles.settingItem}>
            <Icon name="mic" size={24} color={theme.colors.primary} />
            <ListItem.Content>
              <ListItem.Title style={[styles.settingTitle, { color: theme.colors.text }]}>
                Voice Chat
              </ListItem.Title>
              <ListItem.Subtitle style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                Enable voice chat in sessions
              </ListItem.Subtitle>
            </ListItem.Content>
            <Switch
              value={voiceChatEnabled}
              onValueChange={setVoiceChatEnabled}
              trackColor={{ false: '#444', true: theme.colors.primary }}
              thumbColor={voiceChatEnabled ? '#fff' : '#f4f3f4'}
            />
          </ListItem>

          <ListItem containerStyle={styles.settingItem}>
            <Icon name="flash-on" size={24} color={theme.colors.primary} />
            <ListItem.Content>
              <ListItem.Title style={[styles.settingTitle, { color: theme.colors.text }]}>
                Auto Join
              </ListItem.Title>
              <ListItem.Subtitle style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                Automatically join available sessions
              </ListItem.Subtitle>
            </ListItem.Content>
            <Switch
              value={autoJoinEnabled}
              onValueChange={setAutoJoinEnabled}
              trackColor={{ false: '#444', true: theme.colors.primary }}
              thumbColor={autoJoinEnabled ? '#fff' : '#f4f3f4'}
            />
          </ListItem>
        </View>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          title="Edit Profile"
          onPress={() => Alert.alert('Coming Soon', 'Edit profile feature will be available soon!')}
          buttonStyle={[
            styles.actionButton,
            {
              backgroundColor: theme.colors.secondary,
            },
          ]}
          titleStyle={styles.actionButtonText}
        />
        <Button
          title="Logout"
          onPress={handleLogout}
          buttonStyle={[
            styles.actionButton,
            {
              backgroundColor: theme.colors.error,
            },
          ]}
          titleStyle={styles.actionButtonText}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  avatar: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userLevel: {
    fontSize: 16,
    marginBottom: 2,
  },
  userPlatform: {
    fontSize: 14,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  achievementsList: {
    maxHeight: 400,
  },
  achievementCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementInfo: {
    flex: 1,
    marginLeft: 12,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  achievementDate: {
    fontSize: 12,
    marginTop: 4,
  },
  settingsList: {
    marginTop: 8,
  },
  settingItem: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingSubtitle: {
    fontSize: 14,
  },
  actionButtons: {
    marginTop: 16,
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen; 