# 🚀 How to Run the Elden Ring Matchmaking App

## Quick Start (Web Version)

The easiest way to run the app is through the web version:

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start the web version
npm run web
```

This will open the app in your browser at `http://localhost:3000`

## Mobile Version (Advanced)

### Prerequisites

1. **Node.js 18+** (you currently have v16, consider upgrading)
2. **React Native CLI**
3. **Xcode** (for iOS) - ✅ You have this
4. **Android Studio** (for Android) - ❌ You need to install this

### Install React Native CLI

```bash
npm install -g @react-native-community/cli
```

### Run on iOS

```bash
# Install CocoaPods (if not already installed)
sudo gem install cocoapods

# Install iOS dependencies
cd ios && pod install && cd ..

# Run on iOS simulator
npm run ios
```

### Run on Android

```bash
# Make sure you have Android Studio and Android SDK installed
# Then run:
npm run android
```

## Alternative: Use Expo (Recommended for beginners)

If you want an easier setup, we can convert this to an Expo project:

```bash
# Install Expo CLI
npm install -g @expo/cli

# Start with Expo
npx expo start
```

This will give you options to:
- Run on web
- Run on iOS simulator
- Run on Android emulator
- Run on your phone via Expo Go app

## Current Status

✅ **Web version** - Ready to run  
⏳ **iOS version** - Needs Node.js 18+ and CocoaPods  
⏳ **Android version** - Needs Android Studio setup  

## Troubleshooting

### If you get Node.js version errors:
```bash
# Install Node Version Manager (nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js 18
nvm install 18
nvm use 18

# Then try running the app again
```

### If you get permission errors:
```bash
# Use sudo for global installations
sudo npm install -g @react-native-community/cli
```

## Features Available

Once running, you can:

1. **Home Screen** - Overview and quick actions
2. **Matchmaking** - Find co-op partners by platform and activity
3. **Boss Run** - Select specific bosses for co-op
4. **Remembrance Quest** - Choose character classes and remembrance bosses
5. **Quick Join** - Join any available session
6. **Chat** - Message other players
7. **Profile** - View stats and achievements

## Next Steps

1. Try the web version first (easiest)
2. Consider upgrading Node.js to v18+ for better compatibility
3. Set up mobile development environment if you want to test on device/simulator

---

**The web version should be running at `http://localhost:3000` - check your browser!** 