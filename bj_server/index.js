// kontrola bledow!!!!!
// IF ADMIN DISCONNECTS, MAKE ADMIN THE NEXT PLAYER IN LINE

const db = require("./firebase");
const admin = require("firebase-admin");

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

async function addPlayerToRoomFirebase(room_id, player_id, real_player_id) {
  const playersCollectionRef = await db.collection("rooms").doc(room_id).collection("players");
  var isEmpty = true;
  await playersCollectionRef.get().then(snapshot => {
    if (!snapshot.empty) {
      isEmpty = false;
    } 
  }).catch(error => {
    console.error('Wystąpił błąd podczas pobierania dokumentów: ', error);
  });
  
  const docRef = await db.collection("rooms").doc(room_id).collection("players").doc(player_id);
  const doc = await docRef.get(); // Pobierz dokument\
  //Sprawdz czy w kolekcji players ktos istnieje

  console.log("isEmpty: ",isEmpty)


  if (isEmpty) {
    docRef
      .set(
        {
          isAdmin: true,
          isReady: false,
          realID: -1,
        }
      )
      .then(() => console.log("Field added successfully"))
      .catch((error) => console.error("ERROR: Error adding field: ", error));
  } else {
    docRef
      .set(
        {
          isAdmin: false,
          isReady: false,
          realID: -1,
        }
      )
      .then(() => console.log("Field added successfully"))
      .catch((error) => console.error("ERROR: Error adding field: ", error));
  }
}

async function removePlayerFromRoomFirebase(room_id, player_id) {
  const docRef = db.collection("rooms").doc(room_id).collection("players").doc(player_id);
  const isAdmin = await docRef.get().then((doc) => {
    if (doc.exists) {
      console.log("Document data:", doc.data());
      return doc.data()["isAdmin"];
    } else {
      console.log("No such document!");
      return false;
    }
  } ).catch((error) => {
    console.error("ERROR: Error getting document:", error);
  } );

  await docRef.delete().then(() => {
    console.log("Field deleted successfully");
  }).catch((error) => {
    console.error("ERROR: Error removing field: ", error);
  });

  return isAdmin;
} 

async function deleteRoom(room_id) {
  const docRef = db.collection("rooms").doc(room_id);
  await docRef.delete().then(() => {  
    console.log("Room deleted successfully");
  }).catch((error) => {
    console.error("ERROR: Error removing room: ", error);
  })
}

async function updatePlayerReady(room_id, player_id, value) {
  const docRef = db.collection("rooms").doc(room_id).collection("players").doc(player_id);
  const doc = await docRef.get();

  if (!doc.exists) {
    console.log("ERROR: No such document!");
    return;
  }

  await docRef.update({
    isReady: value,
  });
}

async function getRoomPlayers(room_id) {
  console.log("===GET_ROOM_PLAYERS===");
  const arr = {}
  const docRef = db.collection("rooms").doc(room_id).collection("players");
  await docRef.get().then(snapshot => {
    snapshot.forEach(doc => {
      arr[doc.id] = doc.data();
    });
  });

  return arr
}

function countReady(arr) {
  console.log("===COUNT_READY===");

  let counter = 0;

  for (const [key, value] of Object.entries(arr)) {
    if (value["isReady"] == true) {
      counter++;
    }
  }

  console.log("COUNTER: ", counter);

  return counter;
}

io.on("connection", (socket) => {
  console.log("===!CONNECTION!===");

  socket.on("connect_to_room", async (room_id) => {
    console.log("===CONNECT_TO_ROOM===");

    if (room_id == "") {
      room_id = "room" + Math.floor(Math.random() * 1000);
    }

    socket.join(room_id);
    socket.room_id = room_id;
    console.log("ROOM ID: ", room_id);

    await addPlayerToRoomFirebase(room_id, socket.id, -1);

    io.to(room_id).emit("get_room_id", room_id);
  });

  socket.on("get_player_data", async (room_id) => {
    const data = await getRoomPlayers(room_id);
    console.log("===GET_PLAYER_DATA===");
    console.log("DATA: ", data);
    socket.emit("send_player_data", [data[socket.id]["isAdmin"], data[socket.id]["isReady"], data[socket.id]["realID"]]);
  });

  socket.on("get_player_list", (room_id) => {
    console.log("===GET_PLAYER_LIST===");

    const room = io.sockets.adapter.rooms.get(room_id);
    const playerList = Array.from(room);

    io.to(room_id).emit("send_player_list", playerList);
    console.log("PLAYER LIST: ", playerList);
  });

  socket.on("set_state", async (data) => {
    console.log("===SET_STATE===");

    console.log("STATE FROM: ", data.ready);
    await updatePlayerReady(data.room_id, socket.id, data.ready);
    console.log("STATE TO: ", data.ready);

    console.log("counting ready players...");
    const arr = await getRoomPlayers(data.room_id);

    const counter = await countReady(arr);

    console.log("SENDING READY COUNTER?");
    io.to(data.room_id).emit("update_ready", counter);
  });

  socket.on("disconnect", async (reason) => {
    console.log("===PLAYER DISCONNECTED===");
    
    const isAdmin = await removePlayerFromRoomFirebase(socket.room_id, socket.id);

    if (isAdmin) {
      console.log("ADMIN DISCONNECTED");
      const arr2 = await getRoomPlayers(socket.room_id);

      const keys = Object.keys(arr2);
      console.log("keys: ", keys)

      if (keys.length > 0) {
        const nextAdmin = keys[0];
        console.log("NEXT ADMIN: ", nextAdmin);

        const docRef = db.collection("rooms").doc(socket.room_id).collection("players").doc(nextAdmin);
        await docRef.update({
          isAdmin: true,
        });
        socket.to(nextAdmin).emit("send_player_data", [true, arr2[nextAdmin]["isReady"], arr2[nextAdmin]["realID"]]);
      }

    }

    const arr = await getRoomPlayers(socket.room_id);
    const numberOfKeys = Object.keys(arr).length;


    if (numberOfKeys == 0) {
      deleteRoom(socket.room_id);
      return;
    }
    else{
      const room = io.sockets.adapter.rooms.get(socket.room_id);
      const playerList = Array.from(room);

      io.to(socket.room_id).emit("send_player_list", playerList);
      console.log("PLAYER LIST: ", playerList);
    }
  });
});

app.get("/", async (req, res) => {
  console.log("GET /");
});

server.listen(3001, () => {
  console.log("server running at http://localhost:3001");
});
