import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  View,
} from 'react-native';
import { useTheme, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { matchmakingService } from '../services/matchmakingService';

interface ExpeditionsScreenProps {
  navigation: any;
}

// Bosses available for expeditions – extend as necessary
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

// Permitted character choices
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

const ExpeditionsScreen: React.FC<ExpeditionsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme() as any;
  const [selectedPlatform, setSelectedPlatform] = useState<'ps' | 'xbox' | 'pc' | ''>('');
  const [selectedBosses, setSelectedBosses] = useState<string[]>([]);
  const [selectAllBosses, setSelectAllBosses] = useState<boolean>(false);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Toggle individual boss (disabled if All Bosses selected)
  const toggleBoss = (boss: string) => {
    if (selectAllBosses) return;
    setSelectedBosses(prev =>
      prev.includes(boss) ? prev.filter(b => b !== boss) : [...prev, boss]
    );
  };

  // Toggle character selection
  const toggleCharacter = (char: string) => {
    setSelectedCharacters(prev =>
      prev.includes(char) ? prev.filter(c => c !== char) : [...prev, char]
    );
  };

  // Attempt to create / join a party
  const handleGenerate = async () => {
    if (!selectedPlatform) {
      Alert.alert('Select Platform', 'Please choose your platform (PS / Xbox / PC).');
      return;
    }
    const bossesToSend = selectAllBosses ? [] : selectedBosses;
    if (!selectAllBosses && bossesToSend.length === 0) {
      Alert.alert('Select Boss', 'Please select at least one boss or choose All Bosses.');
      return;
    }
    if (selectedCharacters.length === 0) {
      Alert.alert('Select Characters', 'Please select at least one character you can play.');
      return;
    }

    const userId = `user_${Date.now()}`; // Placeholder user ID – replace with real auth id
    navigation.navigate('Waiting', {
      userId,
      platform: selectedPlatform,
      bosses: bossesToSend,
      characters: selectedCharacters,
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Expeditions</Text>

      {/* Step 1 – Platform */}
      <Text style={[styles.step, { color: theme.colors.textSecondary }]}>1. Choose Platform</Text>

      <View style={styles.platformRow}>
        {[
          { id: 'ps', label: 'PS' },
          { id: 'xbox', label: 'Xbox' },
          { id: 'pc', label: 'PC' },
        ].map(p => (
          <TouchableOpacity
            key={p.id}
            style={[
              styles.platformBtn,
              selectedPlatform === p.id && { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => setSelectedPlatform(p.id as any)}
          >
            <Text style={{ color: selectedPlatform === p.id ? '#FFF' : theme.colors.text }}>
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Step 2 – Bosses */}
      <Text style={[styles.step, { color: theme.colors.textSecondary }]}>2. Choose Boss Fights</Text>

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
          if (!selectAllBosses) setSelectedBosses([]);
        }}
      >
        <Icon name="select-all" size={20} color={selectAllBosses ? '#FFF' : theme.colors.text} />
        <Text style={{ color: selectAllBosses ? '#FFF' : theme.colors.text, marginLeft: 8 }}>
          All Bosses
        </Text>
      </TouchableOpacity>

      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        {BOSSES.map(boss => {
          const selected = selectedBosses.includes(boss);
          return (
            <TouchableOpacity
              key={boss}
              style={[styles.optionBtn, selected && { backgroundColor: theme.colors.primary }]}
              onPress={() => toggleBoss(boss)}
              disabled={selectAllBosses}
            >
              <Text style={{ color: selected ? '#FFF' : theme.colors.text }}>{boss}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Step 3 – Characters */}
      <Text style={[styles.step, { color: theme.colors.textSecondary }]}>3. Choose Characters</Text>

      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        {CHARACTERS.map(char => {
          const selected = selectedCharacters.includes(char);
          return (
            <TouchableOpacity
              key={char}
              style={[styles.optionBtn, selected && { backgroundColor: theme.colors.primary }]}
              onPress={() => toggleCharacter(char)}
            >
              <Text style={{ color: selected ? '#FFF' : theme.colors.text }}>{char}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Step 4 – Generate */}
      <Button
        title={isSearching ? 'Generating…' : 'Generate Password'}
        onPress={handleGenerate}
        loading={isSearching}
        disabled={isSearching}
        buttonStyle={{ backgroundColor: theme.colors.primary, marginTop: 24 }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  step: { fontSize: 16, fontWeight: '600', marginVertical: 8 },
  card: { borderRadius: 12, borderWidth: 0, marginBottom: 12 },
  allBossesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  platformRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  platformBtn: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  optionBtn: { padding: 10, borderRadius: 8, marginBottom: 8 },
});

export default ExpeditionsScreen; 