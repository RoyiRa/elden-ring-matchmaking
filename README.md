# Elden Ring Matchmaking App

A mobile application designed to help the Elden Ring community find co-op partners more efficiently. The app addresses the common complaints about slow matchmaking and low-quality players by providing a platform where users can specify their preferences and find like-minded players.

## Features

### 🎮 Core Matchmaking
- **Platform Selection**: Choose between PlayStation, Xbox, and PC
- **Activity Types**: Boss runs, remembrance quests, exploration, PvP, and co-op adventures
- **Password Generation**: Automatic generation of matchmaking passwords for easy session joining

### 🗡️ Specialized Matchmaking
- **Boss Run**: Select specific bosses from a comprehensive list with difficulty indicators
- **Remembrance Quest**: Choose character classes and remembrance bosses for specialized co-op
- **Quick Join**: Instantly join any available session with real-time updates

### 💬 Communication
- **Chat System**: In-app messaging with other players
- **Voice Chat**: Built-in voice communication for co-op sessions
- **Chat Rooms**: Create and join themed chat rooms for different activities

### 👤 User Profile
- **Statistics Tracking**: Monitor bosses defeated, co-op sessions, and playtime
- **Achievements**: Unlock achievements for various in-game accomplishments
- **Settings**: Customize notifications, voice chat, and auto-join preferences

## Screens

### Home Screen
- Quick access to all matchmaking options
- Community statistics and recent activity
- Beautiful Elden Ring themed UI

### Matchmaking Screen
- Platform and activity selection
- Custom matchmaking with detailed preferences
- Quick action buttons for specialized matchmaking

### Boss Run Screen
- Comprehensive boss list with search functionality
- Difficulty indicators and remembrance status
- Platform-specific filtering

### Remembrance Quest Screen
- Character class selection with descriptions
- Remembrance boss selection
- Specialized matchmaking for remembrance quests

### Quick Join Screen
- Real-time available sessions
- Platform filtering
- Session details and player counts

### Chat Screen
- Chat room management
- Real-time messaging
- Voice chat integration

### Profile Screen
- User statistics and achievements
- Settings and preferences
- Profile management

## Technical Stack

- **React Native**: Cross-platform mobile development
- **TypeScript**: Type-safe development
- **React Navigation**: Screen navigation and routing
- **React Native Elements**: UI component library
- **Vector Icons**: Icon library for consistent design

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd elden-ring-matchmaking
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Run the app**
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   
   # Start Metro bundler
   npm start
   ```

## Development

### Project Structure
```
src/
├── screens/          # Screen components
│   ├── HomeScreen.tsx
│   ├── MatchmakingScreen.tsx
│   ├── BossRunScreen.tsx
│   ├── RemembranceScreen.tsx
│   ├── QuickJoinScreen.tsx
│   ├── ChatScreen.tsx
│   └── ProfileScreen.tsx
├── components/       # Reusable components
├── services/         # API and business logic
├── utils/           # Utility functions
└── types/           # TypeScript type definitions
```

### Key Features Implementation

#### Password Generation
The app generates unique 8-character passwords for matchmaking sessions, ensuring players can easily join the same game session.

#### Real-time Updates
Quick Join screen shows real-time available sessions with automatic refresh functionality.

#### Voice Chat Integration
Built-in voice chat capabilities for enhanced co-op communication.

#### Achievement System
Track user progress with unlockable achievements for various in-game accomplishments.

## Design Philosophy

### Elden Ring Theme
- Dark, atmospheric color scheme matching the game's aesthetic
- Sword and magic-themed icons
- Boss-specific imagery and terminology

### User Experience
- Intuitive navigation with bottom tabs
- Quick access to common actions
- Responsive design for all screen sizes
- Accessibility considerations

### Community Focus
- Emphasis on player connection and cooperation
- Chat system for building relationships
- Achievement system for motivation

## Future Enhancements

- **Backend Integration**: Real-time matchmaking server
- **Push Notifications**: Match alerts and chat notifications
- **Friend System**: Add and manage friends
- **Session History**: Track past co-op sessions
- **Rating System**: Rate co-op partners
- **Custom Avatars**: Personalized user profiles
- **Game Integration**: Direct connection to Elden Ring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository or contact the development team.

---

**May the grace of the Erdtree guide your path, Tarnished.** 