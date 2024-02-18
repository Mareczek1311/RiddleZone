const express = require('express');
const { createServer } = require('node:http');

const { join } = require('node:path');

const { Server } = require('socket.io');


const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on("Hello", (arg)=>{
    console.log(arg)
  })

});


app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

server.listen(3001, () => {
  console.log('server running at http://localhost:3000');
});