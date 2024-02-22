// kontrola bledow!!!!!

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
  const docRef = await db.collection("rooms").doc(room_id);
  const doc = await docRef.get(); // Pobierz dokument

  if (!doc.exists) {
    docRef
      .set(
        {
          // 0 - isReady, 1 - admin, 2 - real_player_id
          [player_id]: [false, true, real_player_id],
        },
        { merge: true }
      )
      .then(() => console.log("Field added successfully"))
      .catch((error) => console.error("ERROR: Error adding field: ", error));
  } else {
    docRef
      .update({
        [player_id]: [false, false, real_player_id],
      })
      .then(() => console.log("Field added successfully"))
      .catch((error) => console.error("ERROR: Error adding field: ", error));
  }
}

async function removePlayerFromRoomFirebase(room_id, player_id) {
  const docRef = db.collection("rooms").doc(room_id);

  await db.runTransaction(async (transaction) => {
    const doc = await transaction
      .get(docRef)
      .catch((error) =>
        console.error("ERROR: Error getting document: ", error)
      );
    if (!doc.exists) {
      throw "Document does not exist!";
    }

    const new_data = doc.data();

    if (new_data.hasOwnProperty(player_id)) {
      delete new_data[player_id];
      transaction.update(docRef, {
        [player_id]: admin.firestore.FieldValue.delete(),
      });
      console.log(`Gracz ${player_id} został usunięty z pokoju ${room_id}.`);
    } else {
      console.log(`Gracz ${player_id} nie istnieje w pokoju ${room_id}.`);
    }
  });
}

async function deleteRoom(room_id) {
  const docRef = db.collection("rooms").doc(room_id);
  await docRef.delete();
}

async function updatePlayerReady(room_id, player_id, value) {
  const docRef = db.collection("rooms").doc(room_id);
  const doc = await docRef.get();

  if (!doc.exists) {
    console.log("ERROR: No such document!");
    return;
  }

  const copy = doc.data()[player_id];

  await docRef.update({
    [player_id]: [value, copy[1], copy[2]],
  });
}

async function getRoomPlayers(room_id) {
  console.log("===GET_ROOM_PLAYERS===");

  const docRef = db.collection("rooms").doc(room_id);
  const doc = await docRef.get();
  if (!doc.exists) {
    console.log("ERROR: No such document!");
    return -1;
  }
  console.log("DATA RECEIVED: ", doc.data());

  return doc.data();
}

function countReady(arr) {
  console.log("===COUNT_READY===");

  let counter = 0;

  for (const [key, value] of Object.entries(arr)) {
    if (value[0] == true) {
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
    socket.emit("send_player_data", data[socket.id]);
  });

  socket.on("get_player_list", (room_id) => {
    console.log("===GET_PLAYER_LIST===");

    const room = io.sockets.adapter.rooms.get(room_id);
    if (room) {
      const playerList = Array.from(room);

      io.to(room_id).emit("send_player_list", playerList);
      console.log("PLAYER LIST: ", playerList);
    } else {
      console.log("ERROR: Room not found or empty");
    }
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
    await removePlayerFromRoomFirebase(socket.room_id, socket.id);

    const arr = await getRoomPlayers(socket.room_id);
    const numberOfKeys = Object.keys(arr).length;

    if (numberOfKeys == 0) {
      deleteRoom(socket.room_id);
      return;
    }
  });
});

app.get("/", async (req, res) => {
  console.log("GET /");
});

server.listen(3001, () => {
  console.log("server running at http://localhost:3001");
});
