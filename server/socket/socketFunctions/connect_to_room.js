async function addPlayerToRoomFirebase(
  room_id,
  player_id,
  real_player_id,
  socket
) {

  console.log("room_id: ", room_id);

  //check if room_id exist in database
  const roomRef = await db.collection("rooms").doc(room_id).get() 
  if (!roomRef.exists) {
    console.log("No such document!");
    return false;
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

  return true;
}
const db = require("../../db/firebase");

function connect_to_room(socket, io) {
  socket.emit("connect_on");

  socket.on("connect_to_room", async (data) => {
    console.log("===CONNECT_TO_ROOM===");

    if (data.room_id == "") {
      socket.emit("RES_connect_to_room", "ERROR");
    }

    const res = await addPlayerToRoomFirebase(
      data.room_id,
      socket.id,
      data.nickname,
      socket
    );

    if (res == false) {
      socket.emit("RES_connect_to_room", { room_id: "ERROR" });
      console.log("ERROR - NO ROOM");
      return false;
    }

    socket.connectedToRoom = true;

    socket.join(data.room_id);
    socket.room_id = data.room_id;
    console.log("ROOM ID: ", data.room_id);

    io.to(data.room_id).emit("RES_connect_to_room", {room_id: data.room_id}  );
  });
}

module.exports = connect_to_room;
