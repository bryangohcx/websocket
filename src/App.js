import { useState, useEffect } from 'react';
import Lobby from './components/Lobby';
import Table from './components/Table';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('lobby');
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [gameState, setGameState] = useState({ cards: {}, winner: null });
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const wsUrl = process.env.NODE_ENV === 'production' ? 'wss://' + window.location.host : 'ws://localhost:8080';
    const websocket = new WebSocket(wsUrl);
    setWs(websocket);

    websocket.onopen = () => {
      console.log('WebSocket connected');
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        setMessages((prev) => [...prev, `${data.username}: ${data.message}`]);
      } else if (data.type === 'userList') {
        setUsers(data.users);
      } else if (data.type === 'game') {
        setGameState({ cards: data.cards, winner: data.winner });
      }
    };

    websocket.onclose = () => {
      setMessages((prev) => [...prev, 'Disconnected from server']);
      setUsers([]);
      setGameState({ cards: {}, winner: null });
    };

    return () => {
      websocket.close();
    };
  }, []);

  const handleJoinTable = (name) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      setUsername(name);
      ws.send(JSON.stringify({ type: 'join', username: name }));
      setCurrentView('table');
    }
  };

  const handleBackToLobby = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'leave', username }));
    }
    setCurrentView('lobby');
  };

  const sendMessage = (message) => {
    if (message.trim() && ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'message', username, message }));
    }
  };

  const dealCards = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'deal' }));
    }
  };

  return (
    <div>
      {currentView === 'lobby' ? (
        <Lobby onJoinTable={handleJoinTable} />
      ) : (
        <Table
          username={username}
          messages={messages}
          users={users}
          gameState={gameState}
          onBackToLobby={handleBackToLobby}
          sendMessage={sendMessage}
          dealCards={dealCards}
        />
      )}
    </div>
  );
}

export default App;