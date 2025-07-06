// Duplicate of native matchmakingService for web build (kept in sync manually)

export interface PlayerPreferences {
  userId: string;
  platform: 'ps' | 'xbox' | 'pc';
  bosses: string[];
  characters: string[];
}

export interface PartyMatchResponse {
  success: boolean;
  password: string;
  sessionId: string;
  participants: string[];
  message?: string;
  assignedBoss: string;
  assignedCharacters: Record<string, string>;
}

class MatchmakingService {
  private readonly STORAGE_KEY = 'matchmaking_waiting_players';

  private allowedCompositions: Array<Set<string>> = [
    new Set(['Guardian', 'Revenant', 'Duchess']),
    new Set(['Ironeye', 'Wylder', 'Recluse']),
    new Set(['Executor', 'Raider', 'Guardian']),
    new Set(['Revenant', 'Raider', 'Recluse']),
    new Set(['Ironeye', 'Duchess', 'Wylder']),
  ];

  private getWaitingPlayers(): PlayerPreferences[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private setWaitingPlayers(players: PlayerPreferences[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(players));
    } catch {
      // Ignore storage errors
    }
  }

  private generatePassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async matchPlayers(
    userId: string,
    platform: 'ps' | 'xbox' | 'pc',
    bosses: string[],
    characters: string[]
  ): Promise<PartyMatchResponse> {
    const normalisedBosses = bosses.length > 0 ? bosses : ['ALL_BOSSES'];
    
    // Get current waiting players and add this player if not already present
    let waitingPlayers = this.getWaitingPlayers();
    if (!waitingPlayers.some(p => p.userId === userId)) {
      waitingPlayers.push({ userId, platform, bosses: normalisedBosses, characters });
      this.setWaitingPlayers(waitingPlayers);
    }

    const tryAssign = (prefs: PlayerPreferences[]): Record<string, string> | null => {
      outer: for (const comp of this.allowedCompositions) {
        const charsArr = Array.from(comp);
        for (const char of charsArr) {
          if (!prefs.some(p => p.characters.includes(char))) {
            continue outer;
          }
        }
        const chars = charsArr;
        const perms: string[][] = [
          [chars[0], chars[1], chars[2]],
          [chars[0], chars[2], chars[1]],
          [chars[1], chars[0], chars[2]],
          [chars[1], chars[2], chars[0]],
          [chars[2], chars[0], chars[1]],
          [chars[2], chars[1], chars[0]],
        ];
        for (const perm of perms) {
          const map: Record<string, string> = {};
          let ok = true;
          for (let i = 0; i < 3; i++) {
            const player = prefs[i];
            const char = perm[i];
            if (!player.characters.includes(char)) { ok = false; break; }
            map[player.userId] = char;
          }
          if (ok) return map;
        }
      }
      return null;
    };

    // Refresh waiting players in case another tab made changes
    waitingPlayers = this.getWaitingPlayers();

    for (const boss of normalisedBosses) {
      const candidates = waitingPlayers.filter(p => p.platform === platform && (p.bosses.includes(boss) || p.bosses.includes('ALL_BOSSES') || boss === 'ALL_BOSSES'));
      if (candidates.length >= 3) {
        for (let i = 0; i < candidates.length - 2; i++) {
          for (let j = i + 1; j < candidates.length - 1; j++) {
            for (let k = j + 1; k < candidates.length; k++) {
              const trio = [candidates[i], candidates[j], candidates[k]];
              const assigned = tryAssign(trio);
              if (!assigned) continue;
              
              // Remove matched players from storage
              const remainingPlayers = waitingPlayers.filter(p => !trio.some(t => t.userId === p.userId));
              this.setWaitingPlayers(remainingPlayers);
              
              return {
                success: true,
                password: this.generatePassword(),
                sessionId: `session_${Date.now()}`,
                participants: trio.map(t => t.userId),
                assignedBoss: boss === 'ALL_BOSSES' ? 'Random' : boss,
                assignedCharacters: assigned,
              };
            }
          }
        }
      }
    }

    return {
      success: false,
      password: '',
      sessionId: '',
      participants: [userId],
      assignedBoss: '',
      assignedCharacters: {},
      message: 'Waiting for more players to join…',
    };
  }

  // Method to clear the queue for testing
  clearQueue(): void {
    this.setWaitingPlayers([]);
  }
}

export const matchmakingService = new MatchmakingService(); 