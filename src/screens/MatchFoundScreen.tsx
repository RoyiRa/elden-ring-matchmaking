import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, Button } from 'react-native-elements';

interface MatchFoundScreenProps {
  route: any;
  navigation: any;
}

const MatchFoundScreen: React.FC<MatchFoundScreenProps> = ({ route, navigation }) => {
  const { theme } = useTheme() as any;
  const { result, assignedChar } = route.params;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.success }]}>Match Found!</Text>
      <Text style={[styles.sub, { color: theme.colors.textSecondary }]}>Session Password</Text>
      <Text style={[styles.password, { color: theme.colors.primary }]}>{result.password}</Text>

      <Text style={[styles.sub, { color: theme.colors.textSecondary, marginTop: 24 }]}>Team Composition</Text>
      <Text style={[styles.team, { color: theme.colors.text }]}> {Object.values(result.assignedCharacters).join(', ')} </Text>

      <Text style={[styles.sub, { color: theme.colors.textSecondary, marginTop: 24 }]}>Your Character</Text>
      <Text style={[styles.assigned, { color: theme.colors.warning }]}>{assignedChar}</Text>

      <Button title="Done" onPress={() => navigation.popToTop()} containerStyle={{ marginTop: 32 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
  sub: { fontSize: 16 },
  password: { fontSize: 24, fontWeight: 'bold' },
  team: { fontSize: 20, textAlign: 'center' },
  assigned: { fontSize: 22, fontWeight: 'bold' },
});

export default MatchFoundScreen; 