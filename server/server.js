// server.js

const http = require('http');
const app = require('./app');
const { Server } = require("socket.io");
const setupSocketHandlers = require('./socket/socketHandlers');

const PORT = process.env.PORT || 3001;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  }
});

setupSocketHandlers(io);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
