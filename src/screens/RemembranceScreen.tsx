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
import { useTheme, Button, Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface RemembranceScreenProps {
  navigation: any;
}

interface CharacterClass {
  id: string;
  name: string;
  description: string;
  icon: string;
  startingLevel: number;
}

interface RemembranceBoss {
  id: string;
  name: string;
  remembrance: string;
  location: string;
  icon: string;
}

const RemembranceScreen: React.FC<RemembranceScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);
  const [selectedBoss, setSelectedBoss] = useState<RemembranceBoss | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);

  const characterClasses: CharacterClass[] = [
    {
      id: 'vagabond',
      name: 'Vagabond',
      description: 'A knight exiled from their homeland to wander. A solid, armor-clad origin.',
      icon: 'shield',
      startingLevel: 9,
    },
    {
      id: 'warrior',
      name: 'Warrior',
      description: 'A nomad warrior who fights wielding two blades at once. An origin of exceptional technique.',
      icon: 'sword-cross',
      startingLevel: 8,
    },
    {
      id: 'hero',
      name: 'Hero',
      description: 'A stalwart hero, at home with a battleaxe, descended from a badlands chieftain.',
      icon: 'axe',
      startingLevel: 7,
    },
    {
      id: 'bandit',
      name: 'Bandit',
      description: 'A dangerous prisoner who lives by the code of the sword. A rebel who refuses to surrender.',
      icon: 'knife',
      startingLevel: 5,
    },
    {
      id: 'astrologer',
      name: 'Astrologer',
      description: 'A scholar who reads fate in the stars. Heir to the school of glintstone sorcery.',
      icon: 'auto-awesome',
      startingLevel: 6,
    },
    {
      id: 'prophet',
      name: 'Prophet',
      description: 'A seer ostracized for his foretellings of doom. Well-versed in healing incantations.',
      icon: 'healing',
      startingLevel: 7,
    },
    {
      id: 'samurai',
      name: 'Samurai',
      description: 'A capable fighter from the distant Land of Reeds. Handy with katana and longbows.',
      icon: 'bow-arrow',
      startingLevel: 9,
    },
    {
      id: 'prisoner',
      name: 'Prisoner',
      description: 'A prisoner bound in an iron mask. Studied in glintstone sorcery, having lived among the elite prior to sentencing.',
      icon: 'lock',
      startingLevel: 6,
    },
  ];

  const remembranceBosses: RemembranceBoss[] = [
    {
      id: 'malenia',
      name: 'Malenia, Blade of Miquella',
      remembrance: 'Remembrance of the Rot Goddess',
      location: 'Elphael, Brace of the Haligtree',
      icon: 'sword-cross',
    },
    {
      id: 'radagon',
      name: 'Radagon of the Golden Order',
      remembrance: 'Remembrance of the Elden Beast',
      location: 'Leyndell, Ashen Capital',
      icon: 'auto-awesome',
    },
    {
      id: 'godfrey',
      name: 'Godfrey, First Elden Lord',
      remembrance: 'Remembrance of Hoarah Loux',
      location: 'Leyndell, Royal Capital',
      icon: 'sword-cross',
    },
    {
      id: 'mohg',
      name: 'Mohg, Lord of Blood',
      remembrance: 'Remembrance of the Blood Lord',
      location: 'Mohgwyn Palace',
      icon: 'blood-drop',
    },
    {
      id: 'maliketh',
      name: 'Maliketh, the Black Blade',
      remembrance: 'Remembrance of the Black Blade',
      location: 'Crumbling Farum Azula',
      icon: 'sword-cross',
    },
    {
      id: 'fire-giant',
      name: 'Fire Giant',
      remembrance: 'Remembrance of the Fire Giant',
      location: 'Mountaintops of the Giants',
      icon: 'fire',
    },
    {
      id: 'astel',
      name: 'Astel, Naturalborn of the Void',
      remembrance: 'Remembrance of the Naturalborn',
      location: 'Lake of Rot',
      icon: 'star',
    },
    {
      id: 'rennala',
      name: 'Rennala, Queen of the Full Moon',
      remembrance: 'Remembrance of the Full Moon Queen',
      location: 'Raya Lucaria Academy',
      icon: 'auto-awesome',
    },
  ];

  const platforms = [
    { id: 'ps', name: 'PlayStation', icon: 'games' },
    { id: 'xbox', name: 'Xbox', icon: 'games' },
    { id: 'pc', name: 'PC', icon: 'computer' },
  ];

  const handleSearch = () => {
    if (!selectedClass || !selectedBoss || !selectedPlatform) {
      Alert.alert('Missing Selection', 'Please select class, boss, and platform.');
      return;
    }

    setIsSearching(true);
    
    setTimeout(() => {
      setIsSearching(false);
      const password = generatePassword();
      Alert.alert(
        'Remembrance Quest Match Found!',
        `Class: ${selectedClass.name}\nBoss: ${selectedBoss.name}\nPassword: ${password}\n\nShare this password with your co-op partner to join the same session.`,
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

  const renderClassItem = ({ item }: { item: CharacterClass }) => (
    <TouchableOpacity
      style={[
        styles.classCard,
        {
          backgroundColor: theme.colors.surface,
          borderColor: selectedClass?.id === item.id ? theme.colors.primary : 'transparent',
        },
      ]}
      onPress={() => setSelectedClass(item)}
    >
      <View style={styles.classHeader}>
        <Icon name={item.icon} size={24} color={theme.colors.primary} />
        <View style={styles.classInfo}>
          <Text style={[styles.className, { color: theme.colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.classDescription, { color: theme.colors.textSecondary }]}>
            {item.description}
          </Text>
          <Text style={[styles.classLevel, { color: theme.colors.warning }]}>
            Starting Level: {item.startingLevel}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderBossItem = ({ item }: { item: RemembranceBoss }) => (
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
        <Icon name={item.icon} size={24} color={theme.colors.warning} />
        <View style={styles.bossInfo}>
          <Text style={[styles.bossName, { color: theme.colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.bossRemembrance, { color: theme.colors.warning }]}>
            {item.remembrance}
          </Text>
          <Text style={[styles.bossLocation, { color: theme.colors.textSecondary }]}>
            {item.location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Remembrance Quest
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Select your class and remembrance boss
      </Text>

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

      {/* Character Class Selection */}
      <Card containerStyle={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Title style={[styles.cardTitle, { color: theme.colors.text }]}>
          Select Character Class
        </Card.Title>
        <FlatList
          data={characterClasses}
          renderItem={renderClassItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.classList}
        />
      </Card>

      {/* Remembrance Boss Selection */}
      <Card containerStyle={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Title style={[styles.cardTitle, { color: theme.colors.text }]}>
          Select Remembrance Boss
        </Card.Title>
        <FlatList
          data={remembranceBosses}
          renderItem={renderBossItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.bossList}
        />
      </Card>

      {/* Search Button */}
      <Button
        title={isSearching ? 'Searching...' : 'Find Remembrance Partner'}
        onPress={handleSearch}
        disabled={!selectedClass || !selectedBoss || !selectedPlatform || isSearching}
        buttonStyle={[
          styles.searchButton,
          {
            backgroundColor: theme.colors.primary,
          },
        ]}
        titleStyle={styles.searchButtonText}
        loading={isSearching}
      />
    </ScrollView>
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
  classList: {
    maxHeight: 300,
  },
  classCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
  },
  classHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  classInfo: {
    flex: 1,
    marginLeft: 12,
  },
  className: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  classDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  classLevel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  bossList: {
    maxHeight: 300,
  },
  bossCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
  },
  bossHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bossInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bossName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bossRemembrance: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  bossLocation: {
    fontSize: 12,
    marginTop: 2,
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

export default RemembranceScreen; 