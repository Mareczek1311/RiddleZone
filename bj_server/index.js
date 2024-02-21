
  /*
  await docRef.set({
    first: 'Ada',
    last: 'Lovelace',
    born: 1815
  });
  */

  
const db = require("./firebase")

const e = require("express");
const express = require("express");
const { createServer } = require("node:http");

const { join } = require("node:path");

const { Server } = require("socket.io");

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("connect_to_room", (room_id) => {
    if (room_id == "") {
      room_id = "room" + Math.floor(Math.random() * 1000);
    }

    socket.join(room_id);
    console.log("ROOM ID: ", room_id);

    io.to(room_id).emit("get_room_id", room_id);
  });

  socket.on("get_player_list", (room_id) => {
    console.log("WE GOT:", room_id);

    const room = io.sockets.adapter.rooms.get(room_id);
    if (room) {
      const playerList = Array.from(room);

      io.to(room_id).emit("send_player_list", playerList);
      console.log(room);
    } else {
      console.log("Room not found or empty");
    }
  });

  socket.on("ready", () => {})

  socket.on("disconnect", (reason) => {
    console.log("PLAYER DISCONNECTED");
  });


});

app.get("/", async (req, res) => {
  console.log("GET /");
  const docRef = db.collection('users').doc('alovelace');

});

server.listen(3001, () => {
  console.log("server running at http://localhost:3000");
});
