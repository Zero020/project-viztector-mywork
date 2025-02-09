const WebSocket = require('ws');

const server = new WebSocket.Server({ host: '127.0.0.1', port: 8081 });

server.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message); 
    console.log('Received:', data);

    // Example byte array to send back to the client
    const exampleByteArray = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10 /* Image byte array data */]);
    ws.send(exampleByteArray.buffer);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

console.log('WebSocket server is running on ws://127.0.0.1:8081');
