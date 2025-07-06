import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-elements';
import { matchmakingService } from '../services/matchmakingService';

interface WaitingScreenProps {
  route: any; // navigation params
  navigation: any;
}

const POLL_INTERVAL = 3000; // 3 seconds

const WaitingScreen: React.FC<WaitingScreenProps> = ({ route, navigation }) => {
  const { theme } = useTheme() as any;
  const { userId, platform, bosses, characters } = route.params;
  const [message, setMessage] = useState('Looking for a team for you…');

  useEffect(() => {
    let canceled = false;

    const attemptMatch = async () => {
      try {
        const resp = await matchmakingService.matchPlayers(
          userId,
          platform,
          bosses,
          characters
        );
        if (canceled) return;
        if (resp.success) {
          navigation.replace('MatchFound', {
            result: resp,
            assignedChar: resp.assignedCharacters[userId],
          });
        } else {
          setMessage(resp.message || 'Still searching…');
          setTimeout(attemptMatch, POLL_INTERVAL);
        }
      } catch (err: any) {
        setMessage(err.message || 'Error… retrying');
        setTimeout(attemptMatch, POLL_INTERVAL);
      }
    };

    attemptMatch();

    return () => {
      canceled = true;
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={[styles.text, { color: theme.colors.text }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    marginTop: 16,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default WaitingScreen; 