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

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID;
const CATEGORY_ID = process.env.DISCORD_CATEGORY_ID;   // may be undefined

// Ensure fetch available (Node <18)
if (typeof fetch === 'undefined') {
  global.fetch = (...args) => import('node-fetch').then(({default: fetchFn}) => fetchFn(...args));
}
const DISCORD_API = 'https://discord.com/api/v10';

async function discordRequest(endpoint, method, body) {
  const res = await fetch(`${DISCORD_API}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bot ${BOT_TOKEN}`
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    console.error(`Discord API error ${res.status}`);
    throw new Error(`Discord API error ${res.status}`);
  }
  return res.json();
}

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
    // Track generated passwords for 1 hour to avoid duplicates
    // Map<password, timestampMs>
    this.usedPasswords = new Map();
  }

  // Remove passwords older than 1 hour
  cleanOldPasswords() {
    const cutoff = Date.now() - 60 * 60 * 1000; // 1 hour ago
    for (const [pw, ts] of this.usedPasswords) {
      if (ts < cutoff) {
        this.usedPasswords.delete(pw);
      }
    }
  }

  generatePassword() {
    this.cleanOldPasswords();
    const chars = 'abcdefghijklmnopqrstuvwxyz'; //'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    do {
      result = '';
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (this.usedPasswords.has(result));

    this.usedPasswords.set(result, Date.now());
    return result;
  }

  async addPlayer(socketId, userId, platform, bosses, characters) {
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
    return await this.tryMatch();
  }

  removePlayer(socketId) {
    const before = this.waitingPlayers.length;
    this.waitingPlayers = this.waitingPlayers.filter(p => p.socketId !== socketId);
    const after = this.waitingPlayers.length;
    if (before !== after) {
      console.log(`Player disconnected. Total waiting: ${after}`);
    }
  }

  async tryMatch() {
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
              
              // --- Boss compatibility check via intersection ---
              const allPossibleBosses = ['Tricephalos', 'Gaping Jaw', 'Sentient Pest', 'Augur', 'Equilibrious Beast', 'Darkdrift Knight', 'Fissure in the Fog', 'Night Aspect'];

              const bossLists = trio.map(p => {
                return p.bosses.length === 0 || p.bosses.includes('ALL_BOSSES')
                  ? allPossibleBosses
                  : p.bosses;
              });

              const intersection = bossLists.reduce((a, b) => a.filter(x => b.includes(x)));

              console.log('intersection ->', intersection);

              if (intersection.length === 0) continue; // incompatible bosses

              const assigned = tryAssign(trio);
              if (!assigned) continue;

              // Remove matched players
              this.waitingPlayers = this.waitingPlayers.filter(p => 
                !trio.some(t => t.userId === p.userId)
              );

              // Pick actual boss from intersection
              const actualBoss = intersection[Math.floor(Math.random() * intersection.length)];

              const matchResult = {
                success: true,
                password: this.generatePassword(),
                sessionId: `session_${Date.now()}`,
                participants: trio.map(t => t.userId),
                assignedBoss: actualBoss, // Always send the real boss name
                actualBoss,
                assignedCharacters: assigned,
              };

              // --- Discord voice channel creation ---
              if (BOT_TOKEN && GUILD_ID) {
                try {
                  // Fetch existing channels to determine next numeric room name
                  const allChannels = await discordRequest(`/guilds/${GUILD_ID}/channels`, 'GET');
                  const candidate = allChannels.filter(c => {
                    if (c.type !== 2) return false; // voice only
                    if (CATEGORY_ID && c.parent_id !== CATEGORY_ID) return false;
                    return /^\d+$/.test(c.name) || /^match-\w+$/i.test(c.name);
                  });
                  const maxNum = candidate.reduce((max, ch) => {
                    const n = parseInt(ch.name, 10);
                    return isNaN(n) ? max : Math.max(max, n);
                  }, 0);

                  const channelName = String(maxNum + 1 || 1);

                  const channel = await discordRequest(
                    `/guilds/${GUILD_ID}/channels`,
                    'POST',
                    {
                      name: channelName,
                      type: 2, // voice
                      user_limit: 3,
                      parent_id: CATEGORY_ID || undefined
                    }
                  );
                  const invite = await discordRequest(
                    `/channels/${channel.id}/invites`,
                    'POST',
                    { max_age: 3600, max_uses: 3 }
                  );
                  matchResult.discordInvite = `https://discord.gg/${invite.code}`;
                  matchResult.discordChannelName = channelName;

                  // schedule deletion after 2 hours
                  setTimeout(() => {
                    discordRequest(`/channels/${channel.id}`, 'DELETE').then(() => {
                      console.log(`Deleted Discord room #${channelName}`);
                    }).catch(()=>{});
                  }, 2 * 60 * 60 * 1000);
                } catch (e) {
                  console.error('Failed to create Discord voice channel', e);
                }
              }
              // --- End Discord ---

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

// Simple counters for basic metrics
let totalVisits = 0;
let totalQueueStarts = 0;
let totalMatches = 0;
const serverStartISO = new Date().toISOString();

// POST /metrics/visit  — increment visit counter (called by frontend once per page load)
app.post('/metrics/visit', (req, res) => {
  totalVisits += 1;
  res.sendStatus(204);
});

// Protected metrics endpoint
app.get('/metrics', (req, res) => {
  const adminKey = req.header('x-admin-key');
  const secret = process.env.METRICS_SECRET;
  if (secret && adminKey !== secret) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json({
    totalVisits,
    totalQueueStarts,
    totalMatches,
    upSince: serverStartISO
  });
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join_queue', async (data) => {
    totalQueueStarts += 1; // metric
    const { userId, platform, bosses, characters } = data;
    
    const result = await matchmaker.addPlayer(socket.id, userId, platform, bosses, characters);
    
    if (result) {
      totalMatches += 1; // metric
      // Notify all matched players
      result.players.forEach(player => {
        io.to(player.socketId).emit('match_found', {
          ...result.match,
          assignedCharacter: result.match.assignedCharacters[player.userId]
        });
      });
    }
  });

  // --- Chat functionality ---
  socket.on('join_match_room', ({ password, user }) => {
    socket.join(password);
    socket.data.matchUser = user;
    socket.data.matchRoom = password;
    console.log(`Socket ${socket.id} joined match room ${password} as ${user}`);
  });

  socket.on('chat_message', ({ room, user, text }) => {
    if (room && user && text) {
      io.to(room).emit('chat_message', { user, text });
    }
  });
  // --- End chat functionality ---

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    // Notify remaining party members if this socket was in a match room
    if (socket.data && socket.data.matchRoom && socket.data.matchUser) {
      io.to(socket.data.matchRoom).emit('chat_message', {
        user: 'system',
        text: `${socket.data.matchUser} has left the party.`
      });
    }
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

const ROOM_TTL_MS = 60 * 60 * 1000; // 1 hour

function snowflakeToMillis(id) {
  return Number((BigInt(id) >> 22n)) + 1420070400000;
}

async function cleanupOldVoiceChannels() {
  if (!BOT_TOKEN || !GUILD_ID) return;
  try {
    const channels = await discordRequest(`/guilds/${GUILD_ID}/channels`, 'GET');
    const now = Date.now();
    for (const ch of channels) {
      if (ch.type !== 2) continue; // voice only
      if (CATEGORY_ID && ch.parent_id !== CATEGORY_ID) continue;
      if (!/^\d+$/.test(ch.name) && !/^match-\w+$/i.test(ch.name)) continue;
      const created = snowflakeToMillis(ch.id);
      if (now - created > ROOM_TTL_MS) {
        // Note: REST API doesn't expose member count; delete anyway – players get disconnected
        await discordRequest(`/channels/${ch.id}`, 'DELETE').then(() => {
          console.log(`Deleted Discord room #${ch.name}`);
        }).catch(()=>{});
      }
    }
  } catch (err) {
    console.error('Voice channel cleanup failed', err);
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupOldVoiceChannels, 5 * 60 * 1000);

server.listen(PORT, HOST, () => {
  console.log(`Matchmaking server running on ${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Railway URL: ${process.env.RAILWAY_PUBLIC_DOMAIN || 'not set'}`);
}); 