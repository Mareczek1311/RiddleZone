const db = require("../../db/firebase");

function PUT_REQ_JOIN_ROOM(socket, io) {
  socket.on("PUT_REQ_JOIN_ROOM", async (data) => {
    console.log("DATA: ", data)
    const real_player_id = data.user_id;
    const room_id = data.room_id;

    if (room_id == "") {
      console.log("ERROR: Room ID is empty");
      socket.emit("PUT_RES_JOIN_ROOM", "ERROR");
      return;
    }

    const roomRef = await db.collection("rooms").doc(room_id);
    const doc = await roomRef.get();

    if(!doc.exists) {
      console.log("ERROR: Room does not exist");
      socket.emit("PUT_RES_JOIN_ROOM", "ERROR");
      return;
    }


    const playersCollectionRef = await db
      .collection("rooms")
      .doc(room_id)
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
      .doc(room_id)
      .collection("players")
      .doc(socket.id);

   
    if (isEmpty) {
      docRef
      .set({
        isAdmin: true,
        isReady: false,
        realID: real_player_id,
        score: 0,
        answered: false,
      })
    }
    else{
      docRef
      .set({
        isAdmin: false,
        isReady: false,
        realID: real_player_id,
        score: 0,
        answered: false,
      })
    }

    socket.connectedToRoom = true;
    socket.join(room_id);
    socket.room_id = room_id;

    io.to(room_id).emit("PUT_RES_JOIN_ROOM", {room_id: room_id});
  });
}

module.exports = PUT_REQ_JOIN_ROOM;
