import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme, Button, Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { matchmakingService } from '../services/matchmakingService';

interface MatchmakingScreenProps {
  navigation: any;
}

const BOSSES = [
  'Tricephalos',
  'Gaping Jaw',
  'Sentient Pest',
  'Augur',
  'Equilibrious Beast',
  'Darkdrift Knight',
  'Fissure in the Fog',
  'Night Aspect',
];

const CHARACTERS = [
  'Revenant',
  'Wylder',
  'Guardian',
  'Ironeye',
  'Duchess',
  'Raider',
  'Recluse',
  'Executor',
];

const MatchmakingScreen: React.FC<MatchmakingScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedBosses, setSelectedBosses] = useState<string[]>([]);
  const [selectAllBosses, setSelectAllBosses] = useState<boolean>(false);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const toggleBoss = (boss: string) => {
    if (selectAllBosses) return; // ignore individual toggles when all bosses selected
    setSelectedBosses(prev =>
      prev.includes(boss) ? prev.filter(b => b !== boss) : [...prev, boss]
    );
  };

  const toggleCharacter = (character: string) => {
    setSelectedCharacters(prev =>
      prev.includes(character) ? prev.filter(c => c !== character) : [...prev, character]
    );
  };

  const handleGenerate = async () => {
    const bossesToSend = selectAllBosses ? [] : selectedBosses;

    if (!selectAllBosses && bossesToSend.length === 0) {
      Alert.alert('Select Boss', 'Please select at least one boss or choose All Bosses.');
      return;
    }
    if (selectedCharacters.length === 0) {
      Alert.alert('Select Characters', 'Please select at least one character you can play.');
      return;
    }

    setIsSearching(true);

    const userId = `user_${Date.now()}`; // placeholder user id

    try {
      const response = await matchmakingService.matchPlayers(userId, bossesToSend, selectedCharacters);

      if (response.success) {
        Alert.alert(
          'Party Formed!',
          `Password: ${response.password}\nBoss: ${response.assignedBoss}\n\nShare the password with your teammates.`
        );
      } else {
        Alert.alert('Waiting', response.message || 'Waiting for more players to join...');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to generate password.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Matchmaking</Text>

      {/* Step 1 – Boss selection */}
      <Text style={[styles.stepTitle, { color: theme.colors.textSecondary }]}>1. Choose Boss Fights</Text>

      <TouchableOpacity
        style={[
          styles.allBossesBtn,
          {
            backgroundColor: selectAllBosses ? theme.colors.primary : theme.colors.surface,
            borderColor: theme.colors.primary,
          },
        ]}
        onPress={() => {
          setSelectAllBosses(prev => !prev);
          if (!selectAllBosses) {
            setSelectedBosses([]);
          }
        }}
      >
        <Icon
          name="select-all"
          size={20}
          color={selectAllBosses ? '#FFFFFF' : theme.colors.text}
        />
        <Text style={{ color: selectAllBosses ? '#FFFFFF' : theme.colors.text, marginLeft: 8 }}>
          All Bosses
        </Text>
      </TouchableOpacity>

      <Card containerStyle={[styles.card, { backgroundColor: theme.colors.surface }]}>
        {BOSSES.map(boss => (
          <TouchableOpacity
            key={boss}
            style={[
              styles.optionBtn,
              selectedBosses.includes(boss) && { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => toggleBoss(boss)}
            disabled={selectAllBosses}
          >
            <Text
              style={{
                color: selectedBosses.includes(boss) ? '#FFFFFF' : theme.colors.text,
              }}
            >
              {boss}
            </Text>
          </TouchableOpacity>
        ))}
      </Card>

      {/* Step 2 – Character selection */}
      <Text style={[styles.stepTitle, { color: theme.colors.textSecondary }]}>2. Choose Characters</Text>
      <Card containerStyle={[styles.card, { backgroundColor: theme.colors.surface }]}>
        {CHARACTERS.map(char => (
          <TouchableOpacity
            key={char}
            style={[
              styles.optionBtn,
              selectedCharacters.includes(char) && { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => toggleCharacter(char)}
          >
            <Text
              style={{
                color: selectedCharacters.includes(char) ? '#FFFFFF' : theme.colors.text,
              }}
            >
              {char}
            </Text>
          </TouchableOpacity>
        ))}
      </Card>

      {/* Step 3 – Generate */}
      <Button
        title={isSearching ? 'Generating...' : 'Generate Password'}
        onPress={handleGenerate}
        loading={isSearching}
        disabled={isSearching}
        buttonStyle={{ backgroundColor: theme.colors.primary, marginTop: 24 }}
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
    textAlign: 'center',
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 8,
  },
  card: {
    borderRadius: 12,
    borderWidth: 0,
    marginBottom: 12,
  },
  allBossesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  optionBtn: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
});

export default MatchmakingScreen; 