import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'react-native-elements';

// Screens
import HomeScreen from './screens/HomeScreen';
import MatchmakingScreen from './screens/MatchmakingScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import BossRunScreen from './screens/BossRunScreen';
import RemembranceScreen from './screens/RemembranceScreen';
import QuickJoinScreen from './screens/QuickJoinScreen';

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

// Mock navigation for web
const MockNavigation = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div style={{ backgroundColor: theme.colors.background, minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<HomeScreen navigation={{ navigate: () => {} }} />} />
            <Route path="/matchmaking" element={<MatchmakingScreen navigation={{ navigate: () => {} }} />} />
            <Route path="/boss-run" element={<BossRunScreen navigation={{ navigate: () => {} }} />} />
            <Route path="/remembrance" element={<RemembranceScreen navigation={{ navigate: () => {} }} />} />
            <Route path="/quick-join" element={<QuickJoinScreen navigation={{ navigate: () => {} }} />} />
            <Route path="/chat" element={<ChatScreen navigation={{ navigate: () => {} }} />} />
            <Route path="/profile" element={<ProfileScreen navigation={{ navigate: () => {} }} />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 