async function addPlayerToRoomFirebase(room_id, player_id, real_player_id) {
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
    .doc(player_id);

  console.log("isEmpty: ", isEmpty);

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
}
const db = require("../../db/firebase");


function connect_to_room(socket, io) {

  socket.emit("connect_on")

  socket.on("connect_to_room", async (data) => {
    console.log("===CONNECT_TO_ROOM===");

    socket.connectedToRoom = true;

    if (data.room_id == "") {
      data.room_id = "room" + Math.floor(Math.random() * 1000);
    }

    socket.join(data.room_id);
    socket.room_id = data.room_id;
    console.log("ROOM ID: ", data.room_id);

    const res = await addPlayerToRoomFirebase(
      data.room_id,
      socket.id,
      data.nickname
    );
      
    console.log("ROOM ID: ", data.room_id);

    io.to(data.room_id).emit("get_room_id", data.room_id);
  });
}

module.exports = connect_to_room;
