const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let users = [];

wss.on('connection', (ws) => {
  // Store username on the WebSocket instance for reference on close
  ws.on('message', (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch (error) {
      console.error('Invalid message format:', error);
      return;
    }

    if (data.type === 'join') {
      ws.username = data.username; // Store username on the WebSocket instance
      if (!users.includes(data.username)) {
        users.push(data.username);
      }
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'userList', users }));
        }
      });
    } else if (data.type === 'message') {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'message',
            username: data.username,
            message: data.message,
          }));
        }
      });
    }
  });

  ws.on('close', () => {
    if (ws.username) {
      users = users.filter((user) => user !== ws.username);
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'userList', users }));
        }
      });
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

wss.on('listening', () => {
  console.log('WebSocket server running on ws://localhost:8080');
});

wss.on('error', (error) => {
  console.error('WebSocket server error:', error);
});