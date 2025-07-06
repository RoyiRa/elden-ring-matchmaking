const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// In-memory matchmaking service (same logic as web app)
class MatchmakingService {
  constructor() {
    this.waitingPlayers = [];
    this.allowedCompositions = [
      new Set(['Guardian', 'Revenant', 'Duchess']),
      new Set(['Ironeye', 'Wylder', 'Recluse']),
      new Set(['Executor', 'Raider', 'Guardian']),
      new Set(['Revenant', 'Raider', 'Recluse']),
      new Set(['Ironeye', 'Duchess', 'Wylder']),
    ];
  }

  generatePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  addPlayer(socketId, userId, platform, bosses, characters) {
    // Remove if already exists
    this.waitingPlayers = this.waitingPlayers.filter(p => p.userId !== userId);
    
    const normalisedBosses = bosses.length > 0 ? bosses : ['ALL_BOSSES'];
    this.waitingPlayers.push({ 
      socketId, 
      userId, 
      platform, 
      bosses: normalisedBosses, 
      characters 
    });

    console.log(`Player ${userId} joined queue. Total waiting: ${this.waitingPlayers.length}`);
    return this.tryMatch();
  }

  removePlayer(socketId) {
    const before = this.waitingPlayers.length;
    this.waitingPlayers = this.waitingPlayers.filter(p => p.socketId !== socketId);
    const after = this.waitingPlayers.length;
    if (before !== after) {
      console.log(`Player disconnected. Total waiting: ${after}`);
    }
  }

  tryMatch() {
    const tryAssign = (prefs) => {
      for (const comp of this.allowedCompositions) {
        const charsArr = Array.from(comp);
        
        // Check if all characters in composition are available
        for (const char of charsArr) {
          if (!prefs.some(p => p.characters.includes(char))) {
            continue;
          }
        }

        // Try all permutations
        const chars = charsArr;
        const perms = [
          [chars[0], chars[1], chars[2]],
          [chars[0], chars[2], chars[1]],
          [chars[1], chars[0], chars[2]],
          [chars[1], chars[2], chars[0]],
          [chars[2], chars[0], chars[1]],
          [chars[2], chars[1], chars[0]],
        ];

        for (const perm of perms) {
          const map = {};
          let ok = true;
          for (let i = 0; i < 3; i++) {
            const player = prefs[i];
            const char = perm[i];
            if (!player.characters.includes(char)) { 
              ok = false; 
              break; 
            }
            map[player.userId] = char;
          }
          if (ok) return map;
        }
      }
      return null;
    };

    // Group by platform
    const platforms = ['ps', 'xbox', 'pc'];
    
    for (const platform of platforms) {
      const platformPlayers = this.waitingPlayers.filter(p => p.platform === platform);
      
      if (platformPlayers.length >= 3) {
        // Try all combinations of 3 players
        for (let i = 0; i < platformPlayers.length - 2; i++) {
          for (let j = i + 1; j < platformPlayers.length - 1; j++) {
            for (let k = j + 1; k < platformPlayers.length; k++) {
              const trio = [platformPlayers[i], platformPlayers[j], platformPlayers[k]];
              
              // Check if they have compatible bosses
              const allBosses = trio.flatMap(p => p.bosses);
              const commonBoss = allBosses.find(boss => 
                trio.every(p => p.bosses.includes(boss) || p.bosses.includes('ALL_BOSSES') || boss === 'ALL_BOSSES')
              );
              
              if (!commonBoss) continue;

              const assigned = tryAssign(trio);
              if (!assigned) continue;

              // Remove matched players
              this.waitingPlayers = this.waitingPlayers.filter(p => 
                !trio.some(t => t.userId === p.userId)
              );

              const matchResult = {
                success: true,
                password: this.generatePassword(),
                sessionId: `session_${Date.now()}`,
                participants: trio.map(t => t.userId),
                assignedBoss: commonBoss === 'ALL_BOSSES' ? 'Random' : commonBoss,
                assignedCharacters: assigned,
              };

              console.log(`Match found! Players: ${trio.map(t => t.userId).join(', ')}`);
              return { match: matchResult, players: trio };
            }
          }
        }
      }
    }

    return null;
  }
}

const matchmaker = new MatchmakingService();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join_queue', (data) => {
    const { userId, platform, bosses, characters } = data;
    
    const result = matchmaker.addPlayer(socket.id, userId, platform, bosses, characters);
    
    if (result) {
      // Notify all matched players
      result.players.forEach(player => {
        io.to(player.socketId).emit('match_found', {
          ...result.match,
          assignedCharacter: result.match.assignedCharacters[player.userId]
        });
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    matchmaker.removePlayer(socket.id);
  });
});

// Test endpoints
app.get('/', (req, res) => {
  res.json({ 
    message: 'Elden Ring Matchmaking Server',
    status: 'running',
    endpoints: ['/health', '/socket.io']
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    waitingPlayers: matchmaker.waitingPlayers.length,
    timestamp: new Date().toISOString(),
    port: process.env.PORT,
    socketPath: '/socket.io'
  });
});

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`Matchmaking server running on ${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Railway URL: ${process.env.RAILWAY_PUBLIC_DOMAIN || 'not set'}`);
}); 