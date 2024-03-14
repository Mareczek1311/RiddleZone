const db = require("../../db/firebase");

function start_game(socket, io) {
  socket.on("start_game", async (data) => {
    console.log("===START_GAME===");

    io.to(data.room_id).emit("start_game");
  });
}

module.exports = start_game;
