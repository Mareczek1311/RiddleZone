const db = require("../../db/firebase");


function get_player_data(socket, io) {
  socket.on("get_player_data", async (room_id) => {
    const docRef = db
      .collection("rooms")
      .doc(room_id)
      .collection("players")
      .doc(socket.id);
    const doc = await docRef.get();

    const data = doc.data();

    console.log("===GET_PLAYER_DATA===");
    console.log("DATA: ", data);

    if (data == undefined) {
      socket.emit("error_send_player_data", "Player not found");
      return;
    }

    socket.emit("send_player_data", [
      data.isAdmin,
      data.isReady,
      data.realID,
      data.score,
    ]);
  });
}

module.exports = get_player_data;
