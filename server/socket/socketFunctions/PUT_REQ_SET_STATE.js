const db = require("../../db/firebase");

function PUT_REQ_SET_STATE(socket, io) {
  socket.on("PUT_REQ_SET_STATE", async (data) => {
    console.log("===SET_STATE===");

    const docref = db
      .collection("rooms")
      .doc(data.room_id)
      .collection("players")
      .doc(socket.id);

    await docref.update({
        isReady: data.ready,
    });

  });
}

module.exports = PUT_REQ_SET_STATE;
