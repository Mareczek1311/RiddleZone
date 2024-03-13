const db = require("../../db/firebase");

function restart_game(socket, io) {
  socket.on("restart_game", async (room_id) => {
    console.log("===RESTART_GAME===");

    const docRef = db.collection("rooms").doc(room_id);

    docRef
      .update({
        currQuestion: 1,
        answered: 0,
        questionSet: "",
      })
      .then(() => {
        console.log("Field added successfully");
      })
      .catch((error) => {
        console.error("ERROR: Error adding field: ", error);
      });

    const docRef2 = db.collection("rooms").doc(room_id).collection("players");
    await docRef2.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        docRef2.doc(doc.id).update({
          score: 0,
          isReady: false,
        });
      });
    });

    io.to(room_id).emit("restart_game");
  });
}

module.exports = restart_game;
