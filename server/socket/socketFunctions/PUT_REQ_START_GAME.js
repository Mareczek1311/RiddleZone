const db = require("../../db/firebase");

function PUT_REQ_START_GAME(socket, io) {
  socket.on("PUT_REQ_START_GAME", async (room_id) => {
    console.log("===PUT_REQ_START_GAME===");

    const roomRef = await db.collection("rooms").doc(room_id);
    await roomRef.update({
      isStarted: true
    });

    io.to(room_id).emit("PUT_RES_START_GAME");
  });
}

module.exports = PUT_REQ_START_GAME;
