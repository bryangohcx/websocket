const WebSocket = require('ws');
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle all routes by serving index.html for client-side routing
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the HTTP server
const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`HTTP server running on port ${server.address().port}`);
});

// Set up WebSocket server
const wss = new WebSocket.Server({ server });
let users = [];

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch (error) {
      console.error('Invalid message format:', error);
      return;
    }

    if (data.type === 'join') {
      ws.username = data.username;
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

wss.on('error', (error) => {
  console.error('WebSocket server error:', error);
});