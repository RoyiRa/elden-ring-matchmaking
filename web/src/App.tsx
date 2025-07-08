import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import { io, Socket } from 'socket.io-client';

// Simple components for web
const HomeScreen = () => {
  return (
  <div className="screen">
    <h1>Elden Ring Matchmaking</h1>
    <p>Find your perfect co-op partner</p>
    <div className="quick-actions">
        <Link to="/expeditions" className="action-card">
          <h3>⚔️ Expeditions</h3>
          <p>Form 3-player parties</p>
      </Link>
      </div>
      
      <div style={{marginTop: 20, padding: 15, backgroundColor: '#f5f5f5', borderRadius: 8}}>
        <h3>Production Ready</h3>
        <p>This version connects to a real server for worldwide matchmaking!</p>
        <p>Server: {process.env.REACT_APP_SERVER_URL || 'http://localhost:4000'}</p>
      </div>
  </div>
);
};

const ExpeditionsScreen = () => {
  const [platform, setPlatform] = React.useState('');
  const [allBosses, setAllBosses] = React.useState(false);
  const [bosses, setBosses] = React.useState<string[]>([]);
  const [characters, setCharacters] = React.useState<string[]>([]); // kept for future use
  const [errors, setErrors] = React.useState<{platform?:string,boss?:string,char?:string}>({});
  const navigate = useNavigate();

  const BOSSES = [
    'Tricephalos',
    'Tricephalos (Heroic)',
    'Gaping Jaw',
    'Gaping Jaw (Heroic)',
    'Sentient Pest',
    'Sentient Pest (Heroic)',
    'Augur',
    'Augur (Heroic)',
    'Equilibrious Beast',
    'Equilibrious Beast (Heroic)',
    'Darkdrift Knight',
    'Darkdrift Knight (Heroic)',
    'Fissure in the Fog',
    'Fissure in the Fog (Heroic)',
    'Night Aspect',
    'Night Aspect (Heroic)',
  ];
  const CHARS = [
    'Revenant',
    'Wylder',
    'Guardian',
    'Ironeye',
    'Duchess',
    'Raider',
    'Recluse',
    'Executor',
  ];

  const toggle = (list: string[], item: string, setter: (v: string[]) => void) => {
    setter(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const handleGenerate = () => {
    const newErrors: any = {};
    if (!platform) newErrors.platform = 'required';
    if (!allBosses && bosses.length === 0) newErrors.boss = 'required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;
    
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const finalBosses = allBosses ? [] : bosses;
    const finalCharacters = characters.length === 0 ? CHARS : characters; // default to all
    
    navigate('/waiting', { 
      state: { userId, platform, bosses: finalBosses, characters: finalCharacters } 
    });
  };

  return (
  <div className="screen">
      <h1>Expeditions</h1>

      <h3 style={{marginBottom: 12}}>Platform {errors.platform && <span style={{color:'red',fontSize:14}}> - {errors.platform}</span>}</h3>
      <div className="platform-buttons" style={{marginBottom: 24, display: 'flex', flexWrap: 'wrap', gap: 12}}>
        {['ps','xbox','pc'].map(p => (
          <button
            key={p}
            className={platform === p ? 'rect-btn selected' : 'rect-btn'}
            style={{minWidth: 120}}
            onClick={() => {setPlatform(p); setErrors(prev=>({...prev,platform:undefined}));}}
          >
            {p.toUpperCase()}
          </button>
        ))}
      </div>

      <h3 style={{marginBottom: 12}}>Bosses {errors.boss && <span style={{color:'red',fontSize:14}}> - {errors.boss}</span>}</h3>
      <div className="boss-buttons" style={{marginBottom: 24, display: 'flex', flexWrap: 'wrap', gap: 12}}>
        <button onClick={()=>{setAllBosses(!allBosses); setBosses([]); setErrors(prev=>({...prev,boss:undefined}));}} className={allBosses?'rect-btn selected':'rect-btn'} style={{minWidth: 120}}>
          Any boss
        </button>
        {!allBosses && BOSSES.map(b=> (
          <button key={b} onClick={()=>{toggle(bosses,b,setBosses); setErrors(prev=>({...prev,boss:undefined}));}} className={bosses.includes(b)?'rect-btn selected':'rect-btn'} style={{minWidth: 120}}>{b}</button>
        ))}
      </div>

      {/* <h3 style={{marginBottom: 12}}>Characters {errors.char && <span style={{color:'red',fontSize:14}}> - {errors.char}</span>}</h3> */}
      {/* Character selection hidden for now */}

      <button className="search-btn" onClick={handleGenerate}>Generate Password</button>
  </div>
);
};

const WaitingScreen = () => {
  const location = useLocation() as any;
  const navigate = useNavigate();
  const { userId, platform, bosses, characters } = location.state || {};
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [status, setStatus] = React.useState('Connecting...');
  const [waitTime, setWaitTime] = React.useState(0);

  React.useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }

    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:4000';
    const newSocket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      upgrade: true,
      timeout: 20000,
      forceNew: true
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setStatus('Looking for a team for you…');
      newSocket.emit('join_queue', {
        userId,
        platform,
        bosses,
        characters
      });
    });

    newSocket.on('match_found', (matchData) => {
      console.log('Match found!', matchData);
      navigate('/matchfound', { 
        state: { 
          result: matchData,
          userId,
        } 
      });
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      console.error('Server URL:', serverUrl);
      setStatus(`Connection error: ${error.message || 'Unknown error'}. Please try again.`);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setStatus('Disconnected. Reconnecting...');
    });

    setSocket(newSocket);

    // Timer logic
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setWaitTime(elapsed);
    }, 1000);

    return () => {
      newSocket.close();
      clearInterval(timer);
    };
  }, [userId, platform, bosses, characters, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="screen" style={{textAlign:'center'}}>
      <h2>{status}</h2>
      <div style={{ marginTop: 20, minWidth: 160 }}>
        <div style={{ 
          fontSize: 28, 
          fontWeight: 'bold', 
          color: '#fff',
          fontFamily: 'monospace',
          letterSpacing: 1
        }}>
          {formatTime(waitTime)}
      </div>
      </div>
      <p style={{ marginTop: 20 }}>Please keep this tab open.</p>
      {socket && (
        <div style={{marginTop: 20, fontSize: 14, color: '#666'}}>
          Connection: {socket.connected ? '🟢 Connected' : '🔴 Disconnected'}
    </div>
      )}
      <div style={{ marginTop: 30 }}>
        <Link to="/" className="back-btn">
          ← Cancel & Go Back
        </Link>
      </div>
  </div>
);
};

const MatchFoundScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, userId } = location.state || {};
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [messages, setMessages] = React.useState<{user: string, text: string}[]>([]);
  const [input, setInput] = React.useState('');

  const playerIndex = result && result.participants ? result.participants.indexOf(userId) : -1;
  const playerName = playerIndex >= 0 ? `Player ${playerIndex + 1}` : 'Player';

  React.useEffect(() => {
    if (!result) return;
    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:4000';
    const newSocket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      upgrade: true,
      timeout: 20000,
      forceNew: true
    });
    // Join the match room
    newSocket.emit('join_match_room', { password: result.password, user: playerName });
    newSocket.on('chat_message', (msg: {user: string, text: string}) => {
      setMessages(prev => [...prev, msg]);
    });
    setSocket(newSocket);
    return () => { newSocket.close(); };
  }, [result, userId]);

  // ---------------------
  // New: notify party when user leaves
  const handleLeave = () => {
    if (socket && result) {
      socket.emit('chat_message', {
        room: result.password,
        user: 'system',
        text: `${playerName} has left the party.`,
      });
      socket.close();
    }
    navigate('/');
  };
  // ---------------------

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && socket) {
      socket.emit('chat_message', { room: result.password, user: playerName, text: input });
      setInput('');
    }
  };

  if (!result) {
    return <div className="screen">No match data</div>;
  }

  return (
    <div className="screen" style={{ textAlign: 'center' }}>
      <h1 style={{ color: '#4CAF50' }}>Match Found!</h1>
      <h3>Password</h3>
      <p style={{ fontSize: 24, fontWeight: 'bold' }}>{result.password}</p>
      <h3>Boss</h3>
      <p style={{ fontSize: 18, fontWeight: 'bold' }}>{result.assignedBoss && result.assignedBoss !== 'Random' ? result.assignedBoss : (result.actualBoss || 'Random Boss')}</p>
      {/* Team composition and personal character hidden for now */}
      {/* Chat area */}
      <div style={{ margin: '32px auto 0', maxWidth: 400, background: '#222', borderRadius: 8, padding: 16, color: '#fff', textAlign: 'left' }}>
        <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Party Chat</div>
        <div style={{ minHeight: 80, maxHeight: 180, overflowY: 'auto', marginBottom: 8, background: '#181818', borderRadius: 4, padding: 8 }}>
          {messages.length === 0 && <div style={{ color: '#aaa' }}>No messages yet.</div>}
          {messages.map((msg, i) => (
            msg.user === 'system' ? (
              <div key={i} style={{ marginBottom: 4, color: '#aaa', fontStyle: 'italic', textAlign: 'left' }}>{msg.text}</div>
            ) : (
              <div key={i} style={{ marginBottom: 4 }}>
                <span style={{ color: msg.user === playerName ? '#4CAF50' : '#fff', fontWeight: msg.user === playerName ? 'bold' : 'normal' }}>{msg.user}:</span> <span>{msg.text}</span>
    </div>
            )
          ))}
      </div>
        <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{ flex: 1, borderRadius: 4, border: '1px solid #444', padding: 6, background: '#111', color: '#fff' }}
            autoComplete="off"
          />
          <button type="submit" style={{ background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 4, padding: '0 16px', fontWeight: 'bold', cursor: 'pointer' }}>Send</button>
        </form>
      </div>
      {result.discordInvite && (
        <a href={result.discordInvite} target="_blank" rel="noopener noreferrer" style={{
          display:'inline-block',
          marginTop:16,
          background:'#5865F2',
          color:'#fff',
          padding:'8px 16px',
          borderRadius:4,
          textDecoration:'none',
          fontWeight:'bold'
        }}>
          🎤 Join Discord Voice {result.discordChannelName ? `(Room ${result.discordChannelName})` : ''}
        </a>
      )}
      <button className="search-btn" onClick={handleLeave}>Leave</button>
  </div>
);
};

function App() {
  React.useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/metrics/visit`, { method: 'POST' })
      .catch(() => {});          // fire & forget
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ExpeditionsScreen />} />
          <Route path="/waiting" element={<WaitingScreen />} />
          <Route path="/matchfound" element={<MatchFoundScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 