const e = require('express');
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


  //WE SHOULD CHECK IF THE ROOM EXIST OR NOT 
  //IF NOT WE SHOULD GIVE INFO BACK AND SEND ERROR RESPONSE
  //NOW CLIENT WHO IS TRYING TO JOIN THE ROOM WILL CREATE THE ROOM
  socket.on("connect_to_room", room_id =>{
    if(room_id == ""){
      room_id = "room" + Math.floor(Math.random() * 1000);
    }
  
    socket.join("ROOM ID: ", room_id)
    console.log(room_id)
  
    socket.emit("get_room_id", room_id)
  })
  

});


app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

server.listen(3001, () => {
  console.log('server running at http://localhost:3000');
});