import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeProvider } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import ExpeditionsScreen from './src/screens/ExpeditionsScreen';
import WaitingScreen from './src/screens/WaitingScreen';
import MatchFoundScreen from './src/screens/MatchFoundScreen';

// Components
import Icon from 'react-native-vector-icons/MaterialIcons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const theme = {
  colors: {
    primary: '#8B4513', // Dark brown for Elden Ring theme
    secondary: '#D2691E', // Saddle brown
    background: '#1A1A1A', // Dark background
    surface: '#2D2D2D', // Dark surface
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
  },
};

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = 'home'; // default icon to appease TS strictness

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Expeditions') {
            iconName = 'group';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.background,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Expeditions" component={ExpeditionsScreen} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      {/* @ts-ignore Typed definition mismatch */}
      <ThemeProvider theme={theme as any}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.surface,
              },
              headerTintColor: theme.colors.text,
              cardStyle: { backgroundColor: theme.colors.background },
            }}
          >
            <Stack.Screen 
              name="Main" 
              component={TabNavigator} 
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Waiting" component={WaitingScreen} options={{ title: 'Searching' }} />
            <Stack.Screen name="MatchFound" component={MatchFoundScreen} options={{ title: 'Match Found' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App; 