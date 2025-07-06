import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { useTheme, Button, Card, SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface BossRunScreenProps {
  navigation: any;
}

interface Boss {
  id: string;
  name: string;
  location: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Very Hard';
  remembrance: boolean;
  icon: string;
}

const BossRunScreen: React.FC<BossRunScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const bosses: Boss[] = [
    {
      id: 'malenia',
      name: 'Malenia, Blade of Miquella',
      location: 'Elphael, Brace of the Haligtree',
      difficulty: 'Very Hard',
      remembrance: true,
      icon: 'sword-cross',
    },
    {
      id: 'radagon',
      name: 'Radagon of the Golden Order',
      location: 'Leyndell, Ashen Capital',
      difficulty: 'Very Hard',
      remembrance: true,
      icon: 'auto-awesome',
    },
    {
      id: 'godfrey',
      name: 'Godfrey, First Elden Lord',
      location: 'Leyndell, Royal Capital',
      difficulty: 'Hard',
      remembrance: true,
      icon: 'sword-cross',
    },
    {
      id: 'mohg',
      name: 'Mohg, Lord of Blood',
      location: 'Mohgwyn Palace',
      difficulty: 'Hard',
      remembrance: true,
      icon: 'blood-drop',
    },
    {
      id: 'maliketh',
      name: 'Maliketh, the Black Blade',
      location: 'Crumbling Farum Azula',
      difficulty: 'Hard',
      remembrance: true,
      icon: 'sword-cross',
    },
    {
      id: 'fire-giant',
      name: 'Fire Giant',
      location: 'Mountaintops of the Giants',
      difficulty: 'Medium',
      remembrance: true,
      icon: 'fire',
    },
    {
      id: 'astel',
      name: 'Astel, Naturalborn of the Void',
      location: 'Lake of Rot',
      difficulty: 'Hard',
      remembrance: true,
      icon: 'star',
    },
    {
      id: 'rennala',
      name: 'Rennala, Queen of the Full Moon',
      location: 'Raya Lucaria Academy',
      difficulty: 'Medium',
      remembrance: true,
      icon: 'auto-awesome',
    },
  ];

  const platforms = [
    { id: 'ps', name: 'PlayStation', icon: 'games' },
    { id: 'xbox', name: 'Xbox', icon: 'games' },
    { id: 'pc', name: 'PC', icon: 'computer' },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return theme.colors.success;
      case 'Medium':
        return theme.colors.warning;
      case 'Hard':
        return theme.colors.error;
      case 'Very Hard':
        return '#8B0000';
      default:
        return theme.colors.textSecondary;
    }
  };

  const filteredBosses = bosses.filter(boss =>
    boss.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    boss.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = () => {
    if (!selectedBoss || !selectedPlatform) {
      Alert.alert('Missing Selection', 'Please select both a boss and platform.');
      return;
    }

    setIsSearching(true);
    
    setTimeout(() => {
      setIsSearching(false);
      const password = generatePassword();
      Alert.alert(
        'Boss Run Match Found!',
        `Boss: ${selectedBoss.name}\nPassword: ${password}\n\nShare this password with your co-op partner to join the same session.`,
        [
          {
            text: 'Copy Password',
            onPress: () => {
              console.log('Password copied:', password);
            },
          },
          {
            text: 'OK',
            style: 'default',
          },
        ]
      );
    }, 2000);
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const renderBossItem = ({ item }: { item: Boss }) => (
    <TouchableOpacity
      style={[
        styles.bossCard,
        {
          backgroundColor: theme.colors.surface,
          borderColor: selectedBoss?.id === item.id ? theme.colors.primary : 'transparent',
        },
      ]}
      onPress={() => setSelectedBoss(item)}
    >
      <View style={styles.bossHeader}>
        <Icon name={item.icon} size={24} color={theme.colors.primary} />
        <View style={styles.bossInfo}>
          <Text style={[styles.bossName, { color: theme.colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.bossLocation, { color: theme.colors.textSecondary }]}>
            {item.location}
          </Text>
        </View>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
          <Text style={styles.difficultyText}>{item.difficulty}</Text>
        </View>
      </View>
      {item.remembrance && (
        <View style={styles.remembranceBadge}>
          <Icon name="auto-awesome" size={16} color={theme.colors.warning} />
          <Text style={[styles.remembranceText, { color: theme.colors.warning }]}>
            Remembrance Boss
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Boss Run Matchmaking
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Select a boss and find co-op partners
      </Text>

      {/* Search Bar */}
      <SearchBar
        placeholder="Search bosses..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInputContainer}
        inputStyle={[styles.searchInput, { color: theme.colors.text }]}
        placeholderTextColor={theme.colors.textSecondary}
      />

      {/* Platform Selection */}
      <Card containerStyle={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Title style={[styles.cardTitle, { color: theme.colors.text }]}>
          Select Platform
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
                  styles.platformText,
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

      {/* Boss List */}
      <Card containerStyle={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Title style={[styles.cardTitle, { color: theme.colors.text }]}>
          Select Boss
        </Card.Title>
        <FlatList
          data={filteredBosses}
          renderItem={renderBossItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.bossList}
        />
      </Card>

      {/* Search Button */}
      <Button
        title={isSearching ? 'Searching...' : 'Find Boss Run Partner'}
        onPress={handleSearch}
        disabled={!selectedBoss || !selectedPlatform || isSearching}
        buttonStyle={[
          styles.searchButton,
          {
            backgroundColor: theme.colors.primary,
          },
        ]}
        titleStyle={styles.searchButtonText}
        loading={isSearching}
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
  searchContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 16,
  },
  searchInputContainer: {
    backgroundColor: '#333',
  },
  searchInput: {
    fontSize: 16,
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
    justifyContent: 'space-between',
  },
  platformButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#444',
  },
  platformText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
  },
  bossList: {
    maxHeight: 400,
  },
  bossCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
  },
  bossHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bossInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bossName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bossLocation: {
    fontSize: 14,
    marginTop: 2,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  difficultyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  remembranceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  remembranceText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  searchButton: {
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
  },
  searchButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BossRunScreen; 