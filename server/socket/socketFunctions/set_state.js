const db = require("../../db/firebase");

async function updatePlayerReady(room_id, player_id, value) {
  const docRef = db
    .collection("rooms")
    .doc(room_id)
    .collection("players")
    .doc(player_id);
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
  const arr = {};
  const docRef = db.collection("rooms").doc(room_id).collection("players");
  await docRef.get().then((snapshot) => {
    snapshot.forEach((doc) => {
      arr[doc.id] = doc.data();
    });
  });

  return arr;
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

function set_state(socket, io) {
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
}

module.exports = set_state;
