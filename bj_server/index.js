  /*
  const docRef = db.collection('users').doc('alovelace');
  await docRef.set({
    first: 'Ada',
    last: 'Lovelace',
    born: 1815
  });
*/

const db = require("./firebase")
const admin = require('firebase-admin');


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

async function createRoomFirebase(room_id){
  const docRef = db.collection('rooms').doc(room_id);
  await docRef.set({
  });
}

async function addPlayerToRoomFirebase(room_id, player_id){
  const docRef = db.collection('rooms').doc(room_id);
  await docRef.update({
    [player_id] : false
  });
}

async function removePlayerFromRoomFirebase(room_id, player_id){
  const docRef = db.collection('rooms').doc(room_id);
  
  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(docRef);
    if (!doc.exists) {
      throw "Document does not exist!";
    }

    const new_data = doc.data();
    console.log("Tablica z graczami: ", new_data);
    if (new_data.hasOwnProperty(player_id)) {
      delete new_data[player_id];
      transaction.update(docRef, { [player_id]: admin.firestore.FieldValue.delete() });
      console.log(`Gracz ${player_id} został usunięty z pokoju ${room_id}.`);
    }
    else{
      console.log(`Gracz ${player_id} nie istnieje w pokoju ${room_id}.`);
    } 
  })


}

async function updatePlayerReady(room_id, player_id, value){
  const docRef = db.collection('rooms').doc(room_id);
  await docRef.update({
    [player_id] : value
  });
}

async function getRoomPlayers(room_id){
  const docRef = db.collection('rooms').doc(room_id);
  const doc = await docRef.get();
  if (!doc.exists) {
    console.log('No such document!');
  } else {
    console.log('Document data:', doc.data());
    
    for (const [key, value] of Object.entries(doc.data())) {
      console.log(key, value);
    }

  }
}

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


  /* SIMPLE USAGE EXAMPLES
  await removePlayerFromRoomFirebase("1001", "1941789KDWOIU31241")


  await createRoomFirebase("1001")
  await addPlayerToRoomFirebase("1001", "1941789KDWOIU31241")
  await getRoomPlayers("1001")
  await updatePlayerReady("1001", "1941789KDWOIU31241", true)
  await getRoomPlayers("1001")
  */
});

server.listen(3001, () => {
  console.log("server running at http://localhost:3000");
});
