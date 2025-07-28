import { useState, useEffect } from 'react';
import Lobby from './components/Lobby';
import Table from './components/Table';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('lobby');
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const websocket = new WebSocket('https://websocket-cgma.onrender.com');
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
      }
    };

    websocket.onclose = () => {
      setMessages((prev) => [...prev, 'Disconnected from server']);
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
    setCurrentView('lobby');
  };

  const sendMessage = (message) => {
    if (message.trim() && ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'message', username, message }));
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
          onBackToLobby={handleBackToLobby}
          sendMessage={sendMessage}
        />
      )}
    </div>
  );
}

export default App;