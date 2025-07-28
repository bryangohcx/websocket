import { useState } from 'react';

function Lobby({ onJoinTable }) {
  const [username, setUsername] = useState('');

  const handleJoin = () => {
    if (username.trim()) {
      onJoinTable(username);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0',
    }}>
      <div style={{
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        width: '300px',
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Lobby</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          style={{
            border: '1px solid #ccc',
            padding: '8px',
            marginBottom: '20px',
            width: '100%',
            borderRadius: '4px',
            boxSizing: 'border-box',
          }}
        />
        <button
          onClick={handleJoin}
          disabled={!username.trim()}
          style={{
            backgroundColor: username.trim() ? '#007bff' : '#ccc',
            color: '#fff',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: username.trim() ? 'pointer' : 'not-allowed',
            width: '100%',
          }}
        >
          Join Table
        </button>
      </div>
    </div>
  );
}

export default Lobby;