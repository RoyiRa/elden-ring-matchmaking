import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { theme } = useTheme() as any;

  const quickActions = [
    {
      title: 'Expeditions',
      icon: 'group',
      route: 'Expeditions',
      color: '#FF6B35',
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Elden Ring Matchmaking
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Find your perfect co-op partner
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Quick Actions
        </Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionCard, { backgroundColor: theme.colors.surface }]}
              onPress={() => navigation.navigate(action.route)}
            >
              <View style={[styles.iconContainer, { backgroundColor: action.color }]}>
                <Icon name={action.icon} size={24} color="#FFFFFF" />
              </View>
              <Text style={[styles.actionTitle, { color: theme.colors.text }]}>
                {action.title}
              </Text>
              {/* subtitle removed for cleaner look */}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Community Stats
        </Text>
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Icon name="group" size={24} color={theme.colors.primary} />
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>1,247</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Active Players
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Icon name="sword-cross" size={24} color={theme.colors.warning} />
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>89</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Boss Runs Today
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Icon name="auto-awesome" size={24} color={theme.colors.success} />
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>156</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Remembrance Quests
            </Text>
          </View>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Recent Activity
        </Text>
        <View style={[styles.activityCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.activityItem}>
            <Icon name="person" size={20} color={theme.colors.primary} />
            <Text style={[styles.activityText, { color: theme.colors.text }]}>
              Tarnished_Warrior joined Malenia fight
            </Text>
          </View>
          <View style={styles.activityItem}>
            <Icon name="person" size={20} color={theme.colors.warning} />
            <Text style={[styles.activityText, { color: theme.colors.text }]}>
              Radagon_Hunter completed remembrance quest
            </Text>
          </View>
          <View style={styles.activityItem}>
            <Icon name="person" size={20} color={theme.colors.success} />
            <Text style={[styles.activityText, { color: theme.colors.text }]}>
              Elden_Lord started quick join session
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  activityCard: {
    padding: 16,
    borderRadius: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
});

export default HomeScreen; 