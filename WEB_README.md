# 🌐 Elden Ring Matchmaking Web App

## Quick Start

The web version is now running! Here's how to access it:

### Option 1: Use the script (Recommended)
```bash
./run-web.sh
```

### Option 2: Manual setup
```bash
# Copy the web package.json
cp web-package.json web/package.json

# Navigate to web directory
cd web

# Install dependencies
npm install

# Start the app
npm start
```

## 🎮 Features Available

Once the app is running at `http://localhost:3000`, you can:

### 🏠 Home Screen
- Overview of the app
- Quick access to all features
- Beautiful Elden Ring themed UI

### 🎮 Matchmaking
- Select your platform (PS/Xbox/PC)
- Choose activity type (Boss Run, Remembrance Quest, etc.)
- Find co-op partners

### ⚔️ Boss Run
- Browse all Elden Ring bosses
- See difficulty levels and locations
- Find players for specific boss fights

### ⭐ Remembrance Quest
- Choose character classes
- Select remembrance bosses
- Specialized matchmaking

### ⚡ Quick Join
- See available sessions
- Join any open session instantly
- View session passwords

### 💬 Chat
- Browse chat rooms
- See recent messages
- Connect with other players

### 👤 Profile
- View user statistics
- See achievements
- Manage settings

## 🎨 Design Features

- **Dark Elden Ring Theme** - Atmospheric dark colors
- **Responsive Design** - Works on desktop and mobile
- **Smooth Animations** - Hover effects and transitions
- **Accessible UI** - Easy to navigate and use

## 🔧 Technical Details

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **React Router** - Client-side routing
- **CSS Grid/Flexbox** - Modern layout
- **CSS Variables** - Consistent theming

## 🚀 Next Steps

1. **Try all the features** - Navigate through different screens
2. **Test on mobile** - Open on your phone browser
3. **Share with friends** - Show them the Elden Ring matchmaking concept

## 🐛 Troubleshooting

If you get any errors:

1. **Clear node_modules and reinstall:**
   ```bash
   cd web
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check if port 3000 is available:**
   ```bash
   lsof -ti:3000
   ```

3. **Try a different port:**
   ```bash
   PORT=3001 npm start
   ```

---

**The app should now be running at `http://localhost:3000` - enjoy your Elden Ring matchmaking experience!** 🎮⚔️ 