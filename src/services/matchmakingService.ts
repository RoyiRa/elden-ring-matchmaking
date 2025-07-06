// Matchmaking Service - Handles all matchmaking-related API calls
// This is a mock implementation that would be replaced with real API calls

export interface MatchmakingRequest {
  platform: 'ps' | 'xbox' | 'pc';
  activity: string;
  boss?: string;
  characterClass?: string;
  userId: string;
}

export interface MatchmakingResponse {
  success: boolean;
  password: string;
  sessionId: string;
  participants: string[];
  message?: string;
}

export interface AvailableSession {
  id: string;
  hostName: string;
  platform: string;
  activity: string;
  boss?: string;
  class?: string;
  players: number;
  maxPlayers: number;
  timeAgo: string;
  password: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  roomId: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

// Add new types used by the 3-player party matcher
export interface PlayerPreferences {
  userId: string;
  platform: 'ps' | 'xbox' | 'pc';
  bosses: string[]; // Bosses the player is willing to fight – empty array => "all bosses"
  characters: string[]; // Characters the player is willing to play
}

export interface PartyMatchResponse extends MatchmakingResponse {
  assignedBoss: string;
  assignedCharacters: Record<string, string>; // userId -> chosen character
}

class MatchmakingService {
  private baseUrl = 'https://api.eldenring-matchmaking.com'; // Mock URL
  private waitingPlayers: PlayerPreferences[] = [];

  /**
   * Allowed 3-player team compositions. Order doesn't matter; we compare sets.
   * Extend / modify this list as the meta evolves.
   */
  private allowedCompositions: Array<Set<string>> = [
    new Set(['Guardian', 'Revenant', 'Duchess']),
    new Set(['Ironeye', 'Wylder', 'Recluse']),
    new Set(['Executor', 'Raider', 'Guardian']),
    new Set(['Revenant', 'Raider', 'Recluse']),
    new Set(['Ironeye', 'Duchess', 'Wylder']),
  ];

  // Find a match based on user preferences
  async findMatch(request: MatchmakingRequest): Promise<MatchmakingResponse> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock response - in real app, this would be an API call
      const password = this.generatePassword();
      
      return {
        success: true,
        password,
        sessionId: `session_${Date.now()}`,
        participants: [request.userId],
        message: 'Match found! Share the password with your co-op partner.'
      };
    } catch (error) {
      console.error('Error finding match:', error);
      throw new Error('Failed to find match. Please try again.');
    }
  }

  // Get available sessions for quick join
  async getAvailableSessions(platform?: string): Promise<AvailableSession[]> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data - in real app, this would fetch from API
      const mockSessions: AvailableSession[] = [
        {
          id: '1',
          hostName: 'Tarnished_Warrior',
          platform: 'PS',
          activity: 'Boss Run',
          boss: 'Malenia, Blade of Miquella',
          players: 1,
          maxPlayers: 2,
          timeAgo: '2 min ago',
          password: 'MALENIA1',
        },
        {
          id: '2',
          hostName: 'Radagon_Hunter',
          platform: 'PC',
          activity: 'Remembrance Quest',
          boss: 'Radagon of the Golden Order',
          class: 'Astrologer',
          players: 1,
          maxPlayers: 2,
          timeAgo: '5 min ago',
          password: 'RADAGON2',
        },
        {
          id: '3',
          hostName: 'Elden_Lord',
          platform: 'Xbox',
          activity: 'Exploration',
          players: 1,
          maxPlayers: 3,
          timeAgo: '1 min ago',
          password: 'EXPLORE3',
        },
      ];

      if (platform && platform !== 'all') {
        return mockSessions.filter(session => 
          session.platform.toLowerCase() === platform
        );
      }

      return mockSessions;
    } catch (error) {
      console.error('Error fetching available sessions:', error);
      throw new Error('Failed to fetch available sessions.');
    }
  }

  // Join an existing session
  async joinSession(sessionId: string, userId: string): Promise<boolean> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock success response
      return true;
    } catch (error) {
      console.error('Error joining session:', error);
      throw new Error('Failed to join session.');
    }
  }

  // Get chat rooms for user
  async getChatRooms(userId: string): Promise<ChatRoom[]> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock chat rooms
      return [
        {
          id: '1',
          name: 'Malenia Fight Club',
          participants: ['Tarnished_Warrior', 'Radagon_Hunter', 'Blood_Lord'],
          lastMessage: 'Anyone up for Malenia?',
          lastMessageTime: '2 min ago',
          unreadCount: 3,
        },
        {
          id: '2',
          name: 'Remembrance Quest Group',
          participants: ['Elden_Lord', 'Moon_Queen', 'Astrologer_Mage'],
          lastMessage: 'Great fight everyone!',
          lastMessageTime: '5 min ago',
          unreadCount: 0,
        },
      ];
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      throw new Error('Failed to fetch chat rooms.');
    }
  }

  // Get messages for a chat room
  async getChatMessages(roomId: string): Promise<ChatMessage[]> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      // Mock messages
      return [
        {
          id: '1',
          sender: 'Tarnished_Warrior',
          text: 'Anyone up for Malenia?',
          timestamp: '2:30 PM',
          roomId,
        },
        {
          id: '2',
          sender: 'You',
          text: 'I\'m down! What password?',
          timestamp: '2:31 PM',
          roomId,
        },
      ];
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw new Error('Failed to fetch chat messages.');
    }
  }

  // Send a message
  async sendMessage(roomId: string, sender: string, text: string): Promise<boolean> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Mock success response
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message.');
    }
  }

  // Update user statistics
  async updateUserStats(userId: string, stats: any): Promise<boolean> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw new Error('Failed to update user stats.');
    }
  }

  // Generate a random password for matchmaking
  private generatePassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Attempt to match the current player with other waiting players.
   * A valid party has exactly 3 distinct players, who all share at least one common boss
   * and together have at least 3 distinct character options so a unique character can be
   * assigned to each one.
   */
  async matchPlayers(userId: string, platform: 'ps' | 'xbox' | 'pc', bosses: string[], characters: string[]): Promise<PartyMatchResponse> {
    // Normalise input – empty bosses array means "all bosses"
    const normalisedBosses = bosses.length > 0 ? bosses : ['ALL_BOSSES'];

    // Add the current player to the waiting queue first so they can be considered for matching
    this.waitingPlayers.push({ userId, platform, bosses: normalisedBosses, characters });

    // Helper to test / assign unique characters to 3 players
    const tryAssignCharacters = (
      prefs: PlayerPreferences[]
    ): Record<string, string> | null => {
      outer: for (const comp of this.allowedCompositions) {
        // Quick viability test – every char in comp must appear in at least one player's list
        for (const char of comp) {
          if (!prefs.some(p => p.characters.includes(char))) {
            continue outer; // composition impossible, skip to next
          }
        }

        // Generate permutations of assigning the comp chars to the 3 players.
        const chars = [...comp];
        // There are only 6 permutations for 3 chars; enumerate manually for performance.
        const permutations: string[][] = [
          [chars[0], chars[1], chars[2]],
          [chars[0], chars[2], chars[1]],
          [chars[1], chars[0], chars[2]],
          [chars[1], chars[2], chars[0]],
          [chars[2], chars[0], chars[1]],
          [chars[2], chars[1], chars[0]],
        ];

        for (const perm of permutations) {
          const mapping: Record<string, string> = {};
          let valid = true;
          for (let i = 0; i < 3; i++) {
            const player = prefs[i];
            const char = perm[i];
            if (!player.characters.includes(char)) {
              valid = false;
              break;
            }
            mapping[player.userId] = char;
          }
          if (valid) {
            return mapping; // Found a valid assignment
          }
        }
      }
      return null; // No composition fits player preferences
    };

    // Scan each boss the player is willing to fight for potential matches
    for (const boss of normalisedBosses) {
      // Gather all players (including current) willing to fight this boss (or with ALL_BOSSES wildcard)
      const candidates = this.waitingPlayers.filter(p =>
        p.platform === platform &&
        (p.bosses.includes(boss) || p.bosses.includes('ALL_BOSSES') || boss === 'ALL_BOSSES')
      );

      if (candidates.length >= 3) {
        // Brutally search for ANY combination of 3 players that can be assigned unique characters
        for (let i = 0; i < candidates.length - 2; i++) {
          for (let j = i + 1; j < candidates.length - 1; j++) {
            for (let k = j + 1; k < candidates.length; k++) {
              const trio = [candidates[i], candidates[j], candidates[k]];
              const assigned = tryAssignCharacters(trio);
              if (!assigned) {
                continue; // composition not possible
              }

              // Remove matched players from waiting queue
              this.waitingPlayers = this.waitingPlayers.filter(
                p => !trio.some(t => t.userId === p.userId)
              );

              const password = this.generatePassword();
              const sessionId = `session_${Date.now()}`;
              const participants = trio.map(t => t.userId);

              return {
                success: true,
                password,
                sessionId,
                participants,
                assignedBoss: boss === 'ALL_BOSSES' ? 'Random' : boss,
                assignedCharacters: assigned,
                message:
                  participants.length === 3
                    ? 'Party formed! Share the password with your teammates.'
                    : 'Waiting for more players...',
              };
            }
          }
        }
      }
    }

    // No match yet – return waiting response for the current user only
    return {
      success: false,
      password: '',
      sessionId: '',
      participants: [userId],
      assignedBoss: '',
      assignedCharacters: {},
      message: 'Waiting for more players to join...'
    } as PartyMatchResponse;
  }
}

export const matchmakingService = new MatchmakingService(); 