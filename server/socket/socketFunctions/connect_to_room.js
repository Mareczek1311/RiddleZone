
const db = require("../../db/firebase");


/*
  socket.on("connect_to_room", async (data) => {
    console.log("===CONNECT_TO_ROOM===");

    console.log("Room id: ", data.room_id)

    if (data.room_id == "") {
      console.log("ERROR: Room ID is empty");
      socket.emit("RES_connect_to_room", "ERROR");
      return;
    }

    //check if room exists

    const real_player_id = data.nickname;

    const roomRef = await db.collection("rooms").doc(data.room_id);
    var roomExists = false;
    const doc = await roomRef.get();

    if (doc.exists) {
      roomExists = true;
    } else {
      roomExists = false;
    }

    if (!roomExists) {
      console.log("ERROR: Room does not exist");
      socket.emit("RES_connect_to_room", "ERROR");
      return;
    }

    const playersCollectionRef = await db
      .collection("rooms")
      .doc(data.room_id)
      .collection("players");
    var isEmpty = true;
    await playersCollectionRef
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          isEmpty = false;
        }
      })
      .catch((error) => {
        console.error("Wystąpił błąd podczas pobierania dokumentów: ", error);
      });
  
    const docRef = await db
      .collection("rooms")
      .doc(data.room_id)
      .collection("players")
      .doc(socket.id);
  
  
    if (isEmpty) {
      docRef
        .set({
          isAdmin: true,
          isReady: false,
          realID: real_player_id,
          score: 0,
        })
        .then(() => console.log("Field added successfully"))
        .catch((error) => console.error("ERROR: Error adding field: ", error));
    } else {
      docRef
        .set({
          isAdmin: false,
          isReady: false,
          realID: real_player_id,
          score: 0,
        })
        .then(() => console.log("Field added successfully"))
        .catch((error) => console.error("ERROR: Error adding field: ", error));
    }
  

    socket.connectedToRoom = true;

    socket.join(data.room_id);
    socket.room_id = data.room_id;

    io.to(data.room_id).emit("RES_connect_to_room", { room_id: data.room_id });
    
    old code
    */
function connect_to_room(socket, io) {
  socket.on("connect_to_room", async (data) => {
    const room_id = data.room_id;
    const real_player_id = data.nickname;

    if (room_id == "") {
      console.log("ERROR: Room ID is empty");
      socket.emit("RES_connect_to_room", "ERROR ROOM ID EMPTY");
      return;
    }

    //create room if not exists
    const roomRef = await db.collection("rooms").doc(room_id);
    const doc = await roomRef.get();

    if(!doc.exists) {
      console.log("ERROR: Room does not exist");
      socket.emit("RES_connect_to_room", "ERROR");
      return;
    }

    const docRef = await db.collection("rooms").doc(room_id).collection("players").doc(socket.id);
    const playerDoc = await docRef.get();
    if (playerDoc.exists) {
      console.log("ERROR: Player already exists");
      socket.emit("RES_connect_to_room", "ERROR PLAYER EXISTS");
      return;
    }

    docRef
    .set({
      isAdmin: false,
      isReady: false,
      realID: real_player_id,
      score: 0,
    })
    .then(() => console.log("Field added successfully"))

    socket.connectedToRoom = true;
    socket.join(room_id);
    socket.room_id = room_id;

    io.to(room_id).emit("RES_connect_to_room", { room_id: room_id });
  });
}

module.exports = connect_to_room;
