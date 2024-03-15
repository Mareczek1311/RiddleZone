
const db = require("../../db/firebase");

function get_player_list(socket, io) {
  socket.on("get_player_list", (room_id) => {
    console.log("===GET_PLAYER_LIST===");
    console.log("ROOM ID: ", room_id);
    const docRef = db.collection("rooms").doc(room_id).collection("players");

    docRef.get().then((snapshot) => {
      const arr = [];
      snapshot.forEach((doc) => {
        arr.push([doc.data()["realID"], doc.data()["isReady"]]);
      });
      io.to(room_id).emit("send_player_list", arr);
    });
  });
}

module.exports = get_player_list;
