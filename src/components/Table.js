import { useState } from 'react';

function Table({ username, messages, users, gameState, onBackToLobby, sendMessage, dealCards }) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    sendMessage(message);
    setMessage('');
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
        width: '600px',
        maxWidth: '90%',
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Table</h1>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Users:</h2>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
            {users.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Cards:</h2>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
            {Object.entries(gameState.cards).map(([player, card]) => (
              <li key={player}>{player}: {card}</li>
            ))}
          </ul>
          {gameState.winner && (
            <p style={{ fontWeight: 'bold', color: '#28a745' }}>
              Winner: {gameState.winner}
            </p>
          )}
        </div>
        <button
          onClick={dealCards}
          style={{
            backgroundColor: '#28a745',
            color: '#fff',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '20px',
            width: '100%',
          }}
        >
          Deal Cards
        </button>
        <div style={{
          height: '300px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: '10px',
          marginBottom: '20px',
        }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ marginBottom: '5px' }}>{msg}</div>
          ))}
        </div>
        <div style={{ display: 'flex', marginBottom: '20px' }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            style={{
              border: '1px solid #ccc',
              padding: '8px',
              flexGrow: '1',
              borderRadius: '4px 0 0 4px',
              boxSizing: 'border-box',
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            style={{
              backgroundColor: '#007bff',
              color: '#fff',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '0 4px 4px 0',
              cursor: 'pointer',
            }}
          >
            Send
          </button>
        </div>
        <button
          onClick={onBackToLobby}
          style={{
            backgroundColor: '#dc3545',
            color: '#fff',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Back to Lobby
        </button>
      </div>
    </div>
  );
}

export default Table;