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
  const [characters, setCharacters] = React.useState<string[]>([]);
  const [errors, setErrors] = React.useState<{platform?:string,boss?:string,char?:string}>({});
  const navigate = useNavigate();

  const BOSSES = [
    'Tricephalos',
    'Gaping Jaw',
    'Sentient Pest',
    'Augur',
    'Equilibrious Beast',
    'Darkdrift Knight',
    'Fissure in the Fog',
    'Night Aspect',
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
    if (characters.length === 0) newErrors.char = 'required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;
    
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const finalBosses = allBosses ? [] : bosses;
    
    navigate('/waiting', { 
      state: { userId, platform, bosses: finalBosses, characters } 
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

      <h3 style={{marginBottom: 12}}>Characters {errors.char && <span style={{color:'red',fontSize:14}}> - {errors.char}</span>}</h3>
      <div className="char-buttons" style={{marginBottom: 24, display: 'flex', flexWrap: 'wrap', gap: 12}}>
        <button
          onClick={() => {
            if (characters.length === CHARS.length) {
              setCharacters([]);
              setErrors(prev=>({...prev,char:undefined}));
            } else {
              setCharacters([...CHARS]);
              setErrors(prev=>({...prev,char:undefined}));
            }
          }}
          className={characters.length === CHARS.length ? 'rect-btn selected' : 'rect-btn'}
          style={{minWidth: 120}}
        >
          Any character
        </button>
        {characters.length !== CHARS.length && CHARS.map(c=> (
          <button key={c} onClick={()=>{toggle(characters,c,setCharacters); setErrors(prev=>({...prev,char:undefined}));}} className={characters.includes(c)?'rect-btn selected':'rect-btn'} style={{minWidth: 120}}>{c}</button>
        ))}
      </div>

      <button className="search-btn" onClick={handleGenerate}>Generate Password</button>
      <Link to="/" className="back-btn">← Back</Link>
    </div>
  );
};

const WaitingScreen = () => {
  const location = useLocation() as any;
  const navigate = useNavigate();
  const { userId, platform, bosses, characters } = location.state || {};
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [status, setStatus] = React.useState('Connecting...');

  React.useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }

    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:4000';
    const newSocket = io(serverUrl);

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setStatus('Looking for a team for you…');
      
      // Join the matchmaking queue
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
          assignedChar: matchData.assignedCharacter 
        } 
      });
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setStatus('Connection error. Please try again.');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setStatus('Disconnected. Reconnecting...');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [userId, platform, bosses, characters, navigate]);

  return (
    <div className="screen" style={{textAlign:'center'}}>
      <h2>{status}</h2>
      <p>Please keep this tab open.</p>
      {socket && (
        <div style={{marginTop: 20, fontSize: 14, color: '#666'}}>
          Connection: {socket.connected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      )}
    </div>
  );
};

const MatchFoundScreen = () => {
  const location = useLocation() as any;
  const navigate = useNavigate();
  const { result, assignedChar } = location.state || {};
  if (!result) return <div className="screen">No match data</div>;
  return (
    <div className="screen" style={{textAlign:'center'}}>
      <h1 style={{color:'#4CAF50'}}>Match Found!</h1>
      <h3>Password</h3>
      <p style={{fontSize:24, fontWeight:'bold'}}>{result.password}</p>
      <h3>Team Composition</h3>
      <p>{Object.values(result.assignedCharacters).join(', ')}</p>
      <h3>Your Character</h3>
      <p style={{fontSize:20, fontWeight:'bold'}}>{assignedChar}</p>
      <button className="search-btn" onClick={()=>navigate('/')}>Done</button>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/expeditions" element={<ExpeditionsScreen />} />
          <Route path="/waiting" element={<WaitingScreen />} />
          <Route path="/matchfound" element={<MatchFoundScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 