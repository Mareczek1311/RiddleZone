const db = require("../../db/firebase");

function PUT_REQ_CREATE_ROOM(socket, io) {
  socket.on("PUT_REQ_CREATE_ROOM", async (data) => {
    console.log("===PUT_REQ_CREATE_ROOM===");
    console.log(data);

    //random number from 100000 to 999999
    var room_id = Math.floor(Math.random() * 900000) + 100000;
    room_id = room_id.toString();
    const real_player_id = data.user_id;

    const roomRef = await db.collection("rooms").doc(room_id);
    const doc = await roomRef.get();

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

    docRef
      .set({
        isAdmin: true,
        isReady: false,
        realID: real_player_id,
        score: 0,
      })
      .then(() => console.log("Field added successfully"))
      .catch((error) => console.error("ERROR: Error adding field: ", error));
    
    socket.connectedToRoom = true;
    socket.join(room_id);
    socket.room_id = room_id;
    io.to(room_id).emit("PUT_RES_CREATE_ROOM", { room_id: room_id });
  });
}

module.exports = PUT_REQ_CREATE_ROOM;
